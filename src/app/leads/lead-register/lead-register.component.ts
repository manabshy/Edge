import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { LeadsService } from '../shared/leads.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Lead } from '../shared/lead';
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
  // @Input() filteredLeads: Lead[];
  @Input() searchTerm: string;
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

    this.onChanges();
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
      //event.preventDefault();
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

  onChanges(): void {
    this.leadRegisterForm.valueChanges.subscribe(val => {
      if (this.leadRegisterForm.controls['ownerId'].value !== '') {
        this.filteredLeads = this.leads.filter(l => l.ownerId === this.leadRegisterForm.controls['ownerId'].value);
      } else {
        this.filteredLeads = this.leads;
      }
    });
  }

  onOwnerChanged(event: any) {
    console.log(event);

    if (event.item != null) {
      this.leadRegisterForm.patchValue({
        ownerId: event.item.staffMemberId
      });

      // this.filteredLeads = this.leads.filter(l => l.ownerId === event.item.staffMemberId);

    } else {
      console.log('reseting filter');
      this.leadRegisterForm.patchValue({
        ownerId: ''
      });

    }
  }

  ngOnChanges() {
    console.log('leads', this.leads);
    this.page = this.pageNumber;
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
      this.leadService.pageNumberChanged(this.page);
      console.log('bottom here...', this.page);
    }
  }


}
