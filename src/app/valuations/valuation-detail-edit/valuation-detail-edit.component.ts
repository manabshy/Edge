import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import addYears from 'date-fns/add_years';
import differenceInCalendarYears from 'date-fns/difference_in_calendar_years';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { DropdownListInfo, InfoDetail } from 'src/app/core/services/info.service';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { FormErrors } from 'src/app/core/shared/app-constants';
import { MinBedrooms, Property } from 'src/app/property/shared/property';
import { PropertyService } from 'src/app/property/shared/property.service';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { BaseProperty } from 'src/app/shared/models/base-property';
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member';
import { Valuation, ValuationStatusEnum, ValuationPropertyInfo } from '../shared/valuation';
import { ValuationService } from '../shared/valuation.service';
import { Instruction } from 'src/app/shared/models/instruction';
import { ResultData } from 'src/app/shared/result-data';

@Component({
  selector: 'app-valuation-detail-edit',
  templateUrl: './valuation-detail-edit.component.html',
  styleUrls: ['./valuation-detail-edit.component.scss']
})
export class ValuationDetailEditComponent extends BaseComponent implements OnInit, OnDestroy {
  showCalendar = false;
  valuationId: number;
  valuation: Valuation;
  lastKnownOwner: Signer;
  valuationForm: FormGroup;
  tenures: InfoDetail[];
  outsideSpaces: InfoDetail[];
  parkings: InfoDetail[];
  features: InfoDetail[];
  selectedDate: Date;
  createdSigner: any;
  isCreatingNewSigner: boolean;
  allStaffMembers: BaseStaffMember[];
  attendees: BaseStaffMember[] = [];
  attendee: BaseStaffMember;
  mainStaffMember: BaseStaffMember;
  staffMemberId: number;
  isNewValuation: boolean;
  showOnlyMainStaffMember: boolean;
  errorMessage: WedgeError;
  isSubmitting: boolean;
  formErrors = FormErrors;
  property: Property;
  isOwnerChanged: boolean;
  isPropertyChanged: boolean;
  allAttendees: BaseStaffMember[];
  isEditable: boolean;
  showLeaseExpiryDate: boolean;
  canInstruct: boolean;
  propertyId: number;
  lastKnownOwnerId: number;
  approxLeaseExpiryDate: Date;
  instructionForm: FormGroup;
  instruction: Instruction;
  originTypes: InfoDetail[];
  allOrigins: InfoDetail[];
  origins: InfoDetail[];
  origin: string;
  valuers: BaseStaffMember[] = [];

  get isInvitationSent() {
    return this.valuationForm.get('isInvitationSent') as FormControl;
  }

  get approxLeaseExpiryDateControl() {
    return this.valuationForm.get('approxLeaseExpiryDate') as FormControl;
  }
  get shortLetWeeklyControl() {
    return this.valuationForm.get('suggestedAskingRentShortLet') as FormControl;
  }
  get longLetWeeklyControl() {
    return this.valuationForm.get('suggestedAskingRentLongLet') as FormControl;
  }
  get shortLetMonthlyControl() {
    return this.valuationForm.get('suggestedAskingRentShortLetMonthly') as FormControl;
  }
  get longLetMonthlyControl() {
    return this.valuationForm.get('suggestedAskingRentLongLetMonthly') as FormControl;
  }
  get instAskingPriceControl() {
    return this.instructionForm.get('askingPrice') as FormControl;
  }
  get instShortLetWeeklyControl() {
    return this.instructionForm.get('askingRentShortLet') as FormControl;
  }
  get instLongLetWeeklyControl() {
    return this.instructionForm.get('askingRentLongLet') as FormControl;
  }
  get instShortLetMonthlyControl() {
    return this.instructionForm.get('askingRentShortLetMonthly') as FormControl;
  }
  get instLongLetMonthlyControl() {
    return this.instructionForm.get('askingRentLongLetMonthly') as FormControl;
  }

  get rooms() {
    return MinBedrooms;
  }

  get areValuesVisible() {
    if (this.valuation) {
      return this.valuation.valuationStatus !== ValuationStatusEnum.Incomplete && this.valuation.valuationStatus !== ValuationStatusEnum.None;
    }
  }

  staffMembers = [
    { staffMemberId: 2484, fullName: 'Gabor Remenyi', emailAddress: 'gremenyi@dng.co.uk', hasReminder: null },
    { staffMemberId: 2127, fullName: 'Matt Easley', emailAddress: 'measley@dng.co.uk', hasReminder: null },
    { staffMemberId: 2606, fullName: 'Elia Fulchignoni', emailAddress: 'efulchignoni@dng.co.uk' },
    { staffMemberId: 2523, fullName: 'Alexander Agyapong', emailAddress: 'aagyapong@dng.co.uk' },
    { staffMemberId: 2537, fullName: 'Mansoor Malik', emailAddress: 'mmalik@dng.co.uk', hasReminder: null }
  ];

  constructor(private valuationService: ValuationService,
    private propertyService: PropertyService,
    private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private staffMemberService: StaffMemberService,
    private toastr: ToastrService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) { super(); }



  ngOnInit() {
    this.setupForm();
    this.setupInstructionForm();
    this.valuationId = +this.route.snapshot.paramMap.get('id');
    this.propertyId = +this.route.snapshot.queryParamMap.get('propertyId');
    this.lastKnownOwnerId = +this.route.snapshot.queryParamMap.get('lastKnownOwnerId');
    this.isNewValuation = this.route.snapshot.queryParamMap.get('isNewValuation') as unknown as boolean;
    console.log('id', this.propertyId, 'ownerId', this.lastKnownOwnerId);
    if (this.valuationId) {
      this.getValuation(this.valuationId);
    }

    if (this.propertyId) {
      this.getPropertyDetails();
    }

    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      this.tenures = info.tenures;
      this.outsideSpaces = info.outsideSpaces;
      this.parkings = info.parkings;
      this.features = info.propertyFeatures;
      this.allOrigins = info.origins;
      this.originTypes = info.originTypes;
    });

    this.storage.get('allAttendees').subscribe(data => {
      if (data) {
        this.allAttendees = data as BaseStaffMember[];
      } else {
        this.staffMemberService.getValuationAttendees().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => this.allAttendees = result);
      }
    });

    this.getAddedProperty();

    this.contactGroupService.signer$.subscribe(data => {
      if (data) {
        this.lastKnownOwner = data;
        this.createdSigner = data;
        this.isCreatingNewSigner = false;
      }
    });

    this.valuationForm.valueChanges
      // .pipe(debounceTime(400))
      .subscribe((data) => {
        this.sharedService.logValidationErrors(this.valuationForm, false);
        this.setRentFigures();
      });

    this.instructionForm.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.sharedService.logValidationErrors(this.instructionForm, false);
        this.setInstructionFormValidators();
        this.setInstructionRentFigures();
      });

  }

  private getPropertyDetails() {
    this.propertyService.getProperty(this.propertyId, false, false, true).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.lastKnownOwner = result.lastKnownOwner;
        this.property = result;
        this.valuers = result.valuers;
        const baseProperty = { propertyId: this.property.propertyId, address: this.property.address } as BaseProperty;
        this.valuationForm.get('property').setValue(baseProperty);
        console.log('base property', this.valuationForm.get('property').value);
      }
    });
  }

  setInstructionRentFigures() {
    if (this.instShortLetWeeklyControl.value) {
      this.setMonthlyRent(this.instShortLetWeeklyControl, this.instShortLetMonthlyControl);
    }
    if (this.instLongLetWeeklyControl.value) {
      this.setMonthlyRent(this.instLongLetWeeklyControl, this.instLongLetMonthlyControl);
    }
    if (this.instShortLetMonthlyControl.value) {
      this.setWeeklyRent(this.instShortLetWeeklyControl, this.instShortLetMonthlyControl);
    }
    if (this.instLongLetMonthlyControl.value) {
      this.setWeeklyRent(this.instLongLetWeeklyControl, this.instLongLetMonthlyControl);
    }
  }

  setupInitialRentFigures(val: Valuation) {
    if (val.suggestedAskingRentShortLet) {
      this.shortLetMonthlyControl.setValue(this.calculateMonthlyRent(+val.suggestedAskingRentShortLet));
    }
    if (val.suggestedAskingRentLongLet) {
      this.longLetMonthlyControl.setValue(this.calculateMonthlyRent(+val.suggestedAskingRentLongLet));
    }
    if (val.suggestedAskingRentShortLetMonthly) {
      this.shortLetWeeklyControl.setValue(this.calculateWeeklyRent(+val.suggestedAskingRentShortLetMonthly));
    }
    if (val.suggestedAskingRentLongLetMonthly) {
      this.longLetWeeklyControl.setValue(this.calculateMonthlyRent(+val.suggestedAskingRentLongLetMonthly));
    }

  }

  setRentFigures() {
    if (this.shortLetWeeklyControl.value) {
      this.setMonthlyRent(this.shortLetWeeklyControl, this.shortLetMonthlyControl);
    }
    if (this.shortLetMonthlyControl.value) {
      this.setWeeklyRent(this.shortLetWeeklyControl, this.shortLetMonthlyControl);
    }
    if (this.longLetWeeklyControl.value) {
      this.setMonthlyRent(this.longLetWeeklyControl, this.longLetMonthlyControl);
    }
    if (this.longLetMonthlyControl.value) {
      this.setWeeklyRent(this.longLetWeeklyControl, this.longLetMonthlyControl);
    }
  }

  private setMonthlyRent(weeklyControl: FormControl, monthlyControl: FormControl) {
    weeklyControl.valueChanges
      .subscribe(rent => monthlyControl.setValue(this.calculateMonthlyRent(rent), { emitEvent: false }));
  }
  private setWeeklyRent(weeklyControl: FormControl, monthlyControl: FormControl) {
    monthlyControl.valueChanges
      .subscribe(rent => weeklyControl.setValue(this.calculateWeeklyRent(rent), { emitEvent: false }));
  }

  private calculateMonthlyRent(rent: any): any {
    return (+rent * (52 / 12)).toFixed(2);
  }
  private calculateWeeklyRent(rent: any): any {
    return (+rent * (12 / 52)).toFixed(2);
  }

  setupForm() {
    this.valuationForm = this.fb.group({
      property: [''],
      propertyOwner: [''],
      originType: [0, Validators.required],
      originId: [0, Validators.required],
      reason: ['', Validators.required],
      timeFrame: ['', Validators.required],
      marketChat: ['', Validators.required],
      generalNotes: ['', Validators.required],
      bedrooms: [0],
      bathrooms: [0],
      receptions: [0],
      sqFt: [0],
      tenureId: [0],
      outsideSpace: [''],
      parking: [''],
      propertyFeature: [''],
      approxLeaseExpiryDate: [''],
      valuer: [''],
      isInvitationSent: true,
      totalHours: [1],
      attendees: [''],
      searchAttendeeId: null,
      valuationDate: [''],
      suggestedAskingPrice: [],
      suggestedAskingRentLongLet: [],
      suggestedAskingRentShortLet: [],
      suggestedAskingRentLongLetMonthly: [],
      suggestedAskingRentShortLetMonthly: []
    });
  }
  setupInstructionForm() {
    this.instructionForm = this.fb.group({
      instructSale: [false],
      instructShortLet: [false],
      instructLongLet: [false],
      agencyType: ['', Validators.required],
      askingPrice: [],
      askingRentLongLet: [],
      askingRentShortLet: [],
      askingRentLongLetMonthly: [],
      askingRentShortLetMonthly: []
    });
  }

  selectMainStaffMember(staffMember: BaseStaffMember) {
    this.mainStaffMember = staffMember;
    this.staffMemberId = staffMember.staffMemberId;
    this.showCalendar = true;
    this.showOnlyMainStaffMember = true;
    this.valuationForm.get('valuer').setValue(staffMember);
  }

  closeCalendar() {
    this.showCalendar = false;
    // if (!this.selectedDate) {
    //   this.mainStaffMember = null;
    //   this.staffMemberId = null;
    //   this.showOnlyMainStaffMember = false;
    // }
  }

  getValuation(id: number) {
    this.valuationService.getValuation(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data => {
      if (data) {
        this.valuation = data;
        this.valuation.valuationStatus === 3 ? this.isEditable = false : this.isEditable = true;
        this.valuation.valuationStatus === 3 ? this.canInstruct = true : this.canInstruct = false;
        this.valuation.approxLeaseExpiryDate ? this.showLeaseExpiryDate = true : this.showLeaseExpiryDate = false;
        this.attendees = this.valuation.attendees ? this.valuation.attendees : [];
        this.valuation.valuer.fullName ? this.showOnlyMainStaffMember = true : this.showOnlyMainStaffMember = false;
        this.valuation.valuer ? this.mainStaffMember = this.valuation.valuer : this.mainStaffMember = this.mainStaffMember;
        if (this.property) {
          this.lastKnownOwner = this.property.lastKnownOwner;
          this.property = this.property;
        } else {
          this.lastKnownOwner = this.valuation.propertyOwner;
          this.property = this.valuation.property;
        }
        this.populateForm(data);
        this.setupInitialRentFigures(data);
        if (this.valuation && this.allOrigins) {
          this.getOriginIdValue(this.valuation.originId);
        }

      }
    }));
  }

  populateForm(valuation: Valuation) {
    if (valuation) {
      this.valuationForm.patchValue({
        property: valuation.property,
        propertyOwner: valuation.propertyOwner,
        originId: valuation.originId,
        reason: valuation.reason,
        timeFrame: valuation.timeFrame,
        marketChat: valuation.marketChat,
        generalNotes: valuation.generalNotes,
        bedrooms: valuation.bedrooms || 0,
        bathrooms: valuation.bathrooms || 0,
        receptions: valuation.receptions || 0,
        tenureId: valuation.tenureId || 0,
        approxLeaseExpiryDate: this.changeLeaseExpiryDateToYears(valuation.approxLeaseExpiryDate),
        sqFt: valuation.sqFt || 'Not Known',
        outsideSpace: valuation.outsideSpace,
        parking: valuation.parking,
        propertyFeature: valuation.propertyFeature,
        valuer: valuation.valuer,
        attendees: valuation.attendees,
        valuationDate: valuation.valuationDate,
        totalHours: valuation.totalHours,
        suggestedAskingPrice: valuation.suggestedAskingPrice ? valuation.suggestedAskingPrice : '',
        suggestedAskingRentLongLet: valuation.suggestedAskingRentLongLet ? valuation.suggestedAskingRentLongLet : '',
        suggestedAskingRentLongLetMonthly: valuation.suggestedAskingRentLongLetMonthly ? valuation.suggestedAskingRentLongLetMonthly : '',
        suggestedAskingRentShortLet: valuation.suggestedAskingRentShortLet ? valuation.suggestedAskingRentShortLet : '',
        suggestedAskingRentShortLetMonthly: valuation.suggestedAskingRentShortLetMonthly ? valuation.suggestedAskingRentShortLetMonthly : ''
      });
    }
    console.log('valuation form', this.valuationForm.value);
  }

  displayValuationPropInfo(info: ValuationPropertyInfo) {
    if (info) {
      this.valuationForm.patchValue({
        bedrooms: info.bedrooms || 0,
        bathrooms: info.bathrooms || 0,
        receptions: info.receptions || 0,
        tenureId: info.tenureId || 0,
        approxLeaseExpiryDate: this.changeLeaseExpiryDateToYears(info.approxLeaseExpiryDate),
        sqFt: info.sqFt || 'Not Known',
        outsideSpace: info.outsideSpace,
        parking: info.parking,
        propertyFeature: info.propertyFeature,
      });
    }
  }

  populateInstructionForm(instruction: Instruction) {
    if (instruction) {
      this.instructionForm.patchValue({
        agencyType: instruction.agencyType,
        askingPrice: instruction.askingPrice ? instruction.askingPrice : '',
        askingRentLongLet: instruction.askingRentLongLet ? instruction.askingRentLongLet : '',
        askingRentLongLetMonthly: instruction.askingRentLongLetMonthly ? instruction.askingRentLongLetMonthly : '',
        askingRentShortLet: instruction.askingRentShortLet ? instruction.askingRentShortLet : '',
        askingRentShortLetMonthly: instruction.askingRentShortLetMonthly ? instruction.askingRentShortLetMonthly : ''
      });
    }
  }

  onSelectType(originTypeId: number) {
    this.origins = this.allOrigins.filter((x: InfoDetail) => +x.parentId === +originTypeId);
    this.valuationForm.get('originId').setValue(0);
  }

  getOriginIdValue(id: number) {
    this.origin = 'Not Known';
    if (id) {
      this.allOrigins.forEach(x => {
        if (+x.id === id) {
          this.origin = x.value;
        }
      });
    }
  }
  getSelectedProperty(property: Property) {
    if (property) {
      this.valuers = [];
      this.property = property;
      this.isPropertyChanged = true;
      this.lastKnownOwner = property.lastKnownOwner;
      this.valuationForm.get('property').setValue(property);
      this.valuationForm.get('propertyOwner').setValue(this.lastKnownOwner);
      this.getValuers(property.propertyId);
      this.valuationService.getValuationPropertyInfo(property.propertyId).subscribe(res => { if (res) { this.displayValuationPropInfo(res); } });
      console.log('selected prop owner......', this.valuationForm.get('propertyOwner').value);
      console.log('property changed', this.isPropertyChanged);
    }
  }

  private getAddedProperty() {
    this.propertyService.newPropertyAdded$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newProperty => {
      if (newProperty) {
        this.property = newProperty;
        this.valuationForm.get('property').setValue(this.property);
        this.getSelectedOwner(newProperty.lastKnownOwner);
        console.log('newly created property', newProperty)
        console.log('property in form', this.valuationForm.get('property').value);
      }
    });
  }
  getSelectedOwner(owner: Signer) {
    if (owner) {
      this.lastKnownOwner = owner;
      this.isOwnerChanged = true;
      this.valuationForm.get('propertyOwner').setValue(owner);
      console.log('owner changed', this.valuationForm.get('propertyOwner').value);
    }
  }

  getSelectedDate(date: Date) {
    if (date) {
      console.log('selected date in val', date);
      this.selectedDate = date;
      this.valuationForm.get('valuationDate').setValue(date);
      this.showCalendar = false;
    }
  }

  onStaffMemberChange(staffMember: BaseStaffMember) {
    if (staffMember) {
      this.attendee = staffMember;
      console.log('selected', staffMember);
      console.log('attendess her....0', this.attendee);
    }

  }

  addAttendee() {
    const existingAttendee = this.attendees.find(x => x.staffMemberId === this.attendee.staffMemberId);
    if (this.attendee && !existingAttendee) {
      this.attendees.push(this.attendee);
      this.valuationForm.get('attendees').setValue(this.attendees);
      this.valuationForm.get('searchAttendeeId').setValue(null);
      if (!this.showOnlyMainStaffMember) {
        this.setMain(this.attendee);
      }
    }
  }

  setMain(staffMember: BaseStaffMember) {
    if (staffMember) {
      this.selectMainStaffMember(staffMember);
      this.removeAttendee(staffMember.staffMemberId);
    }
  }

  removeAttendee(id: number) {
    if (this.attendees && this.attendees.length) {
      const index = this.attendees.findIndex(x => x.staffMemberId === +id);
      this.attendees.splice(index, 1);
    }
  }
  showValuersList() {
    this.showOnlyMainStaffMember = !this.showOnlyMainStaffMember;
    if (this.property) {
      const propId = this.property.propertyId;
      this.getValuers(propId);
    }
  }

  private getValuers(propId: number) {
    if (this.valuers && !this.valuers.length) {
      this.propertyService.getProperty(propId, false, false, true).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => this.valuers = data.valuers);
    }
  }

  onTenureChange(tenureId: number) {
    if (+tenureId === 3) {
      this.showLeaseExpiryDate = true;
    } else {
      this.showLeaseExpiryDate = false;
    }
  }

  changeDate() {
    if (this.mainStaffMember) {
      this.staffMemberId = this.mainStaffMember.staffMemberId;
      console.log('staff member id', this.staffMemberId);
    }
    this.showCalendar = true;
  }

  createNewSigner() {

  }

  startInstruction() {
    let val: Valuation;
    val = { ...this.valuation, ...this.valuationForm.value };
    const instruction = {
      valuationEventId: val.valuationEventId,
      agencyType: '',
      askingPrice: val.suggestedAskingPrice,
      askingRentShortLet: val.suggestedAskingRentShortLet,
      askingRentLongLet: val.suggestedAskingRentLongLet,
      askingRentShortLetMonthly: val.suggestedAskingRentShortLetMonthly,
      askingRentLongLetMonthly: val.suggestedAskingRentLongLetMonthly
    } as Instruction;
    this.instruction = instruction;
    this.populateInstructionForm(instruction);
    console.log('instruction form here....', this.instructionForm.value);
  }

  setInstructionFormValidators() {
    this.setAskingPriceValidator();
    this.setShortLetRentValidator();
    this.setLongLetRentValidator();
  }

  private setLongLetRentValidator() {
    if (this.instructionForm.get('instructLongLet').value && this.instLongLetWeeklyControl.value === '') {
      this.instLongLetWeeklyControl.setValidators(Validators.required);
      this.instLongLetWeeklyControl.updateValueAndValidity();
    } else {
      this.instLongLetWeeklyControl.clearValidators();
      this.instLongLetWeeklyControl.updateValueAndValidity();
    }
  }

  private setShortLetRentValidator() {
    if (this.instructionForm.get('instructShortLet').value && this.instShortLetWeeklyControl.value === '') {
      this.instShortLetWeeklyControl.setValidators(Validators.required);
      this.instShortLetWeeklyControl.updateValueAndValidity();
    } else {
      this.instShortLetWeeklyControl.clearValidators();
      this.instShortLetWeeklyControl.updateValueAndValidity();
    }
  }

  private setAskingPriceValidator() {
    if (this.instructionForm.get('instructSale').value && this.instAskingPriceControl.value === '') {
      this.instAskingPriceControl.setValidators(Validators.required);
      this.instAskingPriceControl.updateValueAndValidity();
    } else {
      this.instAskingPriceControl.clearValidators();
      this.instAskingPriceControl.updateValueAndValidity();
    }
  }

  hasOriginTypeError() {
    const originTypeControl = this.valuationForm.get('originType');
    originTypeControl.markAsDirty();

    const hasError = originTypeControl.value === 0 && originTypeControl.dirty && originTypeControl.errors && originTypeControl.errors.required;
    if (hasError) {
      return true;
    } else {
      return false;
    }
  }

  saveInstruction() {
    this.setInstructionFormValidators();
    this.sharedService.logValidationErrors(this.instructionForm, true);
    const instructionSelected = this.instructionForm.get('instructSale').value || this.instructionForm.get('instructShortLet').value
      || this.instructionForm.get('instructLongLet').value;
    if (this.instructionForm.valid) {
      if (this.instructionForm.dirty) {
        this.isSubmitting = true;
        const instruction = { ...this.instruction, ...this.instructionForm.value };
        this.valuationService.addInstruction(instruction).subscribe((result: ResultData) => {
          this.onInstructionSaveComplete(result.status);
        });
        console.log('instruction form to save', this.instructionForm.value);
      } else {
        this.onInstructionSaveComplete();
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
      // this.sharedService.showError(this.errorMessage);
    }
  }

  saveValuation() {
    this.sharedService.logValidationErrors(this.valuationForm, true);
    if (this.valuationForm.valid) {
      if (this.valuationForm.dirty || this.isOwnerChanged || this.isPropertyChanged) {

        this.addOrUpdateValuation();
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
      this.sharedService.showError(this.errorMessage);
    }
  }

  addOrUpdateValuation() {
    this.setLeaseExpiryDate();
    this.isSubmitting = true;
    const valuation = { ...this.valuation, ...this.valuationForm.value };
    if (this.approxLeaseExpiryDate) {
      valuation.approxLeaseExpiryDate = this.approxLeaseExpiryDate;
    }
    if (this.valuationForm.get('sqFt').value === 'Not Known') {
      valuation.sqFt = 0;
    }

    if (this.isNewValuation) {
      this.valuationService.addValuation(valuation).subscribe(data => {
        if (data) { this.onSaveComplete(data); }
      },
        (error: WedgeError) => {
          this.errorMessage = error;
          this.sharedService.showError(this.errorMessage);
          this.isSubmitting = false;
        });
    } else {
      this.valuationService.updateValuation(valuation).subscribe(data => {
        if (data) { this.onSaveComplete(data); }
      },
        (error: WedgeError) => {
          this.errorMessage = error;
          this.sharedService.showError(this.errorMessage);
          this.isSubmitting = false;
        });
    }
  }

  private setLeaseExpiryDate() {
    if (this.valuationForm.get('approxLeaseExpiryDate').value) {
      const leaseExpiryDateInYears = +this.valuationForm.get('approxLeaseExpiryDate').value;
      this.approxLeaseExpiryDate = addYears(new Date(), leaseExpiryDateInYears);
    }

  }
  private changeLeaseExpiryDateToYears(approxLeaseExpiryDate: string | number | Date) {
    if (approxLeaseExpiryDate) {
      return differenceInCalendarYears(approxLeaseExpiryDate, new Date());
    }
  }

  onSaveComplete(valuation?: Valuation) {
    this.valuationForm.markAsPristine();
    this.isSubmitting = false;
    this.errorMessage = null;
    if (this.isNewValuation) {
      this.toastr.success('Valuation successfully saved');
      this.sharedService.resetUrl(this.valuationId, valuation.valuationEventId);
    } else {
      this.toastr.success('Valuation successfully updated');
    }

    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/valuations-register/detail', valuation.valuationEventId, 'edit']));
  }

  onInstructionSaveComplete(status?: boolean) {
    // const instructionEventId = instruction.salesInstructionEventId || instruction.lettingsInstructionEventId;
    this.instructionForm.markAsPristine();
    this.isSubmitting = false;
    this.errorMessage = null;
    if (status) {
      this.toastr.success('Instruction successfully saved');
      this.router.navigate(['/property-centre/detail', this.property.propertyId]);
    }
  }

  cancel() {
    this.sharedService.resetForm(this.valuationForm);
    this.sharedService.back();
  }

  cancelInstruction() {
    console.log('cancel inst', this.instructionForm.value);
    this.sharedService.resetForm(this.instructionForm);
  }

  canDeactivate(): boolean {
    if (this.valuationForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.property = {} as Property;
    this.propertyService.setAddedProperty(null);
  }
}
