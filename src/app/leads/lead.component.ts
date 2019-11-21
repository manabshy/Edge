import { Component, OnInit } from '@angular/core';
import { LeadsService } from './shared/leads.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember } from '../core/models/staff-member';
import { getLocaleDayNames } from '@angular/common';
import { Lead, LeadSearchInfo } from './shared/lead';
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
  leadSearchInfo: LeadSearchInfo;
  isLoading = false;

  constructor(private leadService: LeadsService, private staffMemberService: StaffMemberService) { }

  ngOnInit() {

    // Current Staff Member
    this.staffMemberService.getCurrentStaffMember().subscribe(data => {
      if (data) {
        this.currentStaffMember = data;
        this.bottomReached = false;

        this.leadSearchInfo = {
          page: this.page,
          ownerId: null,
          leadTypeId: null,
          officeId: null,
          dateFrom: null,
          dateTo: null,
          includeClosedLeads: false,
          includeUnassignedLeadsOnly: false
        };

        // this.leadSearchInfo.page = this.page;
        // this.leadSearchInfo.ownerId = this.currentStaffMember.staffMemberId;

        this.getLeads(this.leadSearchInfo);
      }
    });

    // page changes here
    this.leadService.pageChanges$.subscribe(newPageNumber => {
      if (newPageNumber) {
        this.page = newPageNumber.page;
        this.getLeads(newPageNumber);
        console.log('end of page', newPageNumber.page);
      }
    });

    this.getAllStaffmembers();
  }

  getLeads(leadSearchInfo: LeadSearchInfo) {
    this.isLoading = true;
    this.leadService.getLeads(leadSearchInfo, PAGE_SIZE).subscribe(result => {
      this.isLoading = false;
      
      if (leadSearchInfo.page === 1) {
        this.leads = result;
      } else {
        this.leads = this.leads.concat(result);
      }

      this.filteredLeads = this.leads;

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


