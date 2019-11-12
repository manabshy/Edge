import { Component, OnInit } from '@angular/core';
import { AppUtils } from '../../core/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { LeadsService } from '../shared/leads.service';
import { Lead } from '../shared/lead';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { StaffMember } from 'src/app/core/models/staff-member';
import { ContactNote } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { getDate } from 'date-fns';
import { Person } from 'src/app/core/models/person';

@Component({
  selector: 'app-lead-edit',
  templateUrl: '../lead-edit/lead-edit.component.html',
  styleUrls: ['../lead-edit/lead-edit.component.scss']
})
export class LeadEditComponent implements OnInit {

  listInfo: any;
  leadId: number;
  lead: Lead;
  leadTypes: InfoDetail[];
  leadEditForm: FormGroup;
  personNotes: ContactNote[] = [];
  staffMembers: StaffMember[];
  currentStaffMember: StaffMember;
  person: Person;

  constructor(private leadsService: LeadsService,
    private route: ActivatedRoute,
    private storage: StorageMap,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private contactGroupService: ContactGroupsService,
    private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    AppUtils.parentRoute = AppUtils.prevRoute;
    this.route.params.subscribe(params => {
      this.leadId = +params['leadId'] || 0;
    });


    this.setupLeadEditForm();

    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers = data as StaffMember[];
      }
    });

    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.leadTypes = this.listInfo.leadTypes;
      }
    });

    // receive new lead
    this.leadsService.leadsChanges$.subscribe(lead => {
      this.lead = lead;

      if (lead) {
        this.patchLeadValues(lead);

        this.getPersonInformation();

      } else {
        this.leadsService.getLead(this.leadId).subscribe(result => {
          this.lead = result;

          this.patchLeadValues(result);

          this.getPersonInformation();

        }, error => {
          this.lead = null;
        });
      }

      this.staffMemberService.getCurrentStaffMember().subscribe(data => {
        if (data) {
          this.currentStaffMember = data;
        }
      });

      console.log('new lead', this.lead);
      console.log('lead edit form', this.leadEditForm);

    });

    // this.leadsService.getLead(this.leadId).subscribe(result => {
    //   this.lead = result;

    //   this.leadEditForm.patchValue({
    //     ownerId: result.ownerId,
    //     person: result.person,
    //     leadTypeId: result.leadTypeId,
    //     nextChaseDate: this.sharedService.ISOToDate(result.createdDate)
    //   });

    //   console.log('selected lead:', this.lead);
    //   console.log('lead edit form', this.leadEditForm);

    // }, error => {
    //   this.lead = null;
    // });
  }

  private patchLeadValues(lead: Lead) {
    this.leadEditForm.patchValue({
      ownerId: lead.ownerId,
      person: lead.person,
      leadTypeId: lead.leadTypeId,
      nextChaseDate: this.sharedService.ISOToDate(lead.createdDate)
    });
  }

  private getPersonInformation() {
    this.contactGroupService.getPersonNotes(this.lead.personId).subscribe(
      data => {
        this.personNotes = data;
        console.log('notes:', this.personNotes);
      });

    this.contactGroupService.getPerson(this.lead.personId).subscribe(
      data => {
        this.person = data;
        console.log('notes:', this.person);
      });
  }

  private setupLeadEditForm() {
    this.leadEditForm = this.fb.group({
      ownerId: '',
      person: '',
      leadTypeId: '',
      nextChaseDate: ['']
    });
  }

  private CloseLeadClicked() {

    this.lead.closedById = this.currentStaffMember.staffMemberId;
    this.lead.dateClosed = new Date();
    this.leadsService.updateLead(this.lead);
  }




}
