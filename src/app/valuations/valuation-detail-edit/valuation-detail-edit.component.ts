import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import addYears from 'date-fns/add_years';
import differenceInCalendarYears from 'date-fns/difference_in_calendar_years';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, takeUntil } from 'rxjs/operators';
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
import { Valuation, ValuationStatusEnum } from '../shared/valuation';
import { ValuationService } from '../shared/valuation.service';
import { Instruction } from 'src/app/shared/models/instruction';
@Component({
  selector: 'app-valuation-detail-edit',
  templateUrl: './valuation-detail-edit.component.html',
  styleUrls: ['./valuation-detail-edit.component.scss']
})
export class ValuationDetailEditComponent extends BaseComponent implements OnInit {
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
  createdProperty: Property;
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
  existingProperty: BaseProperty;
  isOwnerChanged: boolean;
  isPropertyChanged: boolean;
  allAttendees: BaseStaffMember[];
  isEditable: boolean;
  showLeaseExpiryDate: boolean;
  propertyId: number;
  lastKnownOwnerId: number;
  approxLeaseExpiryDate: Date;
  instructionForm: FormGroup;
  instruction: Instruction;

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

  get rooms() {
    return MinBedrooms;
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
      this.propertyService.getProperty(this.propertyId, false, false, false).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        if (result) {
          this.lastKnownOwner = result.lastKnownOwner;
          this.existingProperty = result;
          const baseProperty = { propertyId: this.existingProperty.propertyId, address: this.existingProperty.address } as BaseProperty;
          this.valuationForm.get('property').setValue(baseProperty);
          console.log('base property', this.valuationForm.get('property').value);
        }
      });
    }

    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      this.tenures = info.tenures;
      this.outsideSpaces = info.outsideSpaces;
      this.parkings = info.parkings;
      this.features = info.propertyFeatures;
    });

    this.storage.get('allAttendees').subscribe(data => {
      if (data) {
        this.allAttendees = data as BaseStaffMember[];
      } else {
        this.staffMemberService.getValuationAttendees().pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => this.allAttendees = result);
      }
    });

    this.propertyService.newPropertyAdded$.subscribe(newProperty => {
      if (newProperty) {
        // this.valuation.property = newProperty;
        this.createdProperty = newProperty;
        this.valuationForm.get('property').setValue(newProperty);
        console.log('should send to finder', this.createdProperty);
      }
    });

    this.contactGroupService.signer$.subscribe(data => {
      if (data) {
        this.lastKnownOwner = data;
        this.createdSigner = data;
        this.isCreatingNewSigner = false;
      }
    });
    this.valuationForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe((data) => {
        this.sharedService.logValidationErrors(this.valuationForm, false);
        this.setRentFigures();
      });

  }

  setRentFigures() {

    if (this.shortLetWeeklyControl.value) {
      this.setShortMonthlyRent();
    }
    if (this.shortLetMonthlyControl.value) {
      this.setShortLetWeeklyRent()
    }
    if (this.longLetWeeklyControl.value) {
      this.setLongLetMonthlyRent();
    }
    if (this.longLetMonthlyControl.value) {
      this.setLongLetWeeklyRent();
      console.log('long let weekly', this.longLetWeeklyControl.value)
    }
    // switch (true) {
    //   case !!this.shortLetWeeklyControl.value:
    //     this.setShortMonthlyRent();
    //     console.log('short let monthly', this.shortLetMonthlyControl.value)
    //     break;
    //   case !!this.shortLetMonthlyControl.value:
    //     this.setShortLetWeeklyRent();
    //     break;
    //   case !!this.longLetWeeklyControl.value:
    //     this.setLongLetMonthlyRent();
    //     break;
    //   case !!this.longLetMonthlyControl.value:
    //     this.setLongLetWeeklyRent();
    //     console.log('long let weekly', this.longLetWeeklyControl.value)
    // }
  }
  private setShortLetWeeklyRent() {
    this.shortLetMonthlyControl.valueChanges
      .subscribe(shortLetMonthly => {
        this.shortLetWeeklyControl.setValue(+shortLetMonthly / 4, { emitEvent: false });
      });
  }
  private setLongLetWeeklyRent() {
    this.longLetMonthlyControl.valueChanges
      .subscribe(longLetMonthly => {
        this.longLetWeeklyControl.setValue(+longLetMonthly / 4, { emitEvent: false });
      });
  }

  private setLongLetMonthlyRent() {
    this.longLetWeeklyControl.valueChanges
      .subscribe(longLet => this.longLetMonthlyControl.setValue(+longLet * 4, { emitEvent: false }));
  }

  private setShortMonthlyRent() {
    this.shortLetWeeklyControl.valueChanges
      .subscribe(shortLet => this.shortLetMonthlyControl.setValue(+shortLet * 4, { emitEvent: false }));
  }

  setupForm() {
    this.valuationForm = this.fb.group({
      property: [''],
      propertyOwner: [''],
      reason: ['', Validators.required],
      timeFrame: ['', Validators.required],
      marketChat: ['', Validators.required],
      generalNotes: ['', Validators.required],
      bedrooms: [0],
      bathrooms: [0],
      receptions: [0],
      sqFt: [0],
      tenureId: [0],
      outsideSpace: [null],
      parking: [null],
      propertyFeature: [null],
      approxLeaseExpiryDate: [null],
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
      instructionType: [''],
      suggestedAskingPrice: [],
      suggestedAskingRentLongLet: [],
      suggestedAskingRentShortLet: [],
      suggestedAskingRentLongLetMonthly: [],
      suggestedAskingRentShortLetMonthly: []
    });
  }

  selectMainStaffMember(staffMember: BaseStaffMember) {
    this.mainStaffMember = staffMember;
    this.staffMemberId = staffMember.staffMemberId;
    this.showCalendar = true;
    this.showOnlyMainStaffMember = true;
    this.valuationForm.get('valuer').setValue(staffMember);
  }

  getValuation(id: number) {
    this.valuationService.getValuation(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((data => {
      if (data) {
        this.valuation = data;
        this.valuation.valuationStatus === 3 ? this.isEditable = false : this.isEditable = true;
        this.valuation.approxLeaseExpiryDate ? this.showLeaseExpiryDate = true : this.showLeaseExpiryDate = false;
        this.lastKnownOwner = this.valuation.propertyOwner;
        this.existingProperty = this.valuation.property;
        this.attendees = this.valuation.attendees ? this.valuation.attendees : [];
        this.valuation.valuer.fullName ? this.showOnlyMainStaffMember = true : this.showOnlyMainStaffMember = false;
        this.populateForm(data);
      }
    }));
  }

  populateForm(valuation: Valuation) {
    if (valuation) {
      this.valuationForm.patchValue({
        property: valuation.property,
        propertyOwner: valuation.propertyOwner,
        reason: valuation.reason,
        timeFrame: valuation.timeFrame,
        marketChat: valuation.marketChat,
        generalNotes: valuation.generalNotes,
        bedrooms: valuation.bedrooms,
        bathrooms: valuation.bathrooms,
        receptions: valuation.receptions,
        tenureId: valuation.tenureId,
        approxLeaseExpiryDate: this.changeLeaseExpiryDateToYears(valuation.approxLeaseExpiryDate),
        sqFt: valuation.sqFt,
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
  }

  populateInstructionForm(instruction: Instruction) {
    if (instruction) {
      this.instructionForm.patchValue({
        instructionType: instruction.instructionType,
        suggestedAskingPrice: instruction.suggestedAskingPrice ? instruction.suggestedAskingPrice : '',
        suggestedAskingRentLongLet: instruction.suggestedAskingRentLongLet ? instruction.suggestedAskingRentLongLet : '',
        suggestedAskingRentLongLetMonthly: instruction.suggestedAskingRentLongLetMonthly ? instruction.suggestedAskingRentLongLetMonthly : '',
        suggestedAskingRentShortLet: instruction.suggestedAskingRentShortLet ? instruction.suggestedAskingRentShortLet : '',
        suggestedAskingRentShortLetMonthly: instruction.suggestedAskingRentShortLetMonthly ? instruction.suggestedAskingRentShortLetMonthly : ''
      });
    }
  }

  getSelectedProperty(property: Property) {
    if (property) {
      // this.valuation.property = property;
      this.existingProperty = property;
      this.isPropertyChanged = true;
      this.valuationForm.get('property').setValue(property);
      console.log('property changed', this.isPropertyChanged);
    }
  }

  getSelectedOwner(owner: Signer) {
    if (owner) {
      this.lastKnownOwner = owner;
      this.isOwnerChanged = true;
      this.valuationForm.get('propertyOwner').setValue(owner);
      console.log('owner changed', this.isOwnerChanged);
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
  }
  onClear() {
    console.log('clear......');
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
    }
    this.showCalendar = true;
  }

  createNewSigner(event) {

  }

  startInstruction() {
    let val: Valuation;
    val = { ...this.valuation, ...this.valuationForm.value };
    const instruction = {
      instructionType: '',
      suggestedAskingPrice: val.suggestedAskingPrice,
      suggestedAskingRentShortLet: val.suggestedAskingRentShortLet,
      suggestedAskingRentLongLet: val.suggestedAskingRentLongLet,
      suggestedAskingRentShortLetMonthly: val.suggestedAskingRentShortLetMonthly,
      suggestedAskingRentLongLetMonthly: val.suggestedAskingRentLongLetMonthly
    } as Instruction;
    this.instruction = instruction;
    this.populateInstructionForm(instruction);
    console.log('instruction form here....', this.instructionForm.value);
  }

  saveInstruction() {
    console.log('save instruction here');
    this.sharedService.logValidationErrors(this.instructionForm, true);
    if (this.instructionForm.valid) {
      if (this.instructionForm.dirty) {
        // save instruction here....
      } else {
        // don't save
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
      this.sharedService.showError(this.errorMessage);
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
    this.approxLeaseExpiryDate ? valuation.approxLeaseExpiryDate = this.approxLeaseExpiryDate : this.valuation.approxLeaseExpiryDate = null;

    if (this.isNewValuation) {
      this.isInvitationSent.value ? valuation.valuationStatus = ValuationStatusEnum.Booked
        : valuation.valuationStatus = ValuationStatusEnum.None;
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
    return differenceInCalendarYears(approxLeaseExpiryDate, new Date());
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

  cancel() {
    this.sharedService.resetForm(this.valuationForm);
    this.sharedService.back();
  }

  canDeactivate(): boolean {
    if (this.valuationForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }
}
