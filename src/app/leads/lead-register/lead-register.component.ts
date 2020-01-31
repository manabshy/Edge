import { Component, OnInit, Input, OnChanges, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { LeadsService } from '../shared/leads.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Lead, LeadSearchInfo } from '../shared/lead';
import { StaffMember, Office } from 'src/app/shared/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { OfficeService } from 'src/app/core/services/office.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { LeadAssignmentModalComponent } from '../../shared/lead-assignment-modal/lead-assignment-modal.component';
import { Subject } from 'rxjs';
import { AppUtils } from 'src/app/core/shared/utils';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lead-register',
  templateUrl: '../lead-register/lead-register.component.html',
  styleUrls: ['../lead-register/lead-register.component.scss']
})
export class LeadRegisterComponent implements OnInit, OnChanges {
  @Input() leads: Lead[];
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
  page: number;
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
  canSeeUnassignable: boolean;

  constructor(private leadService: LeadsService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private officeService: OfficeService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.setupLeadRegisterForm();

    // Lead Types
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.leadTypes = this.listInfo.leadTypes;
      }
    });

    // All Active Staffmembers
    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers = data as StaffMember[];
      }
    });

    // Offices
    this.officeService.getOffices().subscribe(
      data => {
        this.offices = data;
      }
    );

    // Current Logged in staffmember
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
        const seeAllLeadsPermission = this.currentStaffMember.permissions.find(x => x.permissionId === 69);
        seeAllLeadsPermission ? this.canSeeUnassignable = true : this.canSeeUnassignable = false;
        this.leadSearchInfo = this.getSearchInfo(true);
      }
    });

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

  assignLeads() {
    event.preventDefault();
    this.areLeadsAssignable = true;
  }

  assignSelected() {
    console.log('show popup to assign leads');
  }

  selectLead(lead?: Lead) {
    console.log('clicked', lead);
    this.leadService.leadsChanged(lead);
  }

  selectedLeadIndex(lead: Lead) {
    return this.selectedLeadsForAssignment != null ? this.selectedLeadsForAssignment.indexOf(lead) : -1;
  }

  selectLeadForAssignment(event, lead?: Lead) {
    let leadIndex = -1;

    if (this.areLeadsAssignable) {
      event.stopPropagation();
    }

    if (this.areLeadsAssignable) {
      leadIndex = this.selectedLeadIndex(lead);
      if (leadIndex < 0) {
        this.selectedLeadsForAssignment.push(lead);
      } else {
        this.selectedLeadsForAssignment.splice(leadIndex, 1);
      }
    }
  }

  selectAllLeadsForAssignment(event) {
    event.preventDefault();
    if (this.selectedLeadsForAssignment.length) {
      this.selectedLeadsForAssignment = [];
      this.isSelectAllChecked = false;
    } else {
      if (this.filteredLeads) {
        this.filteredLeads.forEach(lead => {
          this.selectLeadForAssignment(event, lead);
        });
      }
      this.isSelectAllChecked = true;
    }
  }

  private setupLeadRegisterForm() {
    this.leadRegisterForm = this.fb.group({
      ownerId: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.ownerId : (this.currentStaffMember ? this.currentStaffMember.staffMemberId : null),
      officeId: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.officeId : 0,
      leadTypeId: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.leadTypeId : 0,
      includeClosedLeads: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.includeClosedLeads : false,
      dateFrom: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.dateFrom : null,
      dateTo: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.dateTo : null,
      includeUnassignedLeadsOnly: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.includeUnassignedLeadsOnly : false,
      leadSearchTerm: AppUtils.leadSearchInfo ? AppUtils.leadSearchInfo.leadSearchTerm : ''
    });
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
    this.page = this.pageNumber;

    if (this.leads) {
      this.filteredLeads = this.leads;
    }
  }

  // TODO: Refactor asap
  private getSearchInfo(newSearch: boolean) {
    return {
      page: !newSearch ? this.pageNumber : 1,
      ownerId: this.currentStaffMember ? this.currentStaffMember.staffMemberId : null,
      leadTypeId: this.leadRegisterForm != null ? this.leadRegisterForm.get('leadTypeId').value : null ? AppUtils.leadSearchInfo.leadTypeId : null,
      officeId: this.leadRegisterForm != null ? this.leadRegisterForm.get('officeId').value : null ? AppUtils.leadSearchInfo.officeId : null,
      dateFrom: this.leadRegisterForm != null ? this.leadRegisterForm.get('dateFrom').value : null ? AppUtils.leadSearchInfo.dateFrom : null,
      dateTo: this.leadRegisterForm != null ? this.leadRegisterForm.get('dateTo').value : null ? AppUtils.leadSearchInfo.dateTo : null,
      includeClosedLeads: this.leadRegisterForm != null ? this.leadRegisterForm.get('includeClosedLeads').value : null ? AppUtils.leadSearchInfo.includeClosedLeads : null,
      includeUnassignedLeadsOnly: this.leadRegisterForm != null ? this.leadRegisterForm.get('includeUnassignedLeadsOnly').value : null ? AppUtils.leadSearchInfo.includeUnassignedLeadsOnly : null,
      leadSearchTerm: this.leadRegisterForm != null ? this.leadRegisterForm.get('leadSearchTerm').value : null ? AppUtils.leadSearchInfo.leadSearchTerm : null
    };
  }

  PerformSearch() {
    if (this.leadSearchInfo) {
      this.isClosedIncluded = this.leadSearchInfo.includeClosedLeads;
    }
    this.leadService.pageNumberChanged(this.leadSearchInfo);
  }

  cancel() {
    this.areLeadsAssignable = false;
    this.selectedLeadsForAssignment = [];
  }

  processLeadsAssignment(leadOwner: number, leadsForAssignment: Lead[]) {
    this.leadService.assignLeads(leadOwner, leadsForAssignment).subscribe(result => {
      if (result) {
        this.toastr.success('Lead(s) successfully assigned!');
        this.areLeadsAssignable = false;
        this.selectedLeadsForAssignment = [];
        this.replaceLeadsWithNewOwners(result);
      }
    }, (error: WedgeError) => {
      this.errorMessage = error;
      this.sharedService.showError(this.errorMessage);
    });
  }

  showLeadsAssignmentModal() {
    const subject = new Subject<number>();
    const modal = this.modalService.show(LeadAssignmentModalComponent, { ignoreBackdropClick: true });
    modal.content.subject = subject;

    subject.subscribe(leadOwner => {
      if (leadOwner) {
        console.log('lead Owner selected', leadOwner);
        console.log('leads selected for assignment', this.selectedLeadsForAssignment);
        this.processLeadsAssignment(leadOwner, this.selectedLeadsForAssignment);
      }
    });

    return subject.asObservable();

  }

  navigateToEdit(lead: Lead) {
    if (!this.areLeadsAssignable) {
      const newInfo = { ...this.leadSearchInfo, ...this.leadRegisterForm.value } as LeadSearchInfo;
      newInfo.startLeadId = lead.leadId;
      this.info = JSON.stringify(newInfo);
      AppUtils.leadSearchInfo = newInfo;
      console.log('set in app utils', AppUtils.leadSearchInfo)
      console.log('Lead Register App utils', lead.leadId)
      console.log('Lead Register App utils INFO: ', this.info)
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
}
