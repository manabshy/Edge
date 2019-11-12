import { Component, OnInit } from '@angular/core';
import { LeadsService } from './shared/leads.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember } from '../core/models/staff-member';
import { getLocaleDayNames } from '@angular/common';
import { Lead } from './shared/lead';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {

  currentStaffMember: StaffMember;
  leads: Lead[];
  staffMembers: StaffMember[];

  constructor(private leadService: LeadsService, private staffMemberService: StaffMemberService) { }

  ngOnInit() {

    this.staffMemberService.getCurrentStaffMember().subscribe(data => {
      if (data) {
        this.currentStaffMember = data;
      }
    });

    this.getLeads();
    this.getAllStaffmembers();
  }

  getLeads() {
    console.log("getting leads");
    this.leadService.getLeads(this.currentStaffMember.staffMemberId).subscribe(result => {
      this.leads = result;
    }, error => {
      this.leads = [];
    });
  }

  getAllStaffmembers() {
    this.staffMemberService.getAllStaffMembers().subscribe(result => {
      this.staffMembers = result;
      //console.log("staffMembers Object:");
      //console.log(this.staffMembers);
    }, error => {
      this.staffMembers = [];
    });
  }


}


