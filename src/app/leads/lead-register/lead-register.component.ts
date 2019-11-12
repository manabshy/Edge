import { Component, OnInit, Input } from '@angular/core';
import { LeadsService } from '../shared/leads.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Lead } from '../shared/lead';
import { StaffMember, Office } from 'src/app/core/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail } from 'src/app/core/services/info.service';
import { FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';
import { OfficeService } from 'src/app/core/services/office.service';

@Component({
  selector: 'app-lead-register',
  templateUrl: '../lead-register/lead-register.component.html',
  styleUrls: ['../lead-register/lead-register.component.scss']
})
export class LeadRegisterComponent implements OnInit {
  @Input() leads: Lead[];
  areLeadsAssignable = false;
  currentStaffMember: StaffMember;
  listInfo: any;
  leadTypes: InfoDetail[];
  leadRegisterForm: FormGroup;
  staffMembers: StaffMember[];
  offices: Office[];

  constructor(private leadService: LeadsService,
    private staffMemberService: StaffMemberService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private officeService: OfficeService) { }

  ngOnInit() {

    // Lead Types
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.leadTypes = this.listInfo.leadTypes;
      }
    });

    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers = data as StaffMember[];
      }
    });

    this.officeService.getOffices().subscribe(
      data => {
      this.offices = data;
        console.log('offices', this.offices);
      }
    );
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
      // event.preventDefault();
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


}
