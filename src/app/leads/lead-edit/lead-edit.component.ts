import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppUtils } from '../../core/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from '../shared/leads.service';
import { Lead, LeadEditSubNavItems, LeadSearchInfo } from '../shared/lead';
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
import { isEqual } from 'date-fns';
import { WedgeValidators } from 'src/app/shared/wedge-validators';
import { SubNavItem } from 'src/app/shared/subnav';

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
  isNextChaseDateChanged = false;
  isLeadMarkedAsClosed: boolean;
  isValidatorCleared: boolean;
  selectedLeadTypeId: number;
  isChaseDateInvalid: boolean = false;
  errorMessage: WedgeError;
  leadSearchInfo: LeadSearchInfo;
  infoParam: string;
  isSaveAndNext: boolean;
  showSaveAndNext: boolean;
  showNotes: boolean;
  moreInfo: string = '';
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
    private toastr: ToastrService) {
    super();
    console.log('I am in the constructor');
  }

  ngOnInit() {
    console.log('I am in the beginning of Lead Edit ngOnInit: ', this.showSaveAndNext, this.leadsListCompleted);
    AppUtils.parentRoute = AppUtils.prevRoute;
    this.selectedLeadTypeId = +this.route.snapshot.queryParamMap.get('leadTypeId');
    this.infoParam = this.route.snapshot.queryParamMap.get('leadSearchInfo');
    this.showSaveAndNext = this.route.snapshot.queryParamMap.get('showSaveAndNext') === 'true';
    this.showNotes = this.route.snapshot.queryParamMap.get('showNotes') === 'true';
    this.route.params.subscribe(params => {
      this.leadId = +params['leadId'] || 0;
      console.log('I am in Lead Edit ngOnInit: ', this.leadId, this.showSaveAndNext);
      if (this.leadId && this.showSaveAndNext) {
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
      data.closeLead ? this.isLeadMarkedAsClosed = true : this.isLeadMarkedAsClosed = false;
    });
    console.log('I am at the end of Lead Edit ngOnInit: ', this.leadId, this.showSaveAndNext, this.leadsListCompleted);

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
    this.setNextChaseDateValidators();

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
        console.log('i am here in Lead Change subscription...');
        this.lead = lead;

        if (lead) {
          this.personId = lead.personId;
          this.patchLeadValues(lead);
          this.getPersonInformation();

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
      if (this.personId == null) {
        this.page = 1;
      }
      this.getNextPersonNotesPage(this.page);
    });

    console.log('I am at the end of Init(): ', this.leadId, this.showSaveAndNext, this.leadsListCompleted);


  }

  getLeadIds(leadId: number) {
    this.leadSearchInfo = JSON.parse(this.infoParam) as LeadSearchInfo;

    this.leadsService.getLeadIds(this.leadSearchInfo).subscribe(result => {
      this.leadIds = result;
      this.currentLeadIndex = this.leadIds.indexOf(this.leadSearchInfo.startLeadId);
      console.log('(TRAVERSE) Lead IDs to traverse: ', this.leadIds);

      if (this.leadIds.length <= 1) {
        this.leadsListCompleted = true;
      }
    }, () => {
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
        console.log('errors ', control.errors);
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
    console.log('I am at the beginning of getLeadInformation(): ', this.leadId, this.showSaveAndNext, this.leadsListCompleted);

    this.leadsService.getLead(this.leadId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.lead = result;
      this.personId = result.personId;
      this.patchLeadValues(result);
      this.getPersonInformation();
      //this.getPersonNotes();
      this.lead.dateClosed ? this.isLeadClosed = true : this.isLeadClosed = false;
    }, () => {
      this.lead = null;
    });
    console.log('I am at the end of getLeadInformation(): ', this.leadId, this.showSaveAndNext, this.leadsListCompleted);

  }

  private patchLeadValues(lead: Lead) {
    console.log('I am in patchLeadValues(): ', this.lead);

    if (lead) {
      this.leadEditForm.patchValue({
        ownerId: lead.ownerId,
        person: lead.person,
        personId: lead.personId,
        leadTypeId: lead.leadTypeId,
        nextChaseDate: lead.nextChaseDate ? new Date(lead.nextChaseDate) : null,
        closeLead: lead.closedById
      });
    }
    this.onLoading = false;

  }

  private getPersonInformation() {

    this.contactGroupService.getPerson(this.personId).subscribe(
      data => {
        if (data) {
          this.person = data;
          this.personParams = JSON.stringify(this.person);
          this.getSearchedPersonSummaryInfo(this.person.personId);
          this.getPersonNotes();
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
    this.isOwnerChanged = true;
    console.log('from child', event)
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
      nextChaseDate: ['', [Validators.required]],
      closeLead: false
    });
  }

  onChaseDateChange(newChaseDate: Date) {
    if (this.lead && this.lead.nextChaseDate) {
      if (!isEqual(newChaseDate, this.lead.nextChaseDate)) {
        this.isNextChaseDateChanged = true;
        console.log('note here', this.note);
        this.note ? this.noteRequiredWarning = '' : this.noteRequiredWarning = 'Note is required.';
      } else {
        this.noteRequiredWarning = '';
      }
    }
  }

  closeLeadChanged(lead: Lead) {
    const nextChaseDateControl = this.leadEditForm.get('nextChaseDate');
    if (lead.nextChaseDate == null || nextChaseDateControl.value < new Date()) {
      this.isValidatorCleared = true;
      nextChaseDateControl.clearValidators();
      nextChaseDateControl.updateValueAndValidity();
    }
  }

  clearNextChaseDateValidators() {
    this.nextChaseDateControl.clearValidators();
    this.nextChaseDateControl.updateValueAndValidity();
  }

  setNextChaseDateValidators() {
    console.log('condit.....', this.nextChaseDateControl.value != '' && this.nextChaseDateControl.value < new Date() && !this.isValidatorCleared);

    console.log("this.nextChaseDateControl.value == ''", this.nextChaseDateControl.value === '');
    console.log("this.nextChaseDateControl.value == undefined", this.nextChaseDateControl.value === undefined);
    console.log("this.nextChaseDateControl.value == null", this.nextChaseDateControl.value === null);
    console.log("this.isValidatorCleared", !this.isValidatorCleared);
    console.log("this.nextChaseDateControl.value < new Date()", this.nextChaseDateControl.value < new Date());

    if (this.nextChaseDateControl.value < new Date() && !this.isValidatorCleared) {
      this.nextChaseDateControl.setValidators(WedgeValidators.nextChaseDateValidator());
      this.nextChaseDateControl.updateValueAndValidity();
      // this.isChaseDateInvalid = true;
    }

    if (this.nextChaseDateControl.value != '' && this.nextChaseDateControl.value < new Date() && !this.isValidatorCleared) {
      this.isChaseDateInvalid = true;
    }
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
        this.AddOrUpdateLead(lead);
      } else {
        if (!this.isChaseDateInvalid && this.isSaveAndNext) {
          this.moveToNextLead();
        }

        this.onUpdateCompleted();
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
    }

  }

  private AddOrUpdateLead(lead: any) {
    if (this.isNewLead) {
      lead.personId = this.personId;
      lead.createdBy = this.currentStaffMember.staffMemberId;
      lead.ownerId = this.currentStaffMember.staffMemberId;
      lead.createdDate = new Date;
      lead.updatedBy = this.currentStaffMember.staffMemberId;
      lead.updatedDate = new Date;

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
      this.leadsService.updateLead(lead).subscribe((result) => {
        if (result) {
          this.lead = result;
          result.dateClosed ? this.isLeadClosed = true : this.isLeadClosed = false;
          if (this.isChaseDateInvalid) {
            this.isChaseDateInvalid = false;
          }
          console.log('is chase date invalid', this.isChaseDateInvalid);
          if (!this.isChaseDateInvalid && this.isSaveAndNext) {
            console.log('is chase date invalid 2', this.isChaseDateInvalid);
            this.moveToNextLead();
          }
          else {
            console.log('dont want to move to next lead');
          }
        }
        this.onUpdateCompleted(result);
      }, (error: WedgeError) => {
        this.sharedService.showError(error);
        this.isSubmitting = false;
      });
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
  }

  private onUpdateCompleted(lead?: Lead) {
    console.log('i am here in OnUpdateCompleted');

    let time: number;
    if (this.isNewLead) { this.toastr.success('Lead successfully saved'); } else {
      this.isSaveAndNext ? time = 2000 : time = 5000;
      this.toastr.success('Lead successfully updated', '', { timeOut: time });
    }

    this.isSaveAndNext = false;
    this.isUpdateComplete = true;
    this.leadsService.isLeadUpdated(true);
    if (this.isNextChaseDateChanged) {
      this.isNextChaseDateChanged = false;
    }

    let url = this.router.url;
    let id = this.leadId;
    if (url.indexOf('edit/' + id) === -1) {
      id = 0;
    }
    if (url.indexOf('?') >= 0 && this.isNewLead) {
      url = url.substring(0, url.indexOf('?'));
      url = url.replace('edit/' + id, 'edit/' + lead.leadId);
      this.location.replaceState(url);
      this.isNewLead = false;
      this.leadId = lead.leadId;
      this.router.navigate(['/leads-register/edit/', this.leadId]);
      this.init();
    }

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
    window.scrollTo(0, 0);
    if (this.currentLeadIndex++ <= this.leadIds.length - 1) {
      this.leadId = this.leadIds[this.currentLeadIndex];
      this.onLoading = true;
      this.page = 1;
      this.personId = null;
      this.person = null;
      this.personNotes = [];
      this.getLeadInformation();
      // this.getPersonNotes();
      if (this.currentLeadIndex == this.leadIds.length - 1) {
        this.leadsListCompleted = true;
      }
    } else {
      this.leadsListCompleted = true;
    }
  }

  traverseLeads() {
    this.isSaveAndNext = true;
    this.SaveLead(true, this.note);
    console.log('note', this.note);
  }

  navigateToNewValuation(propertyId: number, lastKnownOwnerId?: number) {
    this.router.navigate(['valuations-register/detail/', 0, 'edit'], {
      queryParams: {
        propertyId: propertyId,
        lastKnownOwnerId: lastKnownOwnerId,
        isNewValuation: true
      }
    })

    console.log('related prop', propertyId)
  }

  getMoreInfo(item: SubNavItem) {
    this.moreInfo = item.value;
  }
  
  canDeactivate(): boolean {
    if (this.leadEditForm.dirty && !this.isSubmitting || this.isPropertyAssociated || this.isPropertyRemoved) {
      return false;
    }
    return true;
  }
}
