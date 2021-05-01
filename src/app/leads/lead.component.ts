import { Component, OnInit } from '@angular/core';
import { LeadsService } from './shared/leads.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember } from '../shared/models/staff-member';
import { Lead, LeadSearchInfo } from './shared/lead';
import * as _ from 'lodash';
import { AppUtils } from '../core/shared/utils';
import { SharedService } from '../core/services/shared.service';

const PAGE_SIZE = 20;
@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {


  constructor(private leadService: LeadsService,
    private sharedService: SharedService,
    private staffMemberService: StaffMemberService) { }

  ngOnInit() { }


}


