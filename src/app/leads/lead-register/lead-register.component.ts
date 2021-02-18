import { Component, OnInit, Input, OnChanges, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { LeadsService } from '../shared/leads.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Lead, LeadSearchInfo } from '../shared/lead';
import { StaffMember, Office } from 'src/app/shared/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DropdownListInfo, InfoDetail, InfoService } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { OfficeService } from 'src/app/core/services/office.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LeadAssignmentModalComponent } from '../../shared/lead-assignment-modal/lead-assignment-modal.component';
import { Subject } from 'rxjs';
import { AppUtils } from 'src/app/core/shared/utils';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { map, tap } from 'rxjs/operators';

const PAGE_SIZE = 20;
@Component({
  selector: 'app-lead-register',
  templateUrl: '../lead-register/lead-register.component.html',
  styleUrls: ['../lead-register/lead-register.component.scss']
})
export class LeadRegisterComponent implements OnInit, OnChanges {
  // @Input() leads: Lead[];
  @Input() pageNumber: number;
  @Input() bottomReached: boolean;
  @Input() showFilterOptions = true;
  areLeadsAssignable = false;
  currentStaffMember: StaffMember;
  listInfo: any;
  leadTypes: InfoDetail[];
  leadRegisterForm: FormGroup;
  staffMembers: StaffMember[];
  offices: Office[];
  page: number = 1;
  groupsLength: number;
  filteredLeads: Lead[];
  leads: Lead[];
  leadSearchInfo: LeadSearchInfo;
  enableOwnerFilter = true;
  selectedLeadsForAssignment: Lead[] = [];
  isSelectAllChecked = false;
  searchTerm = '';
  errorMessage: WedgeError;
  info: string;
  isClosedIncluded: boolean;
  canSeeUnassignable: boolean;
  isAdvancedSearchVisible = false;
  showModal = false;
  newLeadOwnerId: number;

  get isAdvancedFilterActive() {
    if (this.leadRegisterForm) {
      return this.leadRegisterForm.get('dateTo').value
        || this.leadRegisterForm.get('officeIds').value
        || this.leadRegisterForm.get('includeClosedLeads').value
        || this.leadRegisterForm.get('includeUnassignedLeadsOnly').value;
    }
  }

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

  constructor(private leadService: LeadsService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private infoService: InfoService,
    private officeService: OfficeService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private staffMemberService: StaffMemberService,
    private messageService: MessageService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.setupLeadRegisterForm();
    this.getLeadsForCurrentUser();
    this.getInfoFromLocalStorage();

    // New search term
    this.leadService.leadSearchTermChanges$.subscribe(newSearchTerm => {
      if (newSearchTerm) {
        this.leadRegisterForm.get('leadSearchTerm').setValue(newSearchTerm);
        console.log('lead suggestion:', newSearchTerm);
        this.leadSearchInfo = this.getSearchInfo(true);
      } else {
        console.log('no change in lead suggestion:');
        AppUtils.leadSearchTerm = '';
        this.leadRegisterForm.patchValue({
          leadSearchTerm: ''
        });

      }
      console.log('lead suggestion selected:', this.leadRegisterForm);
      this.PerformSearch();
    });
    console.log('INIT: ', this.leadSearchInfo);

    this.leadRegisterForm.valueChanges.subscribe(() => {
      this.leadSearchInfo = this.getSearchInfo(true);
      console.log('form group changes', this.leadSearchInfo);
      // this.leadService.pageNumberChanged(this.leadSearchInfo);
    });

    // this.leadResults();
  }

  getLeadsForCurrentUser() {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
        this.bottomReached = false;
        const seeAllLeadsPermission = this.currentStaffMember.permissions.find(x => x.permissionId === 69);
        seeAllLeadsPermission ? this.canSeeUnassignable = true : this.canSeeUnassignable = false;
        this.leadSearchInfo = {
          page: this.page,
          ownerId: this.currentStaffMember.staffMemberId,
          personId: null,
          leadTypeId: null,
          officeId: null,
          dateFrom: null,
          dateTo: null,
          includeClosedLeads: false,
          includeUnassignedLeadsOnly: false,
          leadSearchTerm: this.searchTerm ? this.searchTerm : ''
        };

        if (AppUtils.leadSearchInfo) {
          console.log('from app utils', AppUtils.leadSearchInfo);
          this.leadSearchInfo = AppUtils.leadSearchInfo;
          // this.searchTerm = AppUtils.leadSearchInfo.leadSearchTerm;
        }
      } else {
        this.leadSearchInfo = this.getSearchInfo(true);
        console.log(this.leadSearchInfo, 'infos....xx');
      }
      this.leadRegisterForm.patchValue(this.leadSearchInfo);
      console.log('lead form after patch', this.leadRegisterForm.value);

      this.getLeads(this.leadSearchInfo);
    });
  }

  getInfoFromLocalStorage() {
    // Lead Types
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.leadTypes = data.leadTypes;
        console.log('lead yptes in register', this.leadTypes);
      } else {
        this.infoService.getDropdownListInfo()
          .pipe((map(response => response),
            tap(res => {
              if (res) { this.leadTypes = res.leadTypes; }
            }))).subscribe();
      }
    });

    // All Active Staffmembers
    this.storage.get('activeStaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers = data as StaffMember[];
      }
    });

    // Current Logged in staffmember
    // this.storage.get('currentUser').subscribe((data: StaffMember) => {
    //   if (data) {
    //     this.currentStaffMember = data;
    //     const seeAllLeadsPermission = this.currentStaffMember.permissions.find(x => x.permissionId === 69);
    //     seeAllLeadsPermission ? this.canSeeUnassignable = true : this.canSeeUnassignable = false;
    //     this.leadSearchInfo = this.getSearchInfo(true);
    //     console.log(this.leadSearchInfo, 'infos....xx');
    //   }
    // });

  }

  // Setup Form
  setupLeadRegisterForm() {
    this.leadRegisterForm = this.fb.group({
      ownerId: [],
      officeIds: [''],
      leadTypeIds: [],
      includeClosedLeads: [],
      dateFrom: [],
      dateTo: [],
      includeUnassignedLeadsOnly:  [false],
      leadSearchTerm: ['']
    });
    // this.leadRegisterForm = this.fb.group({
    //   ownerId: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.ownerId : (this.currentStaffMember ? this.currentStaffMember.staffMemberId : null),
    //   officeIds: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo?.officeIds : null,
    //   leadTypeIds: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.leadTypeIds : null,
    //   includeClosedLeads: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.includeClosedLeads : false,
    //   dateFrom: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.dateFrom : null,
    //   dateTo: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.dateTo : null,
    //   includeUnassignedLeadsOnly: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.includeUnassignedLeadsOnly : false,
    //   leadSearchTerm: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.leadSearchTerm : ''
    // });
  }

  getLeads(leadSearchInfo: LeadSearchInfo) {
    console.log('get leads search info: ', leadSearchInfo);
    this.leadService.getLeads(leadSearchInfo, PAGE_SIZE).subscribe(result => {

      if (leadSearchInfo.page === 1) {
        this.filteredLeads = result;
      } else {
        if (this.filteredLeads) {
          this.filteredLeads = this.filteredLeads.concat(result);
        } else {
          this.filteredLeads = result;
        }
      }
      this.setBottomReachedFlag(result);

    }, () => {
      this.leads = [];
    });
  }

  private setBottomReachedFlag(result: any) {
    if (result && (!result.length || result.length < +PAGE_SIZE)) {
      this.bottomReached = true;
    } else {
      this.bottomReached = false;
    }
  }
  assignLeads() {
    event.preventDefault();
    this.areLeadsAssignable = true;
  }

  toggleSelectAllLeads() {
    this.isSelectAllChecked = !this.isSelectAllChecked;
    this.selectAllLeadsForAssignment(this.isSelectAllChecked);
  }

  assignSelected() {
    console.log('show popup to assign leads');
  }

  selectLead(lead?: Lead) {
    console.log('clicked', lead);
    this.leadService.leadsChanged(lead);
  }

  selectLeadForAssignment(event, lead?: Lead) {
    lead.isChecked = !lead.isChecked;
    this.getSelectedLeads();
  }

  selectAllLeadsForAssignment(isSelectAllChecked: boolean) {
    if (isSelectAllChecked) {
      this.filteredLeads.forEach(x => { x.isChecked = true; });
    } else { this.filteredLeads.forEach(x => { x.isChecked = false; }); }

    this.getSelectedLeads();
  }

  getSelectedLeads() {
    this.selectedLeadsForAssignment = this.filteredLeads.filter(x => x.isChecked);
  }

  onOwnerChanged(event: any) {
    console.log(event);
  }

  setLeadSearchTerm(term: string) {
    if (term) {
      this.leadRegisterForm.patchValue({
        leadSearchTerm: term
      });
      this.leadSearchInfo = this.getSearchInfo(true);
    } else {
      this.leadRegisterForm.patchValue({
        leadSearchTerm: ''
      });
    }
  }

  ngOnChanges() {
    // this.page = this.pageNumber;

    // if (this.leads) {
    //   this.filteredLeads = this.leads;
    // }
  }

  // TODO: Refactor asap
  private getSearchInfo(newSearch: boolean) {
    return {
      page: !newSearch ? this.pageNumber : 1,
      ownerId: this.currentStaffMember ? this.currentStaffMember.staffMemberId : null,
      leadTypeIds: this.leadRegisterForm != null ? this.leadRegisterForm.get('leadTypeIds').value : null ? AppUtils.leadSearchInfo.leadTypeIds : null,
      officeIds: this.leadRegisterForm != null ? this.leadRegisterForm.get('officeIds').value : null ? AppUtils.leadSearchInfo.officeIds : null,
      dateFrom: this.leadRegisterForm != null ? this.leadRegisterForm.get('dateFrom').value : null ? AppUtils.leadSearchInfo.dateFrom : null,
      dateTo: this.leadRegisterForm != null ? this.leadRegisterForm.get('dateTo').value : null ? AppUtils.leadSearchInfo.dateTo : null,
      includeClosedLeads: this.leadRegisterForm != null ? this.leadRegisterForm.get('includeClosedLeads').value : null ? AppUtils.leadSearchInfo.includeClosedLeads : null,
      includeUnassignedLeadsOnly: this.leadRegisterForm != null ? this.leadRegisterForm.get('includeUnassignedLeadsOnly').value : null ? AppUtils.leadSearchInfo.includeUnassignedLeadsOnly : null,
      leadSearchTerm: this.leadRegisterForm != null ? this.leadRegisterForm.get('leadSearchTerm').value : null ? AppUtils.leadSearchInfo.leadSearchTerm : null
    };
  }

  PerformSearch() {
    this.leadSearchInfo = { ...this.leadSearchInfo, ...this.leadRegisterForm.value };
    if (this.leadSearchInfo) {
      this.isClosedIncluded = this.leadSearchInfo.includeClosedLeads;
    }
    this.isAdvancedSearchVisible = false;
    this.getLeads(this.leadSearchInfo);
    // this.leadService.pageNumberChanged(this.leadSearchInfo);
  }

  cancel() {
    this.areLeadsAssignable = false;
    this.selectedLeadsForAssignment = [];
  }

  processLeadsAssignment(leadOwner: number, leadsForAssignment: Lead[]) {
    this.leadService.assignLeads(leadOwner, leadsForAssignment).subscribe(result => {
      if (result) {
        this.messageService.add({ severity: 'success', summary: 'Lead(s) successfully assigned!', closable: false });
        this.areLeadsAssignable = false;
        this.selectedLeadsForAssignment = [];
        this.replaceLeadsWithNewOwners(result);
      }
    });
  }

  showLeadsAssignmentModal() {
    // const subject = new Subject<number>();
    // const modal = this.modalService.show(LeadAssignmentModalComponent, { ignoreBackdropClick: true });
    // modal.content.subject = subject;

    // subject.subscribe(leadOwner => {
    //   if (leadOwner) {
    //     console.log('lead Owner selected', leadOwner);
    //     console.log('leads selected for assignment', this.selectedLeadsForAssignment);
    //     this.processLeadsAssignment(leadOwner, this.selectedLeadsForAssignment);
    //   }
    // });

    // return subject.asObservable();

    this.showModal = true;

  }

  getSelectedOwner(id: number) {
    console.log({ id }, 'sleected owener');
    if (id) { this.newLeadOwnerId = id; }
  }

  // TODO: CHANGE NAME ASAP
  assignLeadsToOwner() {
    if (this.newLeadOwnerId) {
      this.leadService.assignLeads(this.newLeadOwnerId, this.selectedLeadsForAssignment).subscribe(result => {
        if (result) {
          this.messageService.add({ severity: 'success', summary: 'Lead(s) successfully assigned!', closable: false });
          this.areLeadsAssignable = false;
          this.selectedLeadsForAssignment = [];
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
      const newInfo = { ...this.leadSearchInfo, ...this.leadRegisterForm.value } as LeadSearchInfo;
      newInfo.startLeadId = lead.leadId;
      newInfo.ownerId = lead.ownerId;
      this.info = JSON.stringify(newInfo);
      AppUtils.leadSearchInfo = newInfo;
      console.log('set in app utils', AppUtils.leadSearchInfo);
      console.log('Lead Register App utils', lead.leadId);
      console.log('Lead Register App utils INFO: ', this.info);
      this.router.navigate(['/leads-register/edit', lead.leadId],
        {
          queryParams: {
            showNotes: true,
            showSaveAndNext: true,
            leadSearchInfo: this.info
          }
        });
    }
  }

  getSelectedOfficeId(officeIds: number[]) {
    console.log({ officeIds }, 'list array');

    this.leadRegisterForm.get('officeIds').setValue(officeIds);
    console.log(this.leadRegisterForm.value, 'when office ids selected');

  }

  getSelectedTypes(types: number[]) {
    console.log({ types });

    this.leadTypeIdsControl.setValue(types);
    console.log(this.leadRegisterForm.value, 'when type ids selected');
  }

  onScrollDown() {
    this.onWindowScroll();
    console.log('scrolled');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let scrollHeight: number, totalHeight: number;
    scrollHeight = document.body.scrollHeight;
    totalHeight = window.scrollY + window.innerHeight;

    this.leadSearchInfo = this.getSearchInfo(false);
    const url = this.router.url;
    const isLeadsRegister = url.endsWith('/leads-register');

    if (isLeadsRegister) {
      if (totalHeight >= scrollHeight && !this.bottomReached) {
        this.page++;
        this.leadSearchInfo.page = this.page;
        this.leadService.pageNumberChanged(this.leadSearchInfo);
        this.getLeads(this.leadSearchInfo);
        console.log('leads page number', this.page);
        console.log('leads page number params', this.leadSearchInfo);
      }
    }
  }

  private replaceLeadsWithNewOwners(newLeads: Lead[]) {
    if (this.leads && this.leads.length) {
      let index = -1;
      for (const lead of this.leads) {
        newLeads.forEach(x => {
          if (x.leadId === lead.leadId) {
            index = this.leads.findIndex(l => l.leadId === lead.leadId);
            if (this.leads[index]) {
              this.leads[index] = x;
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
    } else if (type === 'from') { this.dateFromControl.setValue(null); }
  }
}
