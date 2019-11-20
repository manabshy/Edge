import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { LeadsService } from '../shared/leads.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Lead, LeadSearchInfo } from '../shared/lead';
import { StaffMember, Office } from 'src/app/core/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';
import { OfficeService } from 'src/app/core/services/office.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ControlPosition } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-lead-register',
  templateUrl: '../lead-register/lead-register.component.html',
  styleUrls: ['../lead-register/lead-register.component.scss']
})
export class LeadRegisterComponent implements OnInit, OnChanges {
  @Input() leads: Lead[];
  @Input() pageNumber: number;
  @Input() bottomReached: boolean;
  @Input() showFilterOptions: boolean = true;
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
  enableOwnerFilter: boolean = true;


  constructor(private leadService: LeadsService,
    private staffMemberService: StaffMemberService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private officeService: OfficeService,
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

    // if (this.currentStaffMember.permissions.filter(p => p.permissionId === 69).length > 0) {
    //   this.enableOwnerFilter = false;
    // }

    this.leadSearchInfo = this.getSearchInfo(true);

    this.leadRegisterForm.valueChanges.subscribe(changes => {
      this.leadSearchInfo = this.getSearchInfo(true);
      console.log('form group changes', this.leadSearchInfo);
      this.leadService.pageNumberChanged(this.leadSearchInfo);
    });
  }


  assignLeads() {
    event.preventDefault();
    this.areLeadsAssignable = true;
  }

  assignSelected() {
    console.log("show popup to assign leads");
  }

  selectLead(lead?: Lead) {
    console.log('clicked', lead)
    this.leadService.leadsChanged(lead);
    if (this.areLeadsAssignable) {
    }
  }

  private setupLeadRegisterForm() {
    this.leadRegisterForm = this.fb.group({
      ownerId: null,
      officeId: null,
      leadTypeId: null,
      includeClosedLeads: false,
      dateFrom: null,
      dateTo: null
    });
  }

  onOwnerChanged(event: any) {
    console.log(event);

    if (event && event.item != null) {
      this.leadRegisterForm.patchValue({
        ownerId: event.item.staffMemberId
      });

      this.leadSearchInfo = this.getSearchInfo(true);
      this.leadService.pageNumberChanged(this.leadSearchInfo);

    } else {
      this.leadRegisterForm.patchValue({
        ownerId: ''
      });
      this.filteredLeads = this.leads;
    }
  }

  ngOnChanges() {
    this.page = this.pageNumber;

    if (this.leads) {
      this.filteredLeads = this.leads;
    }
  }

  private getSearchInfo(newSearch: boolean) {
    return {
      page: !newSearch ? this.pageNumber : 1,
      ownerId: this.leadRegisterForm != null ? this.leadRegisterForm.get('ownerId').value : null,
      leadTypeId: this.leadRegisterForm != null ? this.leadRegisterForm.get('leadTypeId').value : null,
      officeId: this.leadRegisterForm != null ? this.leadRegisterForm.get('officeId').value : null,
      dateFrom: this.leadRegisterForm != null ? this.leadRegisterForm.get('dateFrom').value : null,
      dateTo: this.leadRegisterForm != null ? this.leadRegisterForm.get('dateTo').value : null,
      includeClosedLeads: this.leadRegisterForm != null ? this.leadRegisterForm.get('includeClosedLeads').value : null
    };
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

    if (totalHeight >= scrollHeight && !this.bottomReached) {
      this.page++;
      this.leadSearchInfo.page = this.page;
      this.leadService.pageNumberChanged(this.leadSearchInfo);
      console.log('leads page number', this.page);
    }
  }


}
