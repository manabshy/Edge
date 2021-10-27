import { Component, OnInit, Input } from '@angular/core';
import { LeadsService } from '../shared/leads.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Lead, LeadSearchInfo, ListingType } from '../shared/lead';
import { StaffMember, Office } from 'src/app/shared/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DropdownListInfo, InfoDetail, InfoService } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { AppUtils } from 'src/app/core/shared/utils';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { addDays } from 'date-fns';

const PAGE_SIZE = 40;
@Component({
  selector: 'app-lead-register',
  templateUrl: '../lead-register/lead-register.component.html',
  styleUrls: ['../lead-register/lead-register.component.scss'],
})
export class LeadRegisterComponent implements OnInit {
  @Input() bottomReached: boolean;
  @Input() showFilterOptions = true;
  areLeadsAssignable = false;
  currentStaffMember: StaffMember;
  listInfo: any;
  leadTypes: InfoDetail[];
  leadRegisterForm: FormGroup;
  staffMembers: StaffMember[];
  offices: Office[];
  page = 0;
  groupsLength: number;
  filteredLeads: Lead[];
  leadSearchInfo: LeadSearchInfo;
  enableOwnerFilter = true;
  selectedLeadsForAssignment: Lead[] = [];
  isSelectAllChecked = false;
  searchTerm = '';
  errorMessage: WedgeError;
  info: string;
  isClosedIncluded: boolean;
  canSeeUnassignable = false;
  isAdvancedSearchVisible = false;
  showModal = false;
  newLeadOwnerId: number;
  locale = 'en-gb';
  isLoading = false;
  queryResultCount: number;
  isClosedLeadFound = false;
  isSubmitting = false;
  defaultListingType = ListingType.MyLeads;

  leadFilters: { name: string; value: number }[] = [
    { value: 1, name: 'My leads' },
    { value: 2, name: 'Other user leads' },
    { value: 4, name: 'Unassigned leads' },
  ];

  get officeIdsControl(): FormControl {
    return this.leadRegisterForm?.get('officeIds') as FormControl;
  }

  get leadTypeIdsControl(): FormControl {
    return this.leadRegisterForm?.get('leadTypeIds') as FormControl;
  }

  get dateFromControl(): FormControl {
    return this.leadRegisterForm?.get('dateFrom') as FormControl;
  }

  get dateToControl(): FormControl {
    return this.leadRegisterForm?.get('dateTo') as FormControl;
  }

  get listingTypeControl(): FormControl {
    return this.leadRegisterForm?.get('listingType') as FormControl;
  }

  constructor(
    private leadService: LeadsService,
    private sharedService: SharedService,
    private staffMemberService: StaffMemberService,
    private storage: StorageMap,
    private infoService: InfoService,
    private messageService: MessageService,
    private localeService: BsLocaleService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.localeService.use(this.locale);
  }

  ngOnInit() {
    this.getLeadsForCurrentUser();
    this.setupLeadRegisterForm();

    this.getInfoFromLocalStorage();

    // New search term
    this.leadService.leadSearchTermChanges$.subscribe((newSearchTerm) => {
      if (newSearchTerm) {
        this.leadRegisterForm.get('leadSearchTerm').setValue(newSearchTerm);
        this.leadSearchInfo = this.getSearchInfo(true);
      } else {
        AppUtils.leadSearchTerm = '';
        this.leadRegisterForm.patchValue({
          leadSearchTerm: '',
        });
      }
      this.PerformSearch();
    });

    this.listingTypeControl.valueChanges.subscribe((input) => {
      console.log({ input });
      this.isSubmitting = false;
    });
  }

  getLeadsForCurrentUser() {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
        this.bottomReached = false;
        const seeAllLeadsPermission = this.currentStaffMember.permissions.find((x) => x.permissionId === 69);
        seeAllLeadsPermission ? (this.canSeeUnassignable = true) : (this.canSeeUnassignable = false);
        this.defaultListingType = this.canSeeUnassignable ? ListingType.OtherUserLeads : ListingType.MyLeads;
        localStorage.setItem('listingType', this.defaultListingType.toString());
        this.page = 0;
        this.leadSearchInfo = {
          page: this.page,
          ownerId: this.currentStaffMember.staffMemberId,
          personId: null,
          leadTypeId: null,
          officeId: null,
          dateFrom: null,
          dateTo: null,
          listingType: this.defaultListingType,
          includeClosedLeads: false,
          includeUnassignedLeadsOnly: false,
          leadSearchTerm: this.searchTerm ? this.searchTerm : '',
        };
        if (AppUtils.leadSearchInfo) {
          this.leadSearchInfo = AppUtils.leadSearchInfo;
          this.searchTerm = AppUtils.leadSearchInfo.leadSearchTerm;
        }
      } else {
        this.leadSearchInfo = this.getSearchInfo(true);
      }
      this.leadRegisterForm.patchValue(this.leadSearchInfo);
      this.getLeads(this.leadSearchInfo); // Investigate asap
    });
  }

  getInfoFromLocalStorage() {
    // Lead Types
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.leadTypes = data.leadTypes;
      } else {
        this.infoService.getDropdownListInfo().subscribe((res) => (this.leadTypes = res.leadTypes));
      }
    });

    this.storage.get('activeStaffmembers').subscribe((data) => {
      if (data) {
        this.staffMembers = data as StaffMember[];
      }
    });
  }

  setupLeadRegisterForm() {
    this.leadRegisterForm = this.fb.group({
      ownerId: [],
      officeIds: [''],
      leadTypeIds: [],
      includeClosedLeads: [],
      dateFrom: [],
      dateTo: [],
      listingType: [this.defaultListingType],
      includeUnassignedLeadsOnly: [false],
      leadSearchTerm: [''],
    });
  }

  getLeads(leadSearchInfo: LeadSearchInfo) {
    this.isLoading = true;
    this.leadService.getLeads(leadSearchInfo, PAGE_SIZE).subscribe((result) => {
      if (result) {
        this.isLoading = false;
        this.queryResultCount = 0;
        if (result.length > 0) this.queryResultCount = result[0].leadsQueryCount;

        if (leadSearchInfo.page === 1) {
          this.filteredLeads = result;
          window.scrollTo(0, 0);
        } else {
          if (this.filteredLeads) {
            this.filteredLeads = this.filteredLeads.concat(result);
          } else {
            this.filteredLeads = result;
          }
        }
        this.isClosedLeadFound = this.checkClosedLead(this.filteredLeads);
        this.setBottomReachedFlag(result);
      }
    });
  }

  checkClosedLead(leads: Lead[]) {
    return !!leads?.find((x) => x.closedById);
  }

  private setBottomReachedFlag(result: Lead[]) {
    if (result && (!result.length || result.length < +PAGE_SIZE)) {
      this.bottomReached = true;
    } else {
      this.bottomReached = false;
    }
  }

  assignLeads() {
    event.preventDefault();
    this.areLeadsAssignable = true;
    this.filteredLeads?.forEach((x) => (x.isChecked = false));
  }

  toggleSelectAllLeads() {
    this.isSelectAllChecked = !this.isSelectAllChecked;
    this.selectAllLeadsForAssignment(this.isSelectAllChecked);
  }

  selectLead(lead?: Lead) {
    this.leadService.leadsChanged(lead);
  }

  selectLeadForAssignment(lead?: Lead) {
    lead.isChecked = !lead.isChecked;
    this.getSelectedLeads();
  }

  selectAllLeadsForAssignment(isSelectAllChecked: boolean) {
    if (isSelectAllChecked) {
      this.filteredLeads.forEach((x) => {
        x.isChecked = true;
      });
    } else {
      this.filteredLeads.forEach((x) => {
        x.isChecked = false;
      });
    }

    this.getSelectedLeads();
  }

  getSelectedLeads() {
    this.selectedLeadsForAssignment = this.filteredLeads.filter((x) => x.isChecked);
  }

  onOwnerChanged(event: any) {
    console.log(event);
  }

  setLeadSearchTerm(term: string) {
    if (term) {
      this.leadRegisterForm.patchValue({
        leadSearchTerm: term,
      });
      this.leadSearchInfo = this.getSearchInfo(true);
    } else {
      this.leadRegisterForm.patchValue({ leadSearchTerm: '' });
    }
  }

  private getSearchInfo(newSearch: boolean) {
    let info: LeadSearchInfo;
    if (this.leadRegisterForm) {
      info = { ...this.leadRegisterForm.value };
    } else if (AppUtils.leadSearchInfo) {
      info = { ...AppUtils.leadSearchInfo };
    }
    info.page = !newSearch ? this.page : 0;
    return info;
  }

  PerformSearch(isSubmitting?: boolean) {
    this.filteredLeads = [];
    this.isSubmitting = isSubmitting;

    if (isSubmitting) {
      this.leadSearchInfo = this.getSearchInfo(true);
      this.filteredLeads = [];
      // this.leadSearchInfo.page = 1;
      this.page = 0;
    } else {
      this.leadSearchInfo = {
        ...this.leadSearchInfo,
        ...this.leadRegisterForm.value,
      };
    }
    if (this.leadSearchInfo) {
      this.isClosedIncluded = this.leadSearchInfo.includeClosedLeads;
    }
    this.isAdvancedSearchVisible = false;
    this.getLeads(this.leadSearchInfo);
  }

  cancel() {
    this.areLeadsAssignable = false;
    this.selectedLeadsForAssignment = [];
  }

  showLeadsAssignmentModal() {
    this.showModal = true;
  }

  getSelectedOwner(id: number) {
    if (id) {
      this.newLeadOwnerId = id;
    }
  }

  assignLeadsToOwner() {
    if (this.newLeadOwnerId) {
      this.leadService.assignLeads(this.newLeadOwnerId, this.selectedLeadsForAssignment).subscribe((result) => {
        if (result) {
          this.messageService.add({
            severity: 'success',
            summary: 'Lead(s) successfully assigned!',
            closable: false,
            key: 'assignmentMessage',
          });
          this.areLeadsAssignable = false;
          this.selectedLeadsForAssignment = [];
          this.staffMemberService.clearSelectedStaffMember(true);
          this.replaceLeadsWithNewOwners(result);
          this.showModal = false;
        }
      });
    }
  }

  navigateToEdit(lead: Lead) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.areLeadsAssignable) {
      let newInfo: LeadSearchInfo;
      if (this.isSubmitting) {
        newInfo = { ...this.leadSearchInfo, ...this.leadRegisterForm.value };
        localStorage.setItem('listingType', this.leadSearchInfo.listingType.toString());
      } else {
        const listingType = +localStorage.getItem('listingType');
        newInfo = { ...this.leadSearchInfo, listingType };
        this.listingTypeControl.setValue(listingType);
        console.log({ newInfo }, { listingType }, 'not submitting');
      }
      newInfo.startLeadId = lead.leadId;
      newInfo.ownerId = lead.ownerId;
      this.info = JSON.stringify(newInfo);
      AppUtils.leadSearchInfo = newInfo;
      const queryParams = {
        showNotes: true,
        showSaveAndNext: true,
        leadSearchInfo: this.info,
      };
      this.leadService.previousLeadQueryParam.next(queryParams);
      this.router.navigate(['/leads-register/edit', lead.leadId], {
        queryParams: queryParams,
      });
    }
  }

  getSelectedOfficeId(officeIds: number[]) {
    this.leadRegisterForm.get('officeIds').setValue(officeIds);
  }

  getSelectedTypes(types: number[]) {
    this.leadTypeIdsControl.setValue(types);
  }

  onScrollDown() {
    if (!this.leadSearchInfo) {
      this.leadSearchInfo = this.getSearchInfo(true);
    }
    const url = this.router.url;
    const isLeadsRegister = url.endsWith('/leads-register');

    if (isLeadsRegister) {
      if (!this.bottomReached) {
        this.page++;
        this.leadSearchInfo.page = this.page;
        this.getLeads(this.leadSearchInfo);
      }
    }
  }

  private replaceLeadsWithNewOwners(newLeads: Lead[]) {
    if (this.filteredLeads && this.filteredLeads.length) {
      let index = -1;
      for (const lead of this.filteredLeads) {
        newLeads.forEach((x) => {
          if (x.leadId === lead.leadId) {
            index = this.filteredLeads.findIndex((l) => l.leadId === lead.leadId);
            if (this.filteredLeads[index]) {
              this.filteredLeads[index] = x;
            }
          }
        });
      }
    }
  }

  scrollElIntoView(className: string) {
    this.sharedService.scrollElIntoView(className);
  }

  clearDate(type: string) {
    if (type === 'to') {
      this.dateToControl.setValue(null);
    } else if (type === 'from') {
      this.dateFromControl.setValue(null);
    }
  }

  isLeadOutDated(lead: Lead, index): string {
    if (lead && lead.nextChaseDate && new Date(lead.nextChaseDate).getTime() < addDays(new Date(), -1).getTime()) {
      if (index % 2 === 0) {
        return '#F1AFA8';
      }
      return '#FAE1DF';
    }
    return '';
  }
}
