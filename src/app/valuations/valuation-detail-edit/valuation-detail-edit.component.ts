import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import addYears from 'date-fns/add_years';
import differenceInCalendarYears from 'date-fns/difference_in_calendar_years';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { ContactGroup, Signer } from 'src/app/contactgroups/shared/contact-group';
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
import { Valuation, ValuationStatusEnum, ValuationPropertyInfo, Valuer, OfficeMember, ValuersAvailabilityOption, CalendarAvailibility, ValuationStaffMembersCalanderEvents } from '../shared/valuation';
import { ValuationService } from '../shared/valuation.service';
import { Instruction } from 'src/app/shared/models/instruction';
import { ResultData } from 'src/app/shared/result-data';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { TabDirective } from 'ngx-bootstrap/tabs/ngx-bootstrap-tabs';
import format from 'date-fns/format';
import { Observable } from 'rxjs';

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
  valuers: Valuer[] = [];
  lettingsValuers: OfficeMember[] = [];
  salesValuers: OfficeMember[] = [];
  allValuers: Valuer;
  // valuers: BaseStaffMember[] = [];
  showDateAndDuration: boolean;
  hasDateWithValuer = false;
  activeOriginId: InfoDetail;
  showOriginId: boolean;
  allOriginTypes: InfoDetail[] = [];
  isSelectingDate = false;
  showInstruct: boolean;
  currentStaffMember: StaffMember;
  isClientService: boolean;
  activeOriginTypes: InfoDetail[] = [];
  isOriginUnknown = false;
  salesValuerLabel: string;
  lettingsValuerLabel: string;
  isSalesAndLettings: boolean;
  isSalesOnly: boolean;
  isLettingsOnly: boolean;
  isSales: boolean;
  isLettings: boolean;
  selectedValuerIdList = [];
  selectedValuerId: number;
  availabilityForm: FormGroup;
  availableDates: ValuationStaffMembersCalanderEvents;
  canBookAppointment = true;
  isAvailabilityRequired = false;
  canChangeDate: boolean;
  canSearchAvailability = false;
  contactGroup$: Observable<ContactGroup>;
  showPhotos = false;
  showMap = false;
  showProperty = false;
  isLastknownOwnerVisible = false;
  isInstructVisible = false;
  isAppointmentVisible = false;


  get originTypeControl() {
    return this.valuationForm.get('originType') as FormControl;
  }
  get valuationTypeControl() {
    return this.valuationForm.get('type') as FormControl;
  }
  get originIdControl() {
    return this.valuationForm.get('originId') as FormControl;
  }
  get salesValuerIdControl() {
    return this.valuationForm.get('salesValuerId') as FormControl;
  }
  get lettingsValuerIdControl() {
    return this.valuationForm.get('lettingsValuerId') as FormControl;
  }
  get salesValuerControl() {
    return this.valuationForm.get('salesValuer') as FormControl;
  }
  get lettingsValuerControl() {
    return this.valuationForm.get('lettingsValuer') as FormControl;
  }

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
      return this.valuation.valuationStatus !== ValuationStatusEnum.None;
    }
  }

  staffMembers = [
    { staffMemberId: 2484, fullName: 'Gabor Remenyi', emailAddress: 'gremenyi@dng.co.uk', hasReminder: null },
    { staffMemberId: 2127, fullName: 'Matt Easley', emailAddress: 'measley@dng.co.uk', hasReminder: null },
    { staffMemberId: 2606, fullName: 'Elia Fulchignoni', emailAddress: 'efulchignoni@dng.co.uk' },
    { staffMemberId: 2523, fullName: 'Alexander Agyapong', emailAddress: 'aagyapong@dng.co.uk' },
    { staffMemberId: 2537, fullName: 'Mansoor Malik', emailAddress: 'mmalik@dng.co.uk', hasReminder: null }
  ];

  activeState: boolean[] = [false, false, false, false];
  statuses = [
    { name: 'valuationNotes', value: 0 },
    { name: 'propertyInfo', value: 1 },
    { name: 'appointment', value: 2 },
    { name: 'values', value: 3 },
    { name: 'termsOfBusinessues', value: 4 },
    { name: 'antiMoneyLaundering', value: 5 },
    { name: 'landRegistery', value: 6 },
    { name: 'status', value: 7 },
    { name: 'instruct', value: 8 },
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
    this.storage.get('currentUser').subscribe((currentStaffMember: StaffMember) => {
      if (currentStaffMember) {
        // for testing purposes
        if (currentStaffMember.activeDepartments[0].departmentId === 90) {
          this.isClientService = true;
          this.setOriginTypeValidator();
          this.setOriginIdValidator();
        } else {
          this.isClientService = false;
          this.isOriginUnknown = true;
          this.originIdControl.setValue(1);
          this.origin = 'Not Known';
        }
      }
    });
    this.setupInstructionForm();
    this.valuationId = +this.route.snapshot.paramMap.get('id');
    this.propertyId = +this.route.snapshot.queryParamMap.get('propertyId');
    this.lastKnownOwnerId = +this.route.snapshot.queryParamMap.get('lastKnownOwnerId');
    this.isNewValuation = this.route.snapshot.queryParamMap.get('isNewValuation') as unknown as boolean;
    this.isNewValuation ? this.showProperty = true : this.showProperty = false;
    if (this.valuationId) {
      this.getValuation(this.valuationId);
    }

    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
      this.getValuationPropertyInfo(this.propertyId);
      this.getValuers(this.propertyId);
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

    this.getAddedProperty();

    this.contactGroupService.signer$.subscribe(data => {
      if (data) {
        this.lastKnownOwner = data;
        this.createdSigner = data;
        this.isCreatingNewSigner = false;
      }
    });

    this.valuationForm.valueChanges
      .subscribe((data) => {
        this.sharedService.logValidationErrors(this.valuationForm, false);
        this.setRentFigures();
        this.toggleValuerType();
        this.checkAvailabilityBooking();
      });

    this.instructionForm.valueChanges.pipe(debounceTime(100), distinctUntilChanged())
      .subscribe(() => {
        this.sharedService.logValidationErrors(this.instructionForm, false);
        this.setInstructionRentFigures();
      });

    // availability form
    this.availabilityForm = this.fb.group({
      fromDate: new Date(),
      staffMemberId1: 0,
      staffMemberId2: 0,
    });
  }
  setCanBookAppointmentFlag() {
    switch (true) {
      case !!(this.isSalesAndLettings && this.salesValuerControl.value && this.lettingsValuerControl.value):
        this.canBookAppointment = true;
        break;

      case !!(this.isSalesOnly && this.salesValuerControl.value):
        this.canBookAppointment = true;

        break;
      case !!(this.isLettingsOnly && this.lettingsValuerControl.value):
        this.canBookAppointment = true;

        break;
    }
  }

  toggleValuerType() {
    switch (this.valuationTypeControl.value) {
      case 'sales':
        this.isSalesOnly = true;
        this.isLettingsOnly = false;
        this.isSalesAndLettings = false;
        break;
      case 'lettings':
        this.isLettingsOnly = true;
        this.isSalesOnly = false;
        this.isSalesAndLettings = false;
        break;

      default:
        this.isSalesAndLettings = true;
        this.isLettingsOnly = false;
        this.isSalesOnly = false;
        break;
    }
  }

  private setupListInfo(info: DropdownListInfo) {
    this.tenures = info.tenures;
    this.outsideSpaces = info.outsideSpaces;
    this.parkings = info.parkings;
    this.features = info.propertyFeatures;
    this.allOrigins = info.origins;
    this.allOriginTypes = info.originTypes;
    this.setOriginTypes(info.originTypes); // TODO: Issue on refresh
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId, false, true, false, true).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.lastKnownOwner = result.lastKnownOwner;
        this.property = result;
        // this.valuers = result.valuers;
        this.getContactGroup(result?.lastKnownOwner?.contactGroupId);
        const baseProperty = { propertyId: this.property.propertyId, address: this.property.address } as BaseProperty;
        this.valuationForm.get('property').setValue(baseProperty);
        console.log('base property', this.valuationForm.get('property').value);
      }
    });
  }

  getContactGroup(contactGroupId: number) {
    this.contactGroup$ = this.contactGroupService.getContactGroupbyId(contactGroupId, true);
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
    if (val.suggestedAskingRentShortLet && !val.suggestedAskingRentShortLetMonthly) {
      this.shortLetMonthlyControl.setValue(this.calculateMonthlyRent(+val.suggestedAskingRentShortLet));
    }
    if (val.suggestedAskingRentLongLet && !val.suggestedAskingRentLongLetMonthly) {
      this.longLetMonthlyControl.setValue(this.calculateMonthlyRent(+val.suggestedAskingRentLongLet));
    }
    if (val.suggestedAskingRentShortLetMonthly && !val.suggestedAskingRentShortLet) {
      this.shortLetWeeklyControl.setValue(this.calculateWeeklyRent(+val.suggestedAskingRentShortLetMonthly));
    }
    if (val.suggestedAskingRentLongLetMonthly && !val.suggestedAskingRentLongLet) {
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

  calculateMonthlyRent(rent: number): string {
    let monthlyRent: string;
    if (rent > 0) {
      monthlyRent = (rent * (52 / 12)).toFixed(2);
    }
    return monthlyRent;
  }

  calculateWeeklyRent(rent: number): string {
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
      originType: [0],
      originId: [0],
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
      salesValuerId: [null],
      lettingsValuerId: [null],
      salesValuer: [''],
      lettingsValuer: [''],
      isInvitationSent: true,
      totalHours: [1],
      valuationDate: [''],
      suggestedAskingPrice: [],
      suggestedAskingRentLongLet: [],
      suggestedAskingRentShortLet: [],
      suggestedAskingRentLongLetMonthly: [],
      suggestedAskingRentShortLetMonthly: [],
      type: ['both']
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

  closeCalendar() {
    this.showCalendar = false;
  }

  private setValuersForSalesAndLettings() {
    this.salesValuers = this.allValuers.sales;
    this.lettingsValuers = this.allValuers.lettings;
  }

  getValuation(id: number) {
    this.valuationService.getValuation(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data => {
      if (data) {
        this.valuation = data;
        this.valuation.valuationStatus === 3 ? this.canInstruct = true : this.canInstruct = false;
        this.valuation.approxLeaseExpiryDate ? this.showLeaseExpiryDate = true : this.showLeaseExpiryDate = false;
        if (this.valuation.valuationStatus === 3 || this.valuation.valuationStatus === 4) {
          this.isEditable = false;
        } else { this.isEditable = true; }

        if (this.valuation.salesValuer || this.valuation.lettingsValuer) {
          if (this.isEditable) {
            if (this.valuation.valuationDate) {
              this.showDateAndDuration = true;
              this.canChangeDate = true;
            } else {
              this.showDateAndDuration = false;
            }
          }
        }

        if (this.property) {
          this.lastKnownOwner = this.property.lastKnownOwner;
          this.property = this.property;
        } else {
          this.lastKnownOwner = this.valuation.propertyOwner;
          // this.property = this.valuation.property; // Fix this with Gabor on the API
          this.getPropertyDetails(this.valuation.property.propertyId);
        }
        this.getContactGroup(this.lastKnownOwner?.contactGroupId); // get contact group for last know owner
        if (this.property?.propertyId) {
          this.getValuers(this.property.propertyId);
        }
        this.setValuationType(data);
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
        salesValuer: valuation.salesValuer,
        lettingsValuer: valuation.lettingsValuer,
        salesValuerId: valuation.salesValuer ? valuation.salesValuer.staffMemberId : 0,
        lettingsValuerId: valuation.lettingsValuer ? valuation.lettingsValuer.staffMemberId : 0,
        type: this.setInitialType(),
        valuationDate: valuation.valuationDate,
        totalHours: valuation.totalHours || 1,
        suggestedAskingPrice: valuation.suggestedAskingPrice ? valuation.suggestedAskingPrice : '',
        suggestedAskingRentLongLet: valuation.suggestedAskingRentLongLet ? valuation.suggestedAskingRentLongLet : '',
        suggestedAskingRentLongLetMonthly: valuation.suggestedAskingRentLongLetMonthly ? valuation.suggestedAskingRentLongLetMonthly : '',
        suggestedAskingRentShortLet: valuation.suggestedAskingRentShortLet ? valuation.suggestedAskingRentShortLet : '',
        suggestedAskingRentShortLetMonthly: valuation.suggestedAskingRentShortLetMonthly ? valuation.suggestedAskingRentShortLetMonthly : ''
      });
    }
  }

  setInitialType(): string {
    let type = 'both';
    if (this.valuation.salesValuer && !this.valuation.lettingsValuer) {
      type = 'sales';
    }
    if (this.valuation.lettingsValuer && !this.valuation.salesValuer) {
      type = 'lettings';
    }
    return type;
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

  setValuationType(val: Valuation) {
    switch (true) {
      case val.salesValuer && !val.lettingsValuer:
        this.isSalesOnly = true;
        this.isSalesAndLettings = false;
        this.isLettingsOnly = false;
        console.log('%csales type xxx', 'color:cyan', this.isSalesOnly);
        break;

      case val.lettingsValuer && !val.salesValuer:
        this.isLettingsOnly = true;
        this.isSalesOnly = false;
        this.isSalesAndLettings = false;
        console.log('%c lettings type xxx', 'color:purple', this.isLettingsOnly);
        break;

      default:
        this.isSalesAndLettings = true;
        this.isLettingsOnly = false;
        this.isSalesOnly = false;
        console.log('%csales and lettings type xxx', 'color:magenta', this.isSalesAndLettings);
    }
  }

  setOriginTypes(allOriginTypes: InfoDetail[]) {
    this.activeOriginTypes = allOriginTypes.filter((x: InfoDetail) => x.isActive);
    // this.isNewValuation ? this.originTypes = this.activeOriginTypes : this.originTypes = allOriginTypes;
  }

  onSelectType(originTypeId: number) {
    this.showOriginId = true;
    const allOrigins = this.allOrigins.filter((x: InfoDetail) => +x.parentId === +originTypeId);
    const activeOrigins = this.allOrigins.filter((x: InfoDetail) => +x.parentId === +originTypeId && x.isActive);
    // this.isNewValuation ? this.origins = activeOrigins : this.origins = allOrigins;
    this.origins = activeOrigins;
    this.valuationForm.get('originId').setValue(0);
  }

  setOriginIdValue(id: number) {
    if (id) {
      this.allOrigins.forEach(x => {
        if (+x.id === id && this.isClientService && !this.isEditable) {
          this.origin = x.value;
        }
      });
    }
  }

  setOriginTypeId(originId: number) {
    console.log('origin id', originId);
    console.log('all origin types', this.allOriginTypes);
    console.log('all origins', this.allOrigins);
    if (originId) {
      this.allOrigins.forEach(x => {
        if (+x.id === originId) {
          if (this.activeOriginTypes.find(t => +t.id === x.parentId)) {
            this.valuationForm.get('originType').setValue(x.parentId);
            this.onSelectType(x.parentId);
            this.valuationForm.get('originId').setValue(originId);
          } else {
            this.addInactiveOriginType(x);
          }
        }
      });
    }
  }

  private addInactiveOriginType(origin: InfoDetail) {
    const originType = this.allOriginTypes.find(t => +t.id === origin.parentId);
    const originId = this.allOrigins.find(o => +o.id === origin.id);
    if (originType) {
      this.activeOriginTypes.push(originType);
      this.valuationForm.get('originType').setValue(originType.id);
      this.onSelectType(origin.parentId);
      this.valuationForm.get('originId').setValue(origin.id);
      this.origins.push(originId);
    }
  }

  getSelectedProperty(property: Property) {
    if (property) {
      this.showProperty = false;

      this.valuers = [];
      this.property = property;
      this.isPropertyChanged = true;
      this.lastKnownOwner = property.lastKnownOwner;
      this.valuationForm.get('property').setValue(property);
      this.valuationForm.get('propertyOwner').setValue(this.lastKnownOwner);
      this.getValuers(property.propertyId);
      this.getValuationPropertyInfo(property.propertyId);
      this.valuationForm.markAsDirty();
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
        this.showProperty = false;
        this.valuationForm.get('property').setValue(this.property);
        this.getValuers(this.property.propertyId);
        // this.getContactGroup(newProperty.lastKnownOwner?.contactGroupId);
        this.getSelectedOwner(newProperty.lastKnownOwner);
      }
    });
  }

  getSelectedOwner(owner: Signer) {
    if (owner) {
      this.lastKnownOwner = owner;
      this.isOwnerChanged = true;
      this.isLastknownOwnerVisible = false;
      this.getContactGroup(this.lastKnownOwner?.contactGroupId);
      this.valuationForm.get('propertyOwner').setValue(owner);
      if (this.isEditable || this.isNewValuation) {
        this.valuationForm.markAsDirty();
      }
    }
  }

  onLettingsValuerChange(valuer: BaseStaffMember) {
    this.lettingsValuerControl.setValue(valuer);
  }

  onSalesValuerChange(valuer: BaseStaffMember) {
    this.salesValuerControl.setValue(valuer);
  }


  getAvailability() {
    this.availableDates = {} as any;
    this.canSearchAvailability = false;
    this.showCalendar = true;
    this.isAppointmentVisible = true;
    const isSalesOrLettings = (this.isLettingsOnly && this.lettingsValuerControl.value) || (this.isSalesOnly && this.salesValuerControl.value);
    if (isSalesOrLettings) {
      this.availabilityForm.patchValue({
        staffMemberId1: this.salesValuerControl.value.staffMemberId || this.lettingsValuerControl.value.staffMemberId
      });
      this.canSearchAvailability = true;
    } else if (this.isSalesAndLettings && this.salesValuerControl.value && this.lettingsValuerControl.value) {
      this.availabilityForm.patchValue({
        staffMemberId1: this.salesValuerControl.value.staffMemberId,
        staffMemberId2: this.lettingsValuerControl.value.staffMemberId,
      });
      this.canSearchAvailability = true;
    }

  }

  searchAvailabilty() {
    const availability = { ...this.availabilityForm.value };
    const request = {
      fromDate: format(availability.fromDate, 'YYYY-MM-DD'),
      staffMemberId1: availability.staffMemberId1,
      staffMemberId2: availability.staffMemberId2,
    } as ValuersAvailabilityOption;

    this.valuationService.getValuersAvailability(request).subscribe(res => {
      this.availableDates = res.valuationStaffMembersCalanderEvents;
    });
  }

  selectAvailableDate(date: Date) {
    if (date) {
      this.selectedDate = date;
      this.isAvailabilityRequired = false;
      // this.canBookAppointment = false;
      this.canChangeDate = true;
      if (this.valuation && !this.valuation.valuationDate) {
        this.valuation.valuationDate = date;
      }
      this.valuationForm.get('valuationDate').setValue(date);
      this.showCalendar = false;
      this.isAppointmentVisible = false;
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
      this.valuationService.getValuers(propId).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(data => {
          this.allValuers = data;
          this.setValuersForSalesAndLettings();
          this.addInactiveValuers();
        });
    }
  }

  // add inactive users for display purposes only.
  addInactiveValuers() {
    const val = this.valuation;
    if (this.allValuers && val) {
      if (val.salesValuer && this.allValuers.sales && this.allValuers.sales.length) {
        const index = this.allValuers.sales
          .flatMap(x => x.staffMembers).findIndex(s => s.staffMemberId === val.salesValuer?.staffMemberId);
        if (index < 0) {
          this.allValuers.sales[0].staffMembers.push(val.salesValuer);
          this.valuationForm.get('salesValuerId').setValue(val.salesValuer.staffMemberId);
          this.canBookAppointment = false;
          this.canChangeDate = false;
        }
      }

      if (val.lettingsValuer && this.allValuers.lettings && this.allValuers.lettings.length) {
        const allLettingsValuers = this.allValuers.lettings
          .flatMap(x => x.staffMembers);
        const index = allLettingsValuers
          .findIndex(s => s.staffMemberId === val.lettingsValuer?.staffMemberId);
        if (index < 0) {
          this.allValuers.lettings[0].staffMembers.push(val.lettingsValuer);
          this.valuationForm.get('lettingsValuerId').setValue(val.lettingsValuer.staffMemberId);
          this.canBookAppointment = false;
          this.canChangeDate = false;
        }

      }
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
  }

  changeDate() {
    if (this.valuation.salesValuer || this.valuation.lettingsValuer) {
      this.availabilityForm.patchValue({
        staffMemberId1: this.valuationForm.get('salesValuerId').value,
        staffMemberId2: this.valuationForm.get('lettingsValuerId').value,
      });
    }
    this.showCalendar = true;

  }

  createNewSigner() {
    this.valuationForm.markAsPristine();
  }
  createNewProperty(isNewProperty: boolean) {
    this.valuationForm.markAsPristine();
  }

  showPhotosModal() {
    this.showPhotos = true;
  }

  showMapModal() {
    this.showMap = true;
  }

  hidePhotosModal() {
    this.showPhotos = false;
  }
  changeProperty() {
    this.showProperty = true;
  }

  showPropertyModal() {
    this.showProperty = true;
  }


  toggleAccordion(index: number) {
    this.activeState[index] = !this.activeState[index];
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
    this.setRentValidators();
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
  }

  setValuersValidators() {
    this.setSalesValuerValidator();
    this.setLettingsValuerValidator();
  }

  setLettingsValuerValidator() {
    if ((this.isLettingsOnly || this.isSalesAndLettings) && !this.lettingsValuerIdControl.value) {
      this.lettingsValuerIdControl.setValidators(Validators.required);
      this.lettingsValuerIdControl.updateValueAndValidity();
    } else {
      this.lettingsValuerIdControl.clearValidators();
      this.lettingsValuerIdControl.updateValueAndValidity();
    }
  }

  private setSalesValuerValidator() {
    if ((this.isSalesOnly || this.isSalesAndLettings) && !this.salesValuerIdControl.value) {
      this.salesValuerIdControl.setValidators(Validators.required);
      this.salesValuerIdControl.updateValueAndValidity();
    } else {
      this.salesValuerIdControl.clearValidators();
      this.salesValuerIdControl.updateValueAndValidity();
    }
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
    if (!this.instLongLetWeeklyControl.value && !this.instShortLetWeeklyControl.value) {
      this.instLongLetWeeklyControl.setValidators([Validators.required, Validators.min(1)]);
      this.instLongLetWeeklyControl.updateValueAndValidity();
    } else {
      this.instLongLetWeeklyControl.clearValidators();
      this.instLongLetWeeklyControl.updateValueAndValidity();
    }
  }

  private setShortLetRentValidator() {
    if (!this.instShortLetWeeklyControl.value && !this.longLetWeeklyControl.value) {
      this.instShortLetWeeklyControl.setValidators(Validators.required);
      this.instShortLetWeeklyControl.updateValueAndValidity();
    } else {
      this.instShortLetWeeklyControl.clearValidators();
      this.instShortLetWeeklyControl.updateValueAndValidity();
    }
  }

  setRentValidators() {
    if (this.instructionForm.get('instructLet').value) {
      switch (true) {
        case !this.instLongLetWeeklyControl.value:
          this.setLongLetRentValidator();
          break;
        case !this.shortLetWeeklyControl.value:
          this.setShortLetRentValidator();
          break;
      }
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
  }

  private setOriginTypeValidator() {
    if (this.originTypeControl) {
      this.originTypeControl.setValidators([Validators.required, Validators.min(1)]);
      this.originTypeControl.updateValueAndValidity();
    } else {
      this.originTypeControl.clearValidators();
      this.originTypeControl.updateValueAndValidity();
    }
  }

  private setOriginIdValidator() {
    if (this.originIdControl) {
      this.originIdControl.setValidators([Validators.required, Validators.min(1)]);
      this.originIdControl.updateValueAndValidity();
    } else {
      this.originIdControl.clearValidators();
      this.originIdControl.updateValueAndValidity();
    }
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
        },
          (error: WedgeError) => {
            this.isSubmitting = false;
          });
        console.log('instruction form to save', this.instructionForm.value);
      } else {
        this.onInstructionSaveComplete();
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';

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
    }
    if (isLet) {
      instruction.askingRentLongLet = +this.instLongLetWeeklyControl.value;
      instruction.askingRentLongLetMonthly = +this.instLongLetMonthlyControl.value;
      instruction.askingRentShortLet = +this.instShortLetWeeklyControl.value;
      instruction.askingRentShortLetMonthly = +this.instShortLetMonthlyControl.value;
    }
  }

  checkAvailabilityBooking() {
    if ((this.isNewValuation || this.isEditable) && !this.valuationForm.get('valuationDate').value) {
      // if (this.salesValuerIdControl.value || this.lettingsValuerIdControl.value) {
      //   this.isAvailabilityRequired = true;
      //   console.log('isAvailabilityRequired', this.isAvailabilityRequired)
      // }
      if (this.isSalesAndLettings && (this.salesValuerIdControl.valid && this.lettingsValuerIdControl.value)) {
        this.isAvailabilityRequired = true;
        this.isSalesOnly = false;
        this.isLettingsOnly = false;
        console.log('for both', this.isAvailabilityRequired);
      }
      if (this.isSalesOnly && this.salesValuerIdControl.value) {
        this.isAvailabilityRequired = true;
        this.isSalesAndLettings = false;
        console.log('for lettings only', this.isAvailabilityRequired);
      }
      if (this.isLettingsOnly && this.lettingsValuerIdControl.value) {
        this.isAvailabilityRequired = true;
        this.isSalesOnly = false;
        this.isSalesAndLettings = false;
        console.log('for sales only', this.isAvailabilityRequired);

      }
    }
  }

  saveValuation() {
    this.checkAvailabilityBooking();
    this.setValuersValidators();
    this.sharedService.logValidationErrors(this.valuationForm, true);
    if (this.valuationForm.valid && !this.isAvailabilityRequired) {
      if (this.valuationForm.dirty || this.isOwnerChanged || this.isPropertyChanged) {
        this.addOrUpdateValuation();
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
    }
  }

  addOrUpdateValuation() {
    this.setLeaseExpiryDate();
    this.isSubmitting = true;
    const valuation = { ...this.valuation, ...this.valuationForm.value };
    this.checkValuers(valuation);
    if (this.approxLeaseExpiryDate) {
      valuation.approxLeaseExpiryDate = this.approxLeaseExpiryDate;
    }
    if (this.valuationForm.get('sqFt').value === 'Not Known') {
      valuation.sqFt = 0;
    }

    if (this.isNewValuation) {
      console.log('%c val', 'color:green', valuation);
      this.valuationService.addValuation(valuation).subscribe(data => {
        if (data) { this.onSaveComplete(data); }
      },
        (error: WedgeError) => {
          this.errorMessage = error;
          this.isSubmitting = false;
        });
    } else {
      this.valuationService.updateValuation(valuation).subscribe(data => {
        if (data) { this.onSaveComplete(data); }
      },
        (error: WedgeError) => {
          this.errorMessage = error;
          this.isSubmitting = false;
        });
    }
  }
  checkValuers(valuation: any) {
    switch (valuation.type) {
      case 'lettings':
        valuation.salesValuer = null;
        break;
      case 'sales':
        valuation.lettingsValuer = null;
        break;
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

  duplicateValuation() {
    const propertyId = this.property.propertyId;
    const lastKnownOwnerId = this.lastKnownOwner.contactGroupId;
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['valuations-register/detail/', 0, 'edit'], {
        queryParams: {
          propertyId: propertyId,
          lastKnownOwnerId: lastKnownOwnerId,
          isNewValuation: true
        }
      })
      );
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
    this.sharedService.clearFormValidators(this.valuationForm, this.formErrors);
    this.storage.delete('valuationFormData').subscribe();
  }
}
