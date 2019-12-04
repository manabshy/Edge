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
import { StaffMember } from 'src/app/shared/models/staff-member';
import { ContactNote, PersonSummaryFigures, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { getDate } from 'date-fns';
import { Person } from 'src/app/shared/models/person';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/shared/models/base-component';

@Component({
  selector: 'app-lead-edit',
  templateUrl: '../lead-edit/lead-edit.component.html',
  styleUrls: ['../lead-edit/lead-edit.component.scss']
})
export class LeadEditComponent extends BaseComponent implements OnInit {

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
  leadOwner: StaffMember;
  leadIds: number[] = [];
  currentLeadIndex: number = 0;
  leadsListCompleted: boolean = false;
  isFormDirty: boolean = false;
  onLoading: boolean = false;
  isSubmitting: boolean;
  contactGroups: BasicContactGroup[];
  addressees: any[] = [];

  constructor(private leadsService: LeadsService,
    private route: ActivatedRoute,
    private storage: StorageMap,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private contactGroupService: ContactGroupsService,
    private staffMemberService: StaffMemberService,
    private toastr: ToastrService) { super(); }

  ngOnInit() {
    AppUtils.parentRoute = AppUtils.prevRoute;

    this.route.params.subscribe(params => {
      this.leadId = +params['leadId'] || 0;
    });

    this.route.queryParamMap.subscribe(params => {
      this.personId = +params.get('personId') || 0;
      this.isNewLead = params.get('isNewLead') as unknown as boolean || false;
    });
    this.onLoading = true;
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

          this.leadOwner = this.staffMembers.find(sm => sm.staffMemberId === this.lead.ownerId)[0];
          console.log('lead Owner', this.leadOwner);

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

    this.contactGroupService.noteChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        this.personNotes = [];
        this.page = 1;
        this.bottomReached = false;
        this.getPersonNotes();
      }
    });

    this.contactGroupService.personNotePageChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newPageNumber => {
      this.page = newPageNumber;
      this.getNextPersonNotesPage(this.page);
    });

    // leads search changed
    this.leadsService.leadsSearchChanges$.subscribe(leadSearchInfo => {

      if (leadSearchInfo) {
        leadSearchInfo.startLeadId = this.leadId;

        this.leadsService.getLeadIds(leadSearchInfo).subscribe(result => {
          this.leadIds = result;
          console.log('leads Ids here: ', this.leadIds);
        }, error => {
          this.lead = null;
        });

      }
    });

    this.onChanges();

  }

  onChanges(): void {
    this.leadEditForm.valueChanges.subscribe(val => {
      if (!this.onLoading) {
        this.isFormDirty = true;
      }
    });
  }

  private getLeadInformation() {
    console.log('get lead information', this.leadId);
    this.leadsService.getLead(this.leadId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.lead = result;
      this.personId = result.personId;
      this.patchLeadValues(result);
      console.log('in get lead information', this.personId);
      this.getPersonInformation();
      this.leadOwner = this.staffMembers.find(sm => sm.staffMemberId === this.lead.ownerId);
      console.log('lead Owner', this.leadOwner);
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
    this.onLoading = false;
  }

  private getPersonInformation() {

    this.getPersonNotes();
    this.getContactGroups(this.personId);
    this.contactGroupService.getPerson(this.personId).subscribe(
      data => {
        this.person = data;
        console.log('get person information', this.person);
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

  onOwnerChanged(event: any) {
    console.log(event);

    if (event && event.item != null) {
      this.leadEditForm.patchValue({
        ownerId: event.item.staffMemberId
      });
    } else {
      this.leadEditForm.patchValue({
        ownerId: ''
      });
    }
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
    this.isSubmitting = true;

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
        this.isSubmitting = false;
      });
    } else {
      this.leadsService.updateLead(lead).subscribe((result) => {
        this.onUpdateCompleted();
      }, (error: WedgeError) => {
        this.sharedService.showError(error);
        this.isSubmitting = false;
      });
    }

    this.sharedService.back();

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
      //   group: null,
      //   people: [this.person],
      // notes: this.personNotes
      personId: this.personId
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

  getPersonNotes() {
    this.getNextPersonNotesPage(this.page);
  }

  private getNextPersonNotesPage(page) {

    this.contactGroupService.getPersonNotes(this.personId, this.pageSize, page).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        if (page === 1) {
          this.personNotes = data;
        } else {
          this.personNotes = _.concat(this.personNotes, data);
        }
        console.log('person Notes', this.personNotes);
      }
      if (data && !data.length) {

        this.bottomReached = true;
        console.log('data', data);
        console.log('bottom reached', this.bottomReached);
      }
    });
  }

   // TODO: Retrieve contact groups from contactInfoForNotes$ observable
   getContactGroups(personId: number) {
    this.contactGroupService.getPersonContactGroups(personId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        this.contactGroups = data;
        this.setPersonNoteAddressees(data);
        console.log('addressees: ', this.addressees);
        console.log('contact groups: ', data);
        console.log('person: ', this.person);
      }
    });
  }

  private setPersonNoteAddressees(contactGroups: BasicContactGroup[]) {
    let output;
    if (contactGroups) {
      contactGroups.forEach((item, index) => {
        output = {
          addressee: item.contactPeople.map(x => x.addressee),
          groupId: item.contactGroupId
        };
        if (item.contactPeople.find(p => p.personId === +this.personId)) {
          this.person = item.contactPeople.find(p => p.personId === this.personId);
        }
        this.addressees[index] = output;
      });
    }
  }

  moveToNextLead() {
    console.log('form dirty', this.isFormDirty);
    if (this.isFormDirty) {
      this.updateLead();
      this.isFormDirty = false;
    }

    if (this.currentLeadIndex < this.leadIds.length - 1) {
      this.currentLeadIndex++;
      this.leadId = this.leadIds[this.currentLeadIndex];
      console.log('move to next lead IDs', this.leadIds);
      //console.log('move to next lead ID', this.leadId);
      this.onLoading = true;
      this.getLeadInformation();
      this.getPersonNotes();
    } else {
      this.leadsListCompleted = true;
      console.log('list completed');
    }
    //console.log('list completed?', this.leadsListCompleted);


  }

  canDeactivate(): boolean {
    if (this.leadEditForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }


}
