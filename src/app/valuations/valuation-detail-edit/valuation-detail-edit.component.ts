import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import addYears from 'date-fns/add_years';
import differenceInCalendarYears from 'date-fns/difference_in_calendar_years';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { DropdownListInfo, InfoDetail, InfoService } from 'src/app/core/services/info.service';
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
  allStaffMembers: BaseStaffMember[] = [];
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
  allAttendees: BaseStaffMember[] = [];
  isEditable: boolean;
  showLeaseExpiryDate: boolean;
  canInstruct: boolean;
  propertyId: number;
  lastKnownOwnerId: number;
  approxLeaseExpiryDate: Date;
  instructionForm: FormGroup;
  instruction: Instruction;
  originTypes: InfoDetail[] = [];
  allOrigins: InfoDetail[] = [];
  origins: InfoDetail[] = [];
  origin: string;
  valuers: BaseStaffMember[] = [];
  showDateAndDuration: boolean;
  hasDateWithValuer = false;
  activeOriginId: InfoDetail;
  showOriginId: boolean;
  allOriginTypes: InfoDetail[] = [];
  isSelectingDate = false;
  showInstruct: boolean;

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
  get instructSaleControl() {
    return this.instructionForm.get('instructSale') as FormControl;
  }
  get instructLetControl() {
    return this.instructionForm.get('instructLet') as FormControl;
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
    private infoService: InfoService,
    private router: Router,
    private fb: FormBuilder) { super(); }

  ngOnInit() {
    this.setupForm();
    this.setupInstructionForm();
    this.valuationId = +this.route.snapshot.paramMap.get('id');
    this.propertyId = +this.route.snapshot.queryParamMap.get('propertyId');
    this.lastKnownOwnerId = +this.route.snapshot.queryParamMap.get('lastKnownOwnerId');
    this.isNewValuation = this.route.snapshot.queryParamMap.get('isNewValuation') as unknown as boolean;
    if (this.valuationId) {
      this.getValuation(this.valuationId);
    }

    if (this.propertyId) {
      this.getPropertyDetails();
      this.getValuationPropertyInfo(this.propertyId);
    }

    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      if (info) {
        this.setupListInfo(info);
      } else {
        this.infoService.getDropdownListInfo().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: ResultData | any) => {
          if (data) {
            this.setupListInfo(data.result);
            console.log(' list info in val edit from db', data.result);
          }
        });
      }
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
        // this.setInstructionFormValidators();
        this.setInstructionRentFigures();
      });

  }


  private setupListInfo(info: DropdownListInfo) {
    this.tenures = info.tenures;
    this.outsideSpaces = info.outsideSpaces;
    this.parkings = info.parkings;
    this.features = info.propertyFeatures;
    this.allOrigins = info.origins;
    this.setOriginTypes(info.originTypes); // TODO: Issue on refresh
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

  private calculateMonthlyRent(rent: number): string {
    let monthlyRent: string;
    if (rent > 0) {
      monthlyRent = (rent * (52 / 12)).toFixed(2);
    }
    return monthlyRent;
  }
  private calculateWeeklyRent(rent: number): string {
    let weeklyRent: string;
    if (rent > 0) {
      weeklyRent = (rent * (12 / 52)).toFixed(2);
    }
    return weeklyRent;
  }

  setupForm() {
    this.valuationForm = this.fb.group({
      property: [''],
      propertyOwner: [''],
      originType: [0, [Validators.required, Validators.min(1)]],
      originId: [0, [Validators.required, Validators.min(1)]],
      reason: ['', Validators.required],
      timeFrame: ['', Validators.required],
      generalNotes: ['', Validators.required],
      bedrooms: [0, Validators.max(99)],
      bathrooms: [0, Validators.max(99)],
      receptions: [0, Validators.max(99)],
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
      instructLet: [false],
      salesAgencyType: [''],
      lettingsAgencyType: [''],
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
    if (!this.selectedDate) {
      if (this.hasDateWithValuer) {
        this.valuation.attendees ? this.attendees = this.valuation.attendees : this.attendees = [];
      } else {
        this.mainStaffMember = null;
        this.staffMemberId = null;
        this.showOnlyMainStaffMember = false;
      }
    }
  }

  getValuation(id: number) {
    this.valuationService.getValuation(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data => {
      if (data) {
        this.valuation = data;
        this.valuation.valuationStatus === 3 ? this.canInstruct = true : this.canInstruct = false;
        this.valuation.approxLeaseExpiryDate ? this.showLeaseExpiryDate = true : this.showLeaseExpiryDate = false;
        this.attendees = this.valuation.attendees ? this.valuation.attendees : [];
        if (this.valuation.valuationStatus === 3 || this.valuation.valuationStatus === 4) {
          this.isEditable = false;
        } else { this.isEditable = true; }

        if (this.valuation.valuer) {
          this.mainStaffMember = this.valuation.valuer;
          if (this.isEditable) {
            if (this.valuation.valuationDate) {
              this.showDateAndDuration = true;
              this.hasDateWithValuer = true;
              this.showOnlyMainStaffMember = true;
            } else {
              this.showOnlyMainStaffMember = false;
              this.showDateAndDuration = false;
              this.hasDateWithValuer = false;
            }
          } else {
            this.showOnlyMainStaffMember = true;
          }
        }

        if (this.property) {
          this.lastKnownOwner = this.property.lastKnownOwner;
          this.property = this.property;
        } else {
          this.lastKnownOwner = this.valuation.propertyOwner;
          this.property = this.valuation.property;
        }

        this.getValuers(this.property.propertyId);
        this.populateForm(data);
        this.setupInitialRentFigures(data);
        if (this.valuation && this.allOrigins) {
          this.activeOriginId = this.allOrigins.find(x => x.id === +this.valuation.originId);
          (this.activeOriginId && !this.isEditable) ? this.showOriginId = true : this.showOriginId = false;
          this.setOriginIdValue(this.valuation.originId);
        }
        if (this.valuation && this.allOrigins && this.originTypes) {
          this.setOriginTypeId(this.valuation.originId);
        }
      }
    }));
  }

  populateForm(valuation: Valuation) {
    if (valuation) {
      this.valuationForm.patchValue({
        property: valuation.property,
        propertyOwner: valuation.propertyOwner,
        originId: !!this.activeOriginId ? valuation.originId : 0,
        reason: valuation.reason,
        timeFrame: valuation.timeFrame,
        generalNotes: valuation.generalNotes,
        bedrooms: valuation.bedrooms || 0,
        bathrooms: valuation.bathrooms || 0,
        receptions: valuation.receptions || 0,
        tenureId: valuation.tenureId || 0,
        approxLeaseExpiryDate: this.changeLeaseExpiryDateToYears(valuation.approxLeaseExpiryDate),
        sqFt: this.isEditable ? valuation.sqFt || 0 : valuation.sqFt || 'Not Known',
        outsideSpace: valuation.outsideSpace,
        parking: valuation.parking,
        propertyFeature: valuation.propertyFeature,
        valuer: valuation.valuer,
        attendees: valuation.attendees,
        valuationDate: valuation.valuationDate,
        totalHours: valuation.totalHours || 1,
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
        sqFt: info.sqFt || 0,
        outsideSpace: info.outsideSpace,
        parking: info.parking,
        propertyFeature: info.propertyFeature,
      });
    }
  }

  populateInstructionForm(instruction: Instruction) {
    if (instruction) {
      this.instructionForm.patchValue({
        salesAgencyType: instruction.salesAgencyType,
        lettingsAgencyType: instruction.lettingsAgencyType,
        askingPrice: instruction.askingPrice ? instruction.askingPrice : '',
        askingRentLongLet: instruction.askingRentLongLet ? instruction.askingRentLongLet : '',
        askingRentLongLetMonthly: instruction.askingRentLongLetMonthly ? instruction.askingRentLongLetMonthly : '',
        askingRentShortLet: instruction.askingRentShortLet ? instruction.askingRentShortLet : '',
        askingRentShortLetMonthly: instruction.askingRentShortLetMonthly ? instruction.askingRentShortLetMonthly : ''
      });
    }
  }

  setOriginTypes(allOriginTypes: InfoDetail[]) {
    const activeOriginTypes = allOriginTypes.filter((x: InfoDetail) => x.isActive);
    this.isNewValuation ? this.originTypes = activeOriginTypes : this.originTypes = allOriginTypes;
  }

  onSelectType(originTypeId: number) {
    this.showOriginId = true;
    const allOrigins = this.allOrigins.filter((x: InfoDetail) => +x.parentId === +originTypeId);
    const activeOrigins = this.allOrigins.filter((x: InfoDetail) => +x.parentId === +originTypeId && x.isActive);
    this.isNewValuation ? this.origins = activeOrigins : this.origins = allOrigins;
    this.valuationForm.get('originId').setValue(0);
  }

  setOriginIdValue(id: number) {
    this.origin = 'Not Known';
    if (id) {
      this.allOrigins.forEach(x => {
        if (+x.id === id) {
          this.origin = x.value;
        }
      });
    }
  }

  setOriginTypeId(originId: number) {
    if (originId) {
      this.allOrigins.forEach(x => {
        if (+x.id === originId) {
          this.valuationForm.get('originType').setValue(x.parentId);
          this.onSelectType(x.parentId);
          this.valuationForm.get('originId').setValue(originId);
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
      this.valuationForm.markAsDirty();
      this.getValuers(property.propertyId);
      this.getValuationPropertyInfo(property.propertyId);
    }
  }

  private getValuationPropertyInfo(propertyId: number) {
    this.valuationService.getValuationPropertyInfo(propertyId).subscribe(res => {
      if (res) {
        if (+res.tenureId === 3 || res.approxLeaseExpiryDate) {
          this.showLeaseExpiryDate = true;
          this.setApproxLeaseLengthValidator();
        } else { this.showLeaseExpiryDate = false; }
        this.displayValuationPropInfo(res);
      }
    });
  }

  private getAddedProperty() {
    this.propertyService.newPropertyAdded$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newProperty => {
      if (newProperty) {
        this.property = newProperty;
        this.valuationForm.get('property').setValue(this.property);
        this.getSelectedOwner(newProperty.lastKnownOwner);
      }
    });
  }

  getSelectedOwner(owner: Signer) {
    if (owner) {
      this.lastKnownOwner = owner;
      this.isOwnerChanged = true;
      this.valuationForm.get('propertyOwner').setValue(owner);
      if (this.isEditable || this.isNewValuation) {
        this.valuationForm.markAsDirty();
      }
    }
  }

  getSelectedDate(date: Date) {
    if (date) {
      this.selectedDate = date;
      if (this.valuation && !this.valuation.valuationDate) {
        this.valuation.valuationDate = date;
      }
      this.valuationForm.get('valuationDate').setValue(date);
      console.log('selected date in val edit', date);
      this.showCalendar = false;
    }
  }

  onStaffMemberChange(staffMember: BaseStaffMember) {
    if (staffMember) {
      this.attendee = staffMember;
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
      this.isSelectingDate = true;
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
      this.setApproxLeaseLengthValidator();
    } else {
      this.showLeaseExpiryDate = false;
      if (this.approxLeaseExpiryDateControl.errors) {
        this.approxLeaseExpiryDateControl.clearValidators();
        this.approxLeaseExpiryDateControl.updateValueAndValidity();
      }
      console.log('%c approx lease cleared', 'color:cyan', this.approxLeaseExpiryDateControl)
    }
  }

  setApproxLeaseLengthValidator() {
    if (!this.approxLeaseExpiryDateControl.value) {
      this.approxLeaseExpiryDateControl.setValidators(Validators.required);
      this.approxLeaseExpiryDateControl.updateValueAndValidity();
    } else {
      this.approxLeaseExpiryDateControl.clearValidators();
      this.approxLeaseExpiryDateControl.updateValueAndValidity();
    }
    console.log('%c approx lease validator', 'color:green', this.approxLeaseExpiryDateControl)
  }

  changeDate() {
    if (this.mainStaffMember) { this.staffMemberId = this.mainStaffMember.staffMemberId; }
    this.showCalendar = true;
    this.isSelectingDate = true;
  }

  createNewSigner() {

  }

  startInstruction() {
    let val: Valuation;
    val = { ...this.valuation, ...this.valuationForm.value };
    const instruction = {
      valuationEventId: val.valuationEventId,
      salesAgencyType: '',
      lettingsAgencyType: '',
      askingPrice: val.suggestedAskingPrice,
      askingRentShortLet: val.suggestedAskingRentShortLet,
      askingRentLongLet: val.suggestedAskingRentLongLet,
      askingRentShortLetMonthly: val.suggestedAskingRentShortLetMonthly,
      askingRentLongLetMonthly: val.suggestedAskingRentLongLetMonthly
    } as Instruction;
    this.instruction = instruction;
    this.populateInstructionForm(instruction);
    this.setInstructionFlags(instruction);
    console.log('instruction form here....', this.instructionForm.value);
  }

  setInstructionFlags(instruction: Instruction) {
    if (instruction.askingPrice && !instruction.askingRentLongLet) {
      this.instructionForm.get('instructSale').setValue(true);
      this.showInstruct = false;
    } else if (!instruction.askingPrice && instruction.askingRentLongLet) {
      this.instructionForm.get('instructLet').setValue(true);
      this.showInstruct = false;
    } else { this.showInstruct = true; }
  }

  onInstructSalesChange(event) {
    console.log('sales change', event);
  }
  onInstructLettingsChange(event) {
    console.log('lettins change', event);
  }


  setInstructionFormValidators() {
    this.setAskingPriceValidator();
    this.setLongLetRentValidator();
    // this.setShortLetRentValidator();
  }

  setAgencyTypeValidator() {
    switch (true) {
      case this.instructSaleControl.value:
        this.setSalesAgencyTypeValidator();
        break;
      case this.instructLetControl.value:
        this.setLettingsAgencyTypeValidator();
        break;

      default:
        this.setSalesAgencyTypeValidator();
        this.setLettingsAgencyTypeValidator();
        break;
    }
    console.log('%chere for instruct form', 'color:purple', this.instructionForm);
  }

  private setAskingPriceValidator() {
    if (this.instructionForm.get('instructSale').value && !this.instAskingPriceControl.value) {
      this.instAskingPriceControl.setValidators([Validators.required, Validators.min(1)]);
      this.instAskingPriceControl.updateValueAndValidity();
    } else {
      this.instAskingPriceControl.clearValidators();
      this.instAskingPriceControl.updateValueAndValidity();
    }
  }

  private setLongLetRentValidator() {
    if (this.instructionForm.get('instructLet').value && !this.instLongLetWeeklyControl.value) {
      this.instLongLetWeeklyControl.setValidators([Validators.required, Validators.min(1)]);
      this.instLongLetWeeklyControl.updateValueAndValidity();
    } else {
      this.instLongLetWeeklyControl.clearValidators();
      this.instLongLetWeeklyControl.updateValueAndValidity();
    }
  }

  private setShortLetRentValidator() {
    if (this.instructionForm.get('instructLet').value && !this.instShortLetWeeklyControl.value && this.instLongLetWeeklyControl.value) {
      this.instShortLetWeeklyControl.setValidators(Validators.required);
      this.instShortLetWeeklyControl.updateValueAndValidity();
    } else {
      this.instShortLetWeeklyControl.clearValidators();
      this.instShortLetWeeklyControl.updateValueAndValidity();
    }
  }



  private setSalesAgencyTypeValidator() {
    const salesAgencyControl = this.instructionForm.get('salesAgencyType');

    if (this.instructSaleControl) {
      salesAgencyControl.setValidators(Validators.required);
      salesAgencyControl.updateValueAndValidity();
    } else {
      salesAgencyControl.clearValidators();
      salesAgencyControl.updateValueAndValidity();
    }
    console.log('%chere for sales type', 'color:green', salesAgencyControl.value);
  }

  private setLettingsAgencyTypeValidator() {
    const lettingsAgencyControl = this.instructionForm.get('lettingsAgencyType');

    if (this.instructLetControl) {
      lettingsAgencyControl.setValidators(Validators.required);
      lettingsAgencyControl.updateValueAndValidity();
    } else {
      lettingsAgencyControl.clearValidators();
      lettingsAgencyControl.updateValueAndValidity();
    }
    console.log('%chere for lettings type', 'color:blue', lettingsAgencyControl.value);
  }

  saveInstruction() {
    this.setAgencyTypeValidator();
    this.setInstructionFormValidators();
    this.sharedService.logValidationErrors(this.instructionForm, true);
    const instructionSelected = this.instructionForm.get('instructSale').value || this.instructionForm.get('instructLet').value;
    if (this.instructionForm.valid) {
      if (this.instructionForm.dirty && instructionSelected) {
        this.isSubmitting = true;
        const instruction = { ...this.instruction, ...this.instructionForm.value } as Instruction;
        this.setInstructionValue(instruction);
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
  setInstructionValue(instruction: Instruction) {
    const isSale = this.instructionForm.get('instructSale').value;
    const isLet = this.instructionForm.get('instructLet').value;
    instruction.askingPrice = 0;
    instruction.askingRentShortLet = 0;
    instruction.askingRentLongLet = 0;
    instruction.askingRentShortLetMonthly = 0;
    instruction.askingRentLongLetMonthly = 0;

    if (isSale) {
      instruction.askingPrice = +this.instAskingPriceControl.value;
      // this.setSalesAgencyTypeValidator();
    }
    if (isLet) {
      instruction.askingRentLongLet = +this.instLongLetWeeklyControl.value;
      instruction.askingRentLongLetMonthly = +this.instLongLetMonthlyControl.value;
      instruction.askingRentShortLet = +this.instShortLetWeeklyControl.value;
      instruction.askingRentShortLetMonthly = +this.instShortLetMonthlyControl.value;
      // this.setLettingsAgencyTypeValidator();
      console.log('here for let', this.instructionForm.get('salesAgencyType'));
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
      // this.sharedService.showError(this.errorMessage);
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
      console.log('%c val', valuation);
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
    console.log('form state on cancel', this.valuationForm.valid);
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
    this.storage.delete('valuationFormData').subscribe();
  }
}
