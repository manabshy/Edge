import { Component, OnInit } from '@angular/core';
import { LeadsService } from './shared/leads.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember } from '../core/models/staff-member';
import { getLocaleDayNames } from '@angular/common';
import { Lead } from './shared/lead';
import { InfoDetail } from '../core/services/info.service';
import * as _ from 'lodash';

const PAGE_SIZE = 20;
@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {

  currentStaffMember: StaffMember;
  leads: Lead[];
  filteredLeads: Lead[];
  staffMembers: StaffMember[];
  page = 1;
  bottomReached = false;

  constructor(private leadService: LeadsService, private staffMemberService: StaffMemberService) { }

  ngOnInit() {

    // Current Staff Member
    this.staffMemberService.getCurrentStaffMember().subscribe(data => {
      if (data) {
        this.currentStaffMember = data;
        this.bottomReached = false;

        this.getLeads(this.page);
      }
    });

    // page changes here
    this.leadService.pageChanges$.subscribe(newPageNumber => {
      if (newPageNumber) {
        this.page = newPageNumber;
        this.getLeads(this.page);
        console.log('end of page', this.page);
      }
    });

    this.getAllStaffmembers();
  }

  getLeads(page: number) {
    this.leadService.getLeads(this.currentStaffMember.staffMemberId, PAGE_SIZE, page).subscribe(result => {


      if (this.leads != null) {
        this.leads = this.leads.concat(result);
      } else {
        this.leads = result;
      }

      this.filteredLeads = this.leads;

      console.log('result:', result);
      console.log('leads:', this.leads);
    }, error => {
      this.leads = [];
    });
  }

  getAllStaffmembers() {
    this.staffMemberService.getAllStaffMembers().subscribe(result => {
      this.staffMembers = result;
    }, error => {
      this.staffMembers = [];
    });
  }


}


