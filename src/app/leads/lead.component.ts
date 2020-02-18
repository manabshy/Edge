import { Component, OnInit } from '@angular/core';
import { LeadsService } from './shared/leads.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember } from '../shared/models/staff-member';
import { Lead, LeadSearchInfo } from './shared/lead';
import * as _ from 'lodash';
import { AppUtils } from '../core/shared/utils';

const PAGE_SIZE = 20;
@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {

  currentStaffMember: StaffMember;
  leads: Lead[];
  staffMembers: StaffMember[];
  page = 1;
  bottomReached = false;
  leadSearchInfo: LeadSearchInfo;
  searchTerm = '';

  constructor(private leadService: LeadsService, private staffMemberService: StaffMemberService) { }

  ngOnInit() {

    // this.leadService.leadSearchTermChanges$.subscribe(newSearchTerm => this.searchTerm = newSearchTerm)

    // Current Staff Member
    this.staffMemberService.getCurrentStaffMember().subscribe(data => {
      if (data) {
        this.currentStaffMember = data;
        this.bottomReached = false;

        this.leadSearchInfo = {
          page: this.page,
          ownerId: this.currentStaffMember.staffMemberId,
          personId: null,
          leadTypeId: null,
          officeId: null,
          dateFrom: null,
          dateTo: null,
          includeClosedLeads: false,
          includeUnassignedLeadsOnly: false,
          leadSearchTerm: this.searchTerm ? this.searchTerm : ''
        };
        if (AppUtils.leadSearchInfo) {
          console.log('from app utils', AppUtils.leadSearchInfo);
          this.leadSearchInfo = AppUtils.leadSearchInfo;
          // this.searchTerm = AppUtils.leadSearchInfo.leadSearchTerm;
        }
        this.getLeads(this.leadSearchInfo);
      }
    });

    // page changes here
    this.leadService.pageChanges$.subscribe(leadSearchInfo => {
      if (leadSearchInfo) {
        this.page = leadSearchInfo.page;
        this.getLeads(leadSearchInfo);
        // console.log('calling from here 2', this.leadSearchInfo.leadSearchTerm);
      }
    });

    this.getAllStaffmembers();
  }

  getLeads(leadSearchInfo: LeadSearchInfo) {
    console.log('get leads search info: ', leadSearchInfo);
    this.leadService.getLeads(leadSearchInfo, PAGE_SIZE).subscribe(result => {

      if (leadSearchInfo.page === 1) {
        this.leads = result;
      } else {
        if (this.leads) {
          this.leads = this.leads.concat(result);
        } else {
          this.leads = result;
        }
      }
      this.setBottomReachedFlag(result);
    }, error => {
      this.leads = [];
    });
  }

  private setBottomReachedFlag(result: any) {
    if (result && (!result.length || result.length < +PAGE_SIZE)) {
      this.bottomReached = true;
    } else {
      this.bottomReached = false;
    }
  }

  getAllStaffmembers() {
    this.staffMemberService.getAllStaffMembers().subscribe(result => {
      this.staffMembers = result;
    }, error => {
      this.staffMembers = [];
    });
  }


}


