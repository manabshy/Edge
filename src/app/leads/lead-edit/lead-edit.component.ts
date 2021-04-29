import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { AppUtils } from '../../core/shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from '../shared/leads.service';
import { Lead, LeadEditSubNavItems, LeadSearchInfo, ListingType } from '../shared/lead';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail, InfoService } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { ContactNote, PersonSummaryFigures, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Person, PersonProperty } from 'src/app/shared/models/person';
import { ToastrService } from 'ngx-toastr';
import { takeUntil, debounceTime, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { LeadNoteComponent } from '../lead-note/lead-note.component';
import { ValidationMessages, FormErrors } from 'src/app/core/shared/app-constants';
import { Location } from '@angular/common';
import { isEqual, addDays, format } from 'date-fns';
import { WedgeValidators } from 'src/app/shared/wedge-validators';
import { SubNavItem } from 'src/app/shared/subnav';
import { ResultData } from 'src/app/shared/result-data';
import { SideNavItem, SidenavService } from 'src/app/core/services/sidenav.service';
import { MessageService } from 'primeng/api';
import { ValidationService } from 'src/app/core/services/validation.service';
import { zonedTimeToUtc } from 'date-fns-tz';
import enGB from 'date-fns/locale/en-GB';
import { combineLatest } from 'rxjs';
const londonTimeZone = 'Europe/London';

@Component({
  selector: 'app-lead-edit',
  templateUrl: '../lead-edit/lead-edit.component.html',
  styleUrls: ['../lead-edit/lead-edit.component.scss']
})
export class LeadEditComponent extends BaseComponent implements OnInit, OnDestroy {

  listInfo: any;
  leadId: number;
  personId: number;
  isNewLead: boolean;
  lead: Lead;
  allLeadTypes: InfoDetail[];
  leadEditForm: FormGroup;
  personNotes: ContactNote[] = [];
  staffMembers: StaffMember[];
  currentStaffMember: StaffMember;
  person: Person;
  subNav = LeadEditSubNavItems;
  summaryTotals: PersonSummaryFigures;
  page = 1;
  pageSize = 20;
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
  noteIsRequired = false;
  personParams: string;
  formErrors = FormErrors;
  public keepOriginalOrder = (a) => a.key;
  // @ViewChild('leadNote', { static: true }) leadNote: LeadNoteComponent;
  note: ContactNote;
  todaysDate = new Date();
  tomorrowsDate = addDays(new Date(), 1);
  isUpdateComplete: boolean;
  isNoteFormDirty: boolean;
  isPropertyAssociated: boolean;
  isMessageVisible: boolean;
  isPropertyRemoved: boolean;
  isOwnerChanged: boolean;
  isLeadClosed = false;
  isNextChaseDateChanged = false;
  isLeadMarkedAsClosed: boolean;
  isValidatorCleared = false;
  selectedLeadTypeId: number;
  isChaseDateInvalid = false;
  errorMessage: WedgeError;
  leadSearchInfo: LeadSearchInfo;
  infoParam: string;
  isSaveAndNext: boolean;
  showSaveAndNext: boolean;
  showNotes: boolean;
  // moreInfo = '';
  moreInfo = this.sidenavService.selectedItem = 'notes';
  sideNavItems = this.sidenavService.sideNavItems;
  showOnlyMyNotes = false;
  backToOrigin = false;
  canEditLead = true;
  disablePrevious = false;
  disableNext = false;
  currentUrl: string;
  useExistingIds = false;
  exitOnSave = false;
  leadTypes: InfoDetail[];
  canClose = false;
  isMyLead = false;
  hideFooter = false;
  isUnassignedLead: boolean;
  removeSticky = false;
  clearValidationErrors = false;
  get nextChaseDateControl() {
    return this.leadEditForm.get('nextChaseDate') as FormControl;
  }
  get leadTypeControl() {
    return this.leadEditForm.get('leadTypeId') as FormControl;
  }

  constructor(private leadsService: LeadsService,
    private route: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private location: Location,
    private storage: StorageMap,
    private fb: FormBuilder,
    private infoService: InfoService,
    private sharedService: SharedService,
    private sidenavService: SidenavService,
    private contactGroupService: ContactGroupsService,
    private messageService: MessageService,
    private validationService: ValidationService,
    private toastr: ToastrService) {
    super();
  }

  ngOnInit() {
    AppUtils.parentRoute = AppUtils.prevRoute;
    const allParams$ = combineLatest([this.route.params, this.route.queryParamMap])
      .pipe(
        map(([params, queryParams]) => ({ params, queryParams })));

    allParams$.subscribe(res => {
      this.setupQueryParams(res.queryParams);
      this.leadId = +res.params['leadId'] || 0;
      console.log(this.isIdInCurrentList(this.leadId), 'in list');

      // Add !this.isIdInCurrentList(this.leadId) to reduce API calls. combineLatest (2 API calls)
      if (this.leadId && this.showSaveAndNext && !this.isIdInCurrentList(this.leadId)) {
        this.getLeadIds(this.leadId);
      }

      this.hideFooter = !(this.leadSearchInfo || this.isNewLead || this.isMyLead) ? true : false;
    }
    );


    this.onLoading = true;
    this.init();

    this.leadEditForm.valueChanges.subscribe(data => {
      data.closeLead ? this.isLeadMarkedAsClosed = true : this.isLeadMarkedAsClosed = false;
    });

    this.setValidationFor(this.nextChaseDateControl);
    this.setValidationFor(this.leadTypeControl);

    // Remove contact groups from side nav items
    this.sideNavItems.splice(this.sideNavItems.findIndex(x => x.name === 'contactGroups'), 1);
    // Set notes as current item
    const noteIndex = this.sideNavItems.findIndex(x => x.name === 'notes');
    this.sideNavItems[noteIndex].isCurrent = true;

    // Listen to changes to toggle remove sticky class
    this.sharedService.removeSticky$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      res ? this.removeSticky = true : this.removeSticky = false;
    });
  }

  private setValidationFor(control: AbstractControl) {
    control?.valueChanges.subscribe(data => {
      if (control.dirty) {
        this.validationService.setNoteIsRequired(true);
        this.logValidationErrors(this.leadEditForm, true);
      }
    });
  }

  private setupQueryParams(params) {
    this.personId = +params.get('personId') || 0;
    this.isNewLead = params.get('isNewLead') as unknown as boolean || false;
    this.selectedLeadTypeId = +params.get('leadTypeId');
    this.infoParam = params.get('leadSearchInfo');
    this.showSaveAndNext = params.get('showSaveAndNext') as unknown as boolean || false;
    this.showNotes = params.get('showNotes') === 'true';
    this.backToOrigin = JSON.parse(params.get('backToOrigin'));
    this.exitOnSave = JSON.parse(params.get('exitOnSave'));
    this.useExistingIds = params['useExistingIds'] || false;
    // this.isMyLead =  params['isMyLead'];
    this.isMyLead = JSON.parse(params.get('isMyLead'));
    console.log('use existing ids', this.useExistingIds);

    if (this.infoParam) {
      this.leadSearchInfo = JSON.parse(this.infoParam) as LeadSearchInfo;
      this.isUnassignedLead = +this.leadSearchInfo?.listingType === ListingType.UnassignedLeads;

      // this.canEditLead = +this.leadSearchInfo.listingType !== 1 ? false : true;
      // console.log('can edit lead', this.canEditLead);
    }
  }

  isIdInCurrentList(leadId: number) {
    let exists = false;
    console.log('in list', this.leadIds?.find(x => x === leadId), { leadId }, this.leadIds);

    return exists = this.leadIds?.find(x => x === leadId) ? true : false;
  }
  // ngAfterViewInit() {
  //   if (this.leadNote) {
  //     this.note = this.leadNote.getNote();
  //   }
  // }

  init() {
    this.setupLeadEditForm();
    this.leadEditForm.valueChanges.pipe(debounceTime(400)).subscribe((data) => {
      this.logValidationErrors(this.leadEditForm, false);
    });

    // Lead Types
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.allLeadTypes = this.listInfo.leadTypes;
        console.log(' list info in lead edit from storage', data);
      } else {
        this.infoService.getDropdownListInfo().subscribe((info: ResultData | any) => {
          if (info) {
            this.listInfo = info.result;
            this.allLeadTypes = this.listInfo.leadTypes;
            console.log(' list info in lead edit from db', info.result);
          }
        });
      }
      this.setLeadTypes();
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
        } else { this.getLeadInformation(); }
      });
    } else { this.getPersonInformation(); }

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
  }

  setLeadTypes(existingLead?: Lead) {
    this.leadTypes = this.allLeadTypes?.filter(x => x.canCreate);

    if (existingLead) {
      const existingType = this.allLeadTypes?.find(x => x.id === existingLead.leadTypeId);
      this.canClose = existingType?.canClose ? true : false;
      this.leadTypes = this.allLeadTypes?.filter(x => existingType.canConvertTo.includes(x.id));
      this.leadTypes?.unshift(existingType);
      // this.leadTypes = [...this.leadTypes, existingType];
      console.log({ existingType }, this.canClose, 'can close');

    }
  }

  getLeadIds(leadId: number) {
    this.leadsService.getLeadIds(this.leadSearchInfo).subscribe((result: number[]) => {
      // if (this.canEditLead) {
      //   this.leadIds = result?.slice(result?.findIndex(x => x === leadId));
      //   console.log(this.leadIds, 'can edit ids');

      // } else { this.leadIds = result; console.log(this.leadIds, 'cannot edit ids'); }

      this.leadIds = result; console.log(this.leadIds, 'all lead ids');
      this.currentLeadIndex = this.leadIds.indexOf(this.leadSearchInfo.startLeadId);
      this.currentLeadIndex === 0 ? this.disablePrevious = true : this.disablePrevious = false;
      this.currentLeadIndex === this.leadIds?.length - 1 ? this.disableNext = true : this.disableNext = false;

      console.log({ result }, 'lead ids', this.currentLeadIndex, 'current idex');

      if (this.leadIds.length <= 1) {
        this.leadsListCompleted = true;
        this.disableNext = true;
      }
    }, () => { this.lead = null; });
  }

  logValidationErrors(group: FormGroup = this.leadEditForm, fakeTouched: boolean, scrollToError = false) {
    if (!this.canEditLead) {
      console.log('return here...');
      return;
    }
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid || this.clearValidationErrors) { FormErrors[key] = ''; }
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
    if (scrollToError) {
      this.sharedService.scrollToFirstInvalidField();
    }
  }

  private getLeadInformation() {
    this.leadsService.getLead(this.leadId).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: Lead) => {
      this.lead = result;
      this.personId = result.personId;

      this.patchLeadValues(result);
      this.getPersonInformation();
      this.lead?.closedById ? this.isLeadClosed = true : this.isLeadClosed = false;
      this.setCanEditFlag();

      this.setLeadTypes(this.lead);
      console.log(this.isLeadClosed, 'closed', this.canEditLead, 'canedit');

    }, () => {
      this.lead = null;
    });

  }

  private setCanEditFlag() {
    const listingType = this.leadSearchInfo?.listingType ?? 0;
    switch (true) {
      case this.isMyLead && !this.isLeadClosed:
        this.canEditLead = true;
        break;

      default:
        if (+listingType !== ListingType.MyLeads) {
          this.canEditLead = false;
        } else if ((+listingType === ListingType.MyLeads) && !this.isLeadClosed) {
          this.canEditLead = true;
        } else { this.canEditLead = false; }
        break;
    }
  }

  private patchLeadValues(lead: Lead) {
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


  getSelectedStaffMemberId(id: number) {
    console.log('valuer id here', id);
    this.isOwnerChanged = true;
    this.leadEditForm.markAsDirty();
    if (id) {
      this.leadEditForm.patchValue({ ownerId: id });
      console.log('chaser id here', this.leadEditForm.get('ownerId').value);
      this.validationService.setNoteIsRequired(true);
      this.logValidationErrors(this.leadEditForm, true);
    } else {
      this.leadEditForm.patchValue({ ownerId: null });
      console.log('no chaser id id here', this.leadEditForm.get('ownerId').value);
    }

  }

  isObject(val) {
    return val instanceof Object;
  }

  private setupLeadEditForm() {
    this.leadEditForm = this.fb.group({
      ownerId: ['', [Validators.required]],
      person: '',
      leadTypeId: ['', Validators.required],
      nextChaseDate: ['', [Validators.required, WedgeValidators.nextChaseDateValidator()]],
      closeLead: false
    });
  }

  onChaseDateChange(newChaseDate: Date) {
    if (this.lead && this.lead.nextChaseDate) {
      if (!isEqual(newChaseDate, this.lead.nextChaseDate) && this.nextChaseDateControl.touched) {
        this.isNextChaseDateChanged = true;
        console.log('note here', this.note, { newChaseDate }, this.lead.nextChaseDate);
        // this.note?.text ? this.noteIsRequired = false : this.noteIsRequired = true;
        this.validationService.setNoteIsRequired(true);
      } else {
        this.noteIsRequired = false;
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
    this.validationService.setNoteIsRequired(true);
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
      }
      this.isPropertyAssociated = true;
      this.isMessageVisible = false;
    }
  }

  getNewPersonNote(leadNote: ContactNote) {
    if (leadNote) {
      this.note = leadNote;
      this.isNoteFormDirty = true;
      this.noteIsRequired = false;
    } else { this.noteIsRequired = true; }
  }

  setShowMyNotesFlag(onlyMyNotes: boolean) {
    this.showOnlyMyNotes = onlyMyNotes;
    this.personNotes = [];
    this.page = 1;
    this.getPersonNotes();
  }

  create(item: string) {
    if (item === 'leads') {
      localStorage.setItem('currentUrl', this.router.url);
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['leads-register/edit', 0],
          { queryParams: { isNewLead: true, showNotes: true, backToOrigin: true, exitOnSave: this.exitOnSave, personId: this.person?.personId } }));
    } else {
      const fullName = `${this.person?.firstName} ${this.person?.middleName} ${this.person?.lastName}`;
      this.router.navigate(['property-centre', 'detail', 0, 'edit'],
        { queryParams: { isNewProperty: true, personId: this.person?.personId, lastKnownPerson: fullName, backToOrigin: true } });
    }

  }

  SaveLead(shouldExit: boolean = false, leadNote = null) {
    this.logValidationErrors(this.leadEditForm, true, true);
    // this.exitOnSave = shouldExit;
    console.log(this.leadEditForm, 'form here');

    if (this.leadEditForm.invalid) { return; }

    if (this.leadEditForm.dirty || this.isNoteFormDirty || this.isPropertyAssociated || this.isPropertyRemoved || this.isOwnerChanged) {
      const lead = { ...this.lead, ...this.leadEditForm.value } as Lead;
      this.isSubmitting = true;
      const formattedDate = format(lead.nextChaseDate, 'yyyy-MM-dd');
      lead.nextChaseDate = new Date(formattedDate);

      const isNoteRequired = this.isLeadMarkedAsClosed || this.isNextChaseDateChanged;
      if (this.note === undefined) { this.note = {} as ContactNote; }
      if (isNoteRequired && !this.note.text) {
        this.noteIsRequired = true;
        setTimeout(() => {
          this.sharedService.scrollToFirstInvalidField();
        });
        return;
      } else {
        this.noteIsRequired = false;
      }
      this.AddOrUpdateLead(lead);
    } else {
      if (!this.isChaseDateInvalid && this.isSaveAndNext) {
        this.moveToNextLead();
      }
    }

  }

  private AddOrUpdateLead(lead: any) {
    if (this.isNewLead) {
      lead.personId = this.personId;
      lead.createdBy = this.currentStaffMember.staffMemberId;
      lead.createdDate = new Date;
      lead.updatedBy = this.currentStaffMember.staffMemberId;
      lead.updatedDate = new Date;

      this.leadsService.addLead(lead).subscribe((result) => {
        if (result) { this.lead = lead; this.onSaveComplete(result); }
      }, (error: WedgeError) => {
        this.isSubmitting = false;
      });
    } else {
      if (this.isLeadMarkedAsClosed) {
        lead.closedById = this.currentStaffMember.staffMemberId;
        lead.dateClosed = new Date();
      }
      this.updateLead(lead);
    }
    this.addLeadNote();
  }

  private addLeadNote() {
    if (this.note && this.note.text) {
      this.contactGroupService.addPersonNote(this.note).subscribe(data => {
        if (data) {
          this.contactGroupService.notesChanged(data);
        }
      }, (error: WedgeError) => {
        this.isSubmitting = false;
      });
    }
  }

  private updateLead(lead: any) {
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
        } else {
          console.log('dont want to move to next lead');
        }
      }
      this.onSaveComplete(result);
    }, (error: WedgeError) => {
      this.isSubmitting = false;
    });
  }

  private onSaveComplete(lead?: Lead) {
    console.log('i am here in OnUpdateCompleted');

    let time: number;
    this.isPropertyAssociated = false;
    this.isPropertyRemoved = false;
    if (this.isNewLead) {
      this.canEditLead = true;
      this.messageService.add({ severity: 'success', summary: 'Lead successfully saved', closable: false });
    } else {
      this.isSaveAndNext ? time = 2000 : time = 3000;
      this.messageService.add({ severity: 'success', summary: 'Lead successfully updated', closable: false, life: time });
    }


    this.isSaveAndNext = false;
    this.isUpdateComplete = true;
    this.leadsService.isLeadUpdated(true);
    if (this.isNextChaseDateChanged) {
      this.isNextChaseDateChanged = false;
    }

    // let url = this.router.url;
    // let id = this.leadId;
    // if (url.indexOf('edit/' + id) === -1) {
    //   id = 0;
    // }
    // if (url.indexOf('?') >= 0 && this.isNewLead) {
    //   url = url.substring(0, url.indexOf('?'));
    //   url = url.replace('edit/' + id, 'edit/' + lead.leadId);
    //   this.location.replaceState(url);
    //   this.isNewLead = false;
    //   this.leadId = lead.leadId;
    //   this.router.navigate(['/leads-register/edit/', this.leadId]);
    //   this.init();
    // }
    if (lead) {
      this.leadId = lead.leadId;
      this.lead = lead;
      this.currentUrl = localStorage.getItem('currentUrl');
      console.log('current route BEFORE', this.currentUrl);
      if (this.exitOnSave && this.backToOrigin) {
        console.log('exist on save', this.exitOnSave);
        this.router.navigate(['/leads-register/edit/', this.leadId], {
          queryParams:
            { showNotes: true, isMyLead: true, exitOnSave: this.exitOnSave }
        });
      } else if (this.currentUrl) {
        this.router.navigateByUrl(this.currentUrl, { replaceUrl: true });

        localStorage.removeItem('currentUrl');
        this.canEditLead = true;
        // this.canEditLead = this.isMyLead ? true : false;
        console.log('CAN EDIT ', this.canEditLead);

      }
      //  else {
      //   if (this.exitOnSave) {
      //     this.replaceLeadIdInRoute(this.leadId);
      //     // this.router.navigateByUrl('leads-register');
      //     // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //     //   this.router.navigate(['/leads-register/edit/', this.leadId]);
      //     // });
      //   }

      // }
    }
  }

  cancel() {
    this.validationService.clearFormValidators(this.leadEditForm, this.formErrors);
    if (this.isNewLead) {
      this.sharedService.back();
    } else {
      this.router.navigateByUrl('leads-register');
    }
  }

  getPersonNotes() {
    this.getNextPersonNotesPage(this.page);
  }

  private getNextPersonNotesPage(page: number) {

    this.contactGroupService.getPersonNotes(this.personId, this.pageSize, page, this.showOnlyMyNotes).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        if (page === 1) {
          this.personNotes = data;
        } else {
          this.personNotes = _.concat(this.personNotes, data);
        }
      }
      this.setBottomReachedFlag(data);
    });
  }

  private setBottomReachedFlag(result: any) {
    if (result && (!result.length || result.length < +this.pageSize)) {
      this.bottomReached = true;
    } else {
      this.bottomReached = false;
    }
  }

  moveToNextLead(previous?: boolean) {
    console.log({ previous });
    window.scrollTo(0, 0);
    previous ? this.moveToPrevious() : this.moveToNext();
  }

  private moveToNext() {
    if (this.currentLeadIndex++ <= this.leadIds.length - 1) {
      console.log('curent index', this.currentLeadIndex);
      this.disablePrevious = false;
      this.getLeadTraversalInfo();
      if (this.currentLeadIndex === this.leadIds.length - 1) {
        this.leadsListCompleted = true;
        this.disableNext = true;
      }
    } else {
      this.leadsListCompleted = true;
      this.disableNext = true;
    }
  }

  private moveToPrevious() {
    if (this.currentLeadIndex-- >= 0) {
      console.log('curent index', this.currentLeadIndex);
      this.disableNext = false;
      this.noteIsRequired = false;
      this.clearValidationErrors = true;
      this.getLeadTraversalInfo();
      // this.getPersonNotes();
      if (this.currentLeadIndex === 0) {
        this.disablePrevious = true;
      }
    } else {
      this.disablePrevious = true;
    }
  }

  replaceLeadIdInRoute(id: number) {
    this.leadSearchInfo.startLeadId = id;
    this.router.navigate(['/leads-register/edit/', id], {
      queryParams:
        { showNotes: true, showSaveAndNext: true, leadSearchInfo: JSON.stringify(this.leadSearchInfo) }
      // { showNotes: true, showSaveAndNext: true, useExistingIds: true, leadSearchInfo: JSON.stringify(this.leadSearchInfo) } Add useexistingIds flag later
    });
  }

  private getLeadTraversalInfo() {
    this.leadId = this.leadIds[this.currentLeadIndex];
    this.onLoading = true;
    this.page = 1;
    this.personId = null;
    this.person = null;
    this.personNotes = [];
    this.replaceLeadIdInRoute(this.leadId);
    this.getLeadInformation();
  }

  traverseLeads(save?: boolean, previous?: boolean) {
    if (save) {
      this.isSaveAndNext = true;
      this.SaveLead(false, this.note);
      console.log('note', this.note);
    } else {
      console.log('move without saving');

      this.moveToNextLead(previous);
    }
  }

  navigateToNewValuation(propertyId: number, lastKnownOwnerId?: number) {
    this.router.navigate(['valuations-register/detail/', 0, 'edit'], {
      queryParams: {
        propertyId: propertyId,
        lastKnownOwnerId: lastKnownOwnerId,
        isNewValuation: true,
        isFromProperty: true
      }
    });

    console.log('related prop', propertyId);
  }

  getSelectedItem(item: any) {
    this.moreInfo = this.sidenavService.getSelectedItem(item?.type, item?.index);
    console.log({ item });
  }

  canDeactivate(): boolean {
    if (this.leadEditForm.dirty && !this.isSubmitting || this.isPropertyAssociated || this.isPropertyRemoved) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    const contactGroups: SideNavItem = { name: 'contactGroups', isCurrent: false };
    this.sideNavItems.splice(1, 0, contactGroups);
    this.sidenavService.resetCurrentFlag();
  }
}


