import { Component, OnInit } from '@angular/core';
import { LeadsService } from '../shared/leads.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Lead } from '../shared/lead';
import { StaffMember } from 'src/app/core/models/staff-member';

@Component({
  selector: 'app-lead-register',
  templateUrl: '../lead-register/lead-register.component.html',
  styleUrls: ['../lead-register/lead-register.component.scss']
})
export class LeadRegisterComponent implements OnInit {

  areLeadsAssignable: boolean = false;
  currentStaffMember: StaffMember;
  leads: Lead[];

  constructor(private leadService: LeadsService, private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.staffMemberService.getCurrentStaffMember().subscribe(data => {
      if (data) {
        this.currentStaffMember = data;
      }
    });

    this.getLeads();
  }

  getLeads() {
    this.leadService.getLeads(this.currentStaffMember.staffMemberId).subscribe(result => {
        this.leads = result;
    }, error => {
      this.leads = [];
    });
  }

  assignLeads() {
    event.preventDefault();
    this.areLeadsAssignable = true;
  }

  assignSelected() {
    console.log("show popup to assign leads");
  }

  selectLead() {
    if(this.areLeadsAssignable) {
      event.preventDefault();
    }
  }

}
