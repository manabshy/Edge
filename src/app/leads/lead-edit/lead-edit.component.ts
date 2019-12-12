import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppUtils } from '../../core/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { LeadsService } from '../shared/leads.service';
import { Lead, LeadEditSubNavItems } from '../shared/lead';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { ContactNote, PersonSummaryFigures, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { getDate } from 'date-fns';
import { Person } from 'src/app/shared/models/person';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { LeadNoteComponent } from '../lead-note/lead-note.component';
import { ValidationMessages, FormErrors } from 'src/app/core/shared/app-constants';

@Component({
  selector: 'app-lead-edit',
  templateUrl: '../lead-edit/lead-edit.component.html',
  styleUrls: ['../lead-edit/lead-edit.component.scss']
})
export class LeadEditComponent extends BaseComponent implements OnInit, AfterViewInit {

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
  noteRequiredWarning: string;
  personParams: string;
  formErrors = FormErrors;
  public keepOriginalOrder = (a) => a.key;
  @ViewChild('leadNote', { static: true }) leadNote: LeadNoteComponent;
  note: ContactNote;
  todaysDate = new Date();
  isUpdateComplete: boolean;
  isNoteFormDirty: boolean;

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
    console.log('lead note component', this.note);
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

  ngAfterViewInit() {
    if (this.leadNote) {
      this.note = this.leadNote.getNote();
      console.log('in after view init', this.leadNote.getNote());
    }
  }
  init() {
    this.setupLeadEditForm();
    this.leadEditForm.valueChanges.pipe(debounceTime(400)).subscribe(() => this.logValidationErrors(this.leadEditForm, false));

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

        if (this.isNewLead) {
          this.leadOwner = this.currentStaffMember;
          this.leadEditForm.get('ownerId').setValue(this.leadOwner.staffMemberId);
        }

      }
    });

    if (!this.isNewLead) {
      // receive new lead
      this.leadsService.leadsChanges$.subscribe(lead => {
        this.lead = lead;

        if (lead) {
          this.personId = lead.personId;
          this.patchLeadValues(lead);
          this.getPersonInformation();

          this.leadOwner = this.staffMembers.find(sm => sm.staffMemberId === this.lead.ownerId)[0];
        } else {
          this.getLeadInformation();
        }
      });
    } else {
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
    this.leadsService.leadClickChanges$.subscribe(leadSearchInfo => {

      if (leadSearchInfo) {
        leadSearchInfo.startLeadId = this.leadId;

        this.leadsService.getLeadIds(leadSearchInfo).subscribe(result => {
          this.leadIds = result;
          this.currentLeadIndex = this.leadIds.indexOf(leadSearchInfo.startLeadId);
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

  logValidationErrors(group: FormGroup = this.leadEditForm, fakeTouched: boolean) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
        FormErrors[key] = '';
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        FormErrors[key] = '';
        for (const errorKey in control.errors) {
          if (errorKey) {
            FormErrors[key] += messages[errorKey] + '\n';
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched);
      }
    });
    this.sharedService.scrollToFirstInvalidField();
  }

  private getLeadInformation() {
    this.leadsService.getLead(this.leadId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.lead = result;
      this.personId = result.personId;
      this.patchLeadValues(result);
      this.getPersonInformation();
      this.leadOwner = this.staffMembers.find(sm => sm.staffMemberId === this.lead.ownerId);
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
      nextChaseDate: this.sharedService.ISOToDate(lead.nextChaseDate),
      closeLead: lead.closedById
    });
    this.onLoading = false;
  }

  private getPersonInformation() {

    this.getPersonNotes();
    this.contactGroupService.getPerson(this.personId).subscribe(
      data => {
        if (data) {
          this.person = data;
          this.personParams = JSON.stringify(this.person);
          this.getSearchedPersonSummaryInfo(this.person.personId);
        }

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
      leadTypeId: [0, Validators.required],
      nextChaseDate: ['', Validators.required],
      closeLead: false
    });
  }

  // closeLeadClicked() {

  //   this.lead.closedById = this.currentStaffMember.staffMemberId;
  //   this.lead.dateClosed = new Date();
  //   this.updateLead();
  // }

  getNewPersonNote(leadNote: ContactNote) {
    if (leadNote) {
      this.note = leadNote;
      this.isNoteFormDirty = true;
    }

  }
  updateLead(shouldExit: boolean = false, leadNote = null) {

    const closeLead = this.leadEditForm.get('closeLead').value;
    const nextChaseDate = this.leadEditForm.get('nextChaseDate').value;
    this.logValidationErrors(this.leadEditForm, true);

    if (this.leadEditForm.valid) {
      this.isSubmitting = true;
      if (this.leadEditForm.dirty || this.isNoteFormDirty) {
        const lead = { ...this.lead, ...this.leadEditForm.value };
        if ((closeLead || this.isNewLead || nextChaseDate) && (this.note.text === '' || this.note.text == null)) {
          this.noteRequiredWarning = 'Note is required.';
          setTimeout(() => {
            this.sharedService.scrollToFirstInvalidField();
          });
          return;
        } else {
          this.noteRequiredWarning = '';
        }
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

          if (closeLead) {
            lead.closedById = this.currentStaffMember.staffMemberId;
            lead.dateClosed = new Date();
          }

          // adding note
          console.log('this note', this.note);
          this.contactGroupService.addPersonNote(this.note).subscribe(data => {
            if (data) {
              this.contactGroupService.notesChanged(data);
            }
          }, (error: WedgeError) => {
            this.sharedService.showError(error);
            this.isSubmitting = false;
          });

          // updating lead
          this.leadsService.updateLead(lead).subscribe((result) => {
            this.onUpdateCompleted();
          }, (error: WedgeError) => {
            this.sharedService.showError(error);
            this.isSubmitting = false;
          });
        }
      } else {
        this.onUpdateCompleted();
      }
    }

  }

  private onUpdateCompleted() {
    if (this.isNewLead) { this.toastr.success('Lead successfully saved'); } else {
      this.toastr.success('Lead successfully updated');
    }
    this.isUpdateComplete = true;
    this.leadsService.isLeadUpdated(true);
  }

  get dataNote() {
    return {
      personId: this.personId
    };
  }

  cancel() {
    if (false) {
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
      }
      if (data && !data.length) {

        this.bottomReached = true;
        console.log('bottom reached', this.bottomReached);
      }
    });
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
  }

  canDeactivate(): boolean {
    if (this.leadEditForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }


}
