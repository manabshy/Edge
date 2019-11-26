import { Component, OnInit } from '@angular/core';
import { AppUtils } from '../../core/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { LeadsService } from '../shared/leads.service';
import { Lead, LeadEditSubNavItems } from '../shared/lead';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { StaffMember } from 'src/app/core/models/staff-member';
import { ContactNote, PersonSummaryFigures } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { getDate } from 'date-fns';
import { Person } from 'src/app/core/models/person';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lead-edit',
  templateUrl: '../lead-edit/lead-edit.component.html',
  styleUrls: ['../lead-edit/lead-edit.component.scss']
})
export class LeadEditComponent implements OnInit {

  listInfo: any;
  leadId: number;
  personId: number;
  isNewLead: boolean;
  lead: Lead;
  leadTypes: InfoDetail[];
  leadEditForm: FormGroup;
  personNotes: ContactNote[] = [];
  staffMembers: StaffMember[];
  currentStaffMember: StaffMember;
  person: Person;
  subNav = LeadEditSubNavItems;
  summaryTotals: PersonSummaryFigures;
  page = 1;
  pageSize = 10;
  bottomReached = false;

  constructor(private leadsService: LeadsService,
    private route: ActivatedRoute,
    private storage: StorageMap,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private contactGroupService: ContactGroupsService,
    private staffMemberService: StaffMemberService,
    private toastr: ToastrService) { }

  ngOnInit() {
    AppUtils.parentRoute = AppUtils.prevRoute;

    this.route.params.subscribe(params => {
      this.leadId = +params['leadId'] || 0;
    });

    this.route.queryParamMap.subscribe(params => {
      this.personId = +params.get('personId') || 0;
      this.isNewLead = params.get('isNewLead') as unknown as boolean || false;
    });

    this.init();
  }

  init() {
    this.setupLeadEditForm();

    // All Staffmembers
    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers = data as StaffMember[];
      }
    });

    // Lead Types
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.leadTypes = this.listInfo.leadTypes;
      }
    });

    // Current Logged in staffmember
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      }
    });

    console.log('New Lead:', this.isNewLead);
    console.log('Person Id:', this.personId);

    if (!this.isNewLead) {
      // receive new lead
      this.leadsService.leadsChanges$.subscribe(lead => {
        this.lead = lead;

        if (lead) {
          this.personId = lead.personId;
          console.log('have lead object...');
          this.patchLeadValues(lead);

          this.getPersonInformation();

        } else {
          console.log('dont have lead object...');
          this.getLeadInformation();
        }
      });
    } else {
      console.log('new lead...');
      console.log("NEW LEAD: ", this.lead);
      this.getPersonInformation();
    }


  }

  private getLeadInformation() {
    this.leadsService.getLead(this.leadId).subscribe(result => {
      this.lead = result;
      this.personId = result.personId;
      this.patchLeadValues(result);
      this.getPersonInformation();
    }, error => {
      this.lead = null;
    });
  }

  private patchLeadValues(lead: Lead) {
    this.leadEditForm.patchValue({
      ownerId: lead.ownerId,
      person: lead.person,
      personId: lead.personId,
      leadTypeId: lead.leadTypeId,
      nextChaseDate: this.sharedService.ISOToDate(lead.nextChaseDate)
    });
  }

  private getPersonInformation() {
    this.contactGroupService.getPersonNotes(this.personId).subscribe(
      data => {
        this.personNotes = data;
      });

    this.contactGroupService.getPerson(this.personId).subscribe(
      data => {
        this.person = data;
        this.getSearchedPersonSummaryInfo(this.person.personId);

        this.subNav.forEach(element => {
          element.params.push(this.person.personId);

        });
      });
  }

  getSearchedPersonSummaryInfo(personId: number) {
    this.contactGroupService.getPersonInfo(personId).subscribe(data => {
      this.summaryTotals = data;
    });
  }

  isObject(val) {
    return val instanceof Object;
  }

  private setupLeadEditForm() {
    this.leadEditForm = this.fb.group({
      ownerId: null,
      person: '',
      leadTypeId: 0,
      nextChaseDate: ['']
    });
  }

  closeLeadClicked() {

    this.lead.closedById = this.currentStaffMember.staffMemberId;
    this.lead.dateClosed = new Date();
    this.updateLead();
  }

  updateLead() {
    const lead = { ...this.lead, ...this.leadEditForm.value };

    if (this.isNewLead) {

      lead.personId = this.personId;
      lead.createdBy = this.currentStaffMember.staffMemberId;
      lead.createdDate = new Date;
      lead.updatedBy = this.currentStaffMember.staffMemberId;
      lead.updatedDate = new Date;

      this.leadsService.addLead(lead).subscribe((result) => {
        this.onUpdateCompleted();
        this.lead = lead;
      }, (error: WedgeError) => {
        this.sharedService.showError(error);
      });
    } else {
      this.leadsService.updateLead(lead).subscribe((result) => {
        this.onUpdateCompleted();
      }, (error: WedgeError) => {
        this.sharedService.showError(error);
      });
    }
  }

  private onUpdateCompleted() {
    if (this.isNewLead) { this.toastr.success('Lead successfully saved'); } else {
      this.toastr.success('Lead successfully updated');
    }
  }

  get dataNote() {
    // if (this.contactGroupDetails) {
      //console.log('PERSON:',this.person);
    return {
      group: null,
      people: [this.person],
    notes: this.personNotes
  };
  // }
  // return null;
}

cancel() {
  if (false) {
    //this.backToFinder.emit(true);
  } else {
    this.sharedService.back();
  }
}


}
