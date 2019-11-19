import { Component, OnInit, Input, OnChanges } from '@angular/core';
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

    this.leadSearchInfo = {
      page: this.page,
      ownerId: this.leadRegisterForm.get('ownerId').value !== '' ? this.leadRegisterForm.get('ownerId').value : 2537,
      leadTypeId: this.leadRegisterForm.get('leadTypeId').value,
      officeId: this.leadRegisterForm.get('officeId').value,
      dateFrom: this.leadRegisterForm.get('dateFrom').value,
      dateTo: this.leadRegisterForm.get('dateTo').value
    };
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

  private patchLeadsSearchValues(lead: Lead) {
    this.leadRegisterForm.patchValue({
      ownerId: lead.ownerId,
      personId: lead.personId,
      officeId: lead.officeId,
      leadTypeId: lead.leadTypeId,
      nextChaseDate: this.sharedService.ISOToDate(lead.createdDate)
    });
  }

  private setupLeadRegisterForm() {
    this.leadRegisterForm = this.fb.group({
      ownerId: '',
      officeId: '',
      leadTypeId: '',
      includeClosedLeads: false,
      dateFrom: [''],
      dateTo: ['']
    });
  }

  onOwnerChanged(event: any) {
    console.log(event);

    if (event && event.item != null) {
      this.leadRegisterForm.patchValue({
        ownerId: event.item.staffMemberId
      });

      // if (this.leadRegisterForm.get('leadTypeId').value !== '') {
      //   this.filteredLeads = this.leads.filter(l => l.leadTypeId === this.leadRegisterForm.get('leadTypeId').value);
      // }

      this.leadSearchInfo = {
        page: 1,
        ownerId: this.leadRegisterForm.get('ownerId').value !== '' ? this.leadRegisterForm.get('ownerId').value : 2537,
        leadTypeId: this.leadRegisterForm.get('leadTypeId').value,
        officeId: this.leadRegisterForm.get('officeId').value,
        dateFrom: this.leadRegisterForm.get('dateFrom').value,
        dateTo: this.leadRegisterForm.get('dateTo').value
      };

      //console.log('owner changed', this.leadSearchInfo);
      this.leadService.pageNumberChanged(this.leadSearchInfo);

      //this.filteredLeads = this.leads.filter(l => l.ownerId === event.item.staffMemberId);

    } else {
      console.log('reseting filter');
      this.leadRegisterForm.patchValue({
        ownerId: ''
      });
      this.filteredLeads = this.leads;
    }



    //console.log(this.leadRegisterForm.get('ownerId'));
    //console.log(this.leadRegisterForm.get('ownerId'));

    console.log(this.leadRegisterForm.value);
  }

  ngOnChanges() {
    
    this.page = this.pageNumber;
    //this.leadSearchInfo.page = this.pageNumber;

    this.leadSearchInfo = {
      page: this.pageNumber,
      ownerId: this.leadRegisterForm.get('ownerId').value !== '' ? this.leadRegisterForm.get('ownerId').value : 2537,
      leadTypeId: this.leadRegisterForm.get('leadTypeId').value,
      officeId: this.leadRegisterForm.get('officeId').value,
      dateFrom: this.leadRegisterForm.get('dateFrom').value,
      dateTo: this.leadRegisterForm.get('dateTo').value
    };

    if (this.leads) {
      this.filteredLeads = this.leads;
    }
    if (this.filteredLeads && this.groupsLength !== this.filteredLeads.length - 1) {
      setTimeout(() => {
        this.groupsLength = this.filteredLeads.length - 1;
        this.itemIntoView(this.groupsLength);
      });
    }
  }

  itemIntoView(index: number) {
    const items = document.querySelectorAll('.list-group-item');

    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          setTimeout(() => {
            this.onWindowScroll();
            observer.unobserve(entry.target);
          });
        }
      });
    });

    if (index > 0) {
      observer.observe(items[index]);
    }
  }

  onWindowScroll() {
    if (!this.bottomReached) {
      this.page++;
      //this.leadSearchInfo.page = this.page;

      this.leadSearchInfo = {
        page: this.page,
        ownerId: this.leadRegisterForm.get('ownerId').value !== '' ? this.leadRegisterForm.get('ownerId').value : 2537,
        leadTypeId: this.leadRegisterForm.get('leadTypeId').value,
        officeId: this.leadRegisterForm.get('officeId').value,
        dateFrom: this.leadRegisterForm.get('dateFrom').value,
        dateTo: this.leadRegisterForm.get('dateTo').value
      };

      this.leadService.pageNumberChanged(this.leadSearchInfo);
      console.log('bottom here...', this.page);
    }
  }


}
