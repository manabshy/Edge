import { Component, OnInit, Input } from '@angular/core';
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
  @Input() leads: Lead[];
  areLeadsAssignable = false;
  currentStaffMember: StaffMember;

  constructor(private leadService: LeadsService, private staffMemberService: StaffMemberService) { }

  ngOnInit() {
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
    if(this.areLeadsAssignable) {
      // event.preventDefault();
    }
  }

 
}
