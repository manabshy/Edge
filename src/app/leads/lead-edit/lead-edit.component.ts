import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppUtils } from '../../core/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from '../shared/leads.service';
import { Lead, LeadEditSubNavItems, LeadProperty, LeadSearchInfo } from '../shared/lead';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { ContactNote, PersonSummaryFigures, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Person, PersonProperty } from 'src/app/shared/models/person';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { LeadNoteComponent } from '../lead-note/lead-note.component';
import { ValidationMessages, FormErrors } from 'src/app/core/shared/app-constants';
import { Location } from '@angular/common';
import { isEqual, isSameDay, format } from 'date-fns';

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
  currentLeadIndex = 0;
  leadsListCompleted = false;
  onLoading = false;
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
  isPropertyAssociated: boolean;
  isMessageVisible: boolean;
  isPropertyRemoved: boolean;
  isOwnerChanged: boolean;
  isLeadClosed: boolean;
  isNextChaseDateChanged: boolean;
  isLeadMarkedAsClosed: boolean;
  get nextChaseDateControl() {
    return this.leadEditForm.get('nextChaseDate') as FormControl;
  }

  constructor(private leadsService: LeadsService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
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
      if (this.leadId) {
        this.getLeadIds(this.leadId);
      }
    });

    this.route.queryParamMap.subscribe(params => {
      this.personId = +params.get('personId') || 0;
      this.isNewLead = params.get('isNewLead') as unknown as boolean || false;
    });
    this.onLoading = true;
    this.init();

    this.leadEditForm.valueChanges.subscribe(data => {
      console.log('all changes', data)
      if (this.lead) {
        if (!isEqual(data.nextChaseDate, this.lead.nextChaseDate)) {
          this.isNextChaseDateChanged = true;
          console.log('next date change', this.isNextChaseDateChanged, 'changes', data)
        }
      }
      data.closeLead ? this.isLeadMarkedAsClosed = true : this.isLeadMarkedAsClosed = false;
    })
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

  }

  getLeadIds(leadId: number) {
    console.log('leadId', leadId)
    const leadSearchInfo = { startLeadId: leadId } as LeadSearchInfo;
    this.leadsService.getLeadIds(leadSearchInfo).subscribe(result => {
      this.leadIds = result;
      this.currentLeadIndex = this.leadIds.indexOf(leadSearchInfo.startLeadId);
    }, error => {
      this.lead = null;
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
      this.lead.dateClosed ? this.isLeadClosed = true : this.isLeadClosed = false;
      this.leadOwner = this.staffMembers.find(sm => sm.staffMemberId === this.lead.ownerId);
    }, error => {
      this.lead = null;
    });
  }

  private patchLeadValues(lead: Lead) {
    console.log('values to patch here', lead);
    if (lead) {
      this.leadEditForm.patchValue({
        ownerId: lead.ownerId,
        person: lead.person,
        personId: lead.personId,
        leadTypeId: lead.leadTypeId,
        nextChaseDate: this.sharedService.ISOToDate(lead.nextChaseDate),
        closeLead: lead.closedById
      });
    }
    this.onLoading = false;
    console.log('after patching here', this.leadEditForm.value);
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
    console.log('new owner here...', event);
    this.isOwnerChanged = true;
    if (event && event.item != null || event) {
      let ownerId = 0;
      event.item ? ownerId = event.item.staffMemberId : ownerId = event.staffMemberId;
      this.leadEditForm.patchValue({
        ownerId: ownerId
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

  closeLeadChanged(lead: Lead) {
    const nextChaseDateControl = this.leadEditForm.get('nextChaseDate');
    if (lead.nextChaseDate == null) {
      nextChaseDateControl.clearValidators();
      nextChaseDateControl.updateValueAndValidity();
    }
  }

  clearNextCaseDateValidators() {
    this.nextChaseDateControl.clearValidators();
    this.nextChaseDateControl.updateValueAndValidity();
    console.log('here for validators', this.nextChaseDateControl);
  }

  removeProperty() {
    const newLead = { ...this.lead, ...{ relatedProperty: null } };
    if (this.lead.relatedProperty) {
      this.isMessageVisible = true;
      this.isPropertyRemoved = true;
      this.lead = newLead;
    }
  }

  getAssociatedProperty(property: PersonProperty) {
    if (property) {
      if (this.lead) {
        this.lead.relatedProperty = property;
      } else {
        this.lead = {} as Lead;
        this.lead.relatedProperty = property;
        console.log('related property', this.lead.relatedProperty);
      }
      this.isPropertyAssociated = true;
      this.isMessageVisible = false;
    }
  }

  getNewPersonNote(leadNote: ContactNote) {
    if (leadNote) {
      this.note = leadNote;
      this.isNoteFormDirty = true;
    }
  }
  // TODO: REFACTOR ASAP
  SaveLead(shouldExit: boolean = false, leadNote = null) {

    this.logValidationErrors(this.leadEditForm, true);

    if (this.leadEditForm.valid) {
      this.isSubmitting = true;
      if (this.leadEditForm.dirty || this.isNoteFormDirty || this.isPropertyAssociated || this.isPropertyRemoved || this.isOwnerChanged) {
        const lead = { ...this.lead, ...this.leadEditForm.value };
        const isNoteRequired = this.isLeadMarkedAsClosed || this.isNewLead || this.isNextChaseDateChanged;
        if ((isNoteRequired) && (this.note.text === '' || this.note.text == null)) {
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
          lead.ownerId = this.currentStaffMember.staffMemberId;
          lead.createdDate = new Date;
          lead.updatedBy = this.currentStaffMember.staffMemberId;
          lead.updatedDate = new Date;

          if (this.note && this.note.text) {
            this.contactGroupService.addPersonNote(this.note).subscribe(data => {
              if (data) {
                this.contactGroupService.notesChanged(data);
              }
            }, (error: WedgeError) => {
              this.sharedService.showError(error);
              this.isSubmitting = false;
            });
          }

          this.leadsService.addLead(lead).subscribe((result) => {
            if (result) {
              this.lead = lead;
              this.onUpdateCompleted(result);
            }
          }, (error: WedgeError) => {
            this.sharedService.showError(error);
            this.isSubmitting = false;
          });
        } else {

          if (this.isLeadMarkedAsClosed) {
            lead.closedById = this.currentStaffMember.staffMemberId;
            lead.dateClosed = new Date();
          }

          // adding note
          if (this.note && this.note.text) {
            this.contactGroupService.addPersonNote(this.note).subscribe(data => {
              if (data) {
                this.contactGroupService.notesChanged(data);
              }
            }, (error: WedgeError) => {
              this.sharedService.showError(error);
              this.isSubmitting = false;
            });
          }

          // updating lead
          this.leadsService.updateLead(lead).subscribe((result) => {
            if (result) {
              this.lead = result;
              result.dateClosed ? this.isLeadClosed = true : this.isLeadClosed = false;
            }
            this.onUpdateCompleted(result);
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

  private onUpdateCompleted(lead?: Lead) {
    if (this.isNewLead) { this.toastr.success('Lead successfully saved'); } else {
      this.toastr.success('Lead successfully updated');
    }
    this.isUpdateComplete = true;
    this.leadsService.isLeadUpdated(true);

    let url = this.router.url;
    let id = this.leadId;
    if (url.indexOf('edit/' + id) === -1) {
      id = 0;
    }
    if (url.indexOf('?') >= 0) {
      url = url.substring(0, url.indexOf('?'));
      url = url.replace('edit/' + id, 'edit/' + lead.leadId);
      this.location.replaceState(url);
      this.isNewLead = false;
      this.leadId = lead.leadId;
      this.router.navigate(['/leads-register/edit/', this.leadId]);
      this.init();
    }
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
    console.log('lead form dirty', this.leadEditForm.dirty);
    if (this.leadEditForm.dirty || this.isNoteFormDirty) {
      this.SaveLead(true, this.note);
      this.isNoteFormDirty = false;
      this.leadEditForm.markAsPristine();
      this.noteRequiredWarning = '';
    }

    if (this.currentLeadIndex < this.leadIds.length - 1) {
      this.currentLeadIndex++;
      this.leadId = this.leadIds[this.currentLeadIndex];
      console.log('move to next lead IDs', this.leadIds);
      this.onLoading = true;
      this.getLeadInformation();
      this.getPersonNotes();
    } else {
      this.leadsListCompleted = true;
      console.log('list completed', this.leadIds);
      this.leadEditForm.reset();
      console.log('form here', this.leadEditForm);
    }
  }

  canDeactivate(): boolean {
    if (this.leadEditForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }
}
