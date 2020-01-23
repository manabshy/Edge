import { Component, OnInit } from '@angular/core';
import { Property, MinBedrooms } from 'src/app/property/shared/property';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ValuationService } from '../shared/valuation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Valuation, ValuationStatusEnum } from '../shared/valuation';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail, DropdownListInfo } from 'src/app/core/services/info.service';
import { PropertyService } from 'src/app/property/shared/property.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { ToastrService } from 'ngx-toastr';
import { FormErrors, ValidationMessages } from 'src/app/core/shared/app-constants';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { BaseProperty } from 'src/app/shared/models/base-property';

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

  get isInvitationSent() {
    return this.valuationForm.get('isInvitationSent') as FormControl;
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
    this.valuationId = +this.route.snapshot.paramMap.get('id');
    this.propertyId = +this.route.snapshot.queryParamMap.get('propertyId');
    this.lastKnownOwnerId = +this.route.snapshot.queryParamMap.get('lastKnownOwnerId');
    this.isNewValuation = this.route.snapshot.queryParamMap.get('isNewValuation') as unknown as boolean;
    console.log('id', this.propertyId, 'ownerId', this.lastKnownOwnerId);
    if (this.valuationId) {
      this.getValuation(this.valuationId);
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
        this.setRent(data);
      });
  }

  // TODO: Not working properly, fix asap
  setRent(rent: any) {
    let value = 0;
    const shortLetWeeklyValue = +rent.suggestedAskingRentShortLet;
    const longLetWeeklyValue = +rent.suggestedAskingRentLongLet;
    const shortLetMonthlyValue = +rent.suggestedAskingRentShortLetMonthly;
    const longLetMonthlyValue = +rent.suggestedAskingRentLongLetMonthly;

    switch (true) {
      case !!shortLetWeeklyValue:
        value = shortLetWeeklyValue * 4;
        this.shortLetMonthlyControl.setValue(value);
        break;
      case !!longLetWeeklyValue:
        value = longLetWeeklyValue * 4;
        this.longLetMonthlyControl.setValue(value);
        break;
      case !!shortLetMonthlyValue:
        value = shortLetMonthlyValue / 4;
        this.shortLetWeeklyControl.setValue(value);
        break;
      case !!longLetMonthlyValue:
        value = longLetMonthlyValue / 4;
        this.longLetWeeklyControl.setValue(value);
        break;
    }
    //   if(shortLetWeeklyValue) {
    //     value = shortLetWeeklyValue * 4;
    //     this.shortLetMonthlyControl.setValue(value);
    //   }
    //   if(longLetWeeklyValue) {
    //     value = longLetWeeklyValue * 4;
    //      this.longLetMonthlyControl.setValue(value);
    //   }
    //   if(shortLetMonthlyValue) {
    //     value = shortLetMonthlyValue / 4;
    //       this.shortLetWeeklyControl.setValue(value);
    //   }
    //   if(longLetMonthlyValue) {
    //     value = longLetMonthlyValue / 4;
    //       this.longLetWeeklyControl.setValue(value);
    //   }
    // }
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
      sqFoot: [0],
      tenureId: [0],
      outsideSpace: [null],
      parking: [null],
      propertyFeature: [null],
      approxLeaseExpiryDate: [null],
      valuer: [''],
      isInvitationSent: false,
      totalHours: [0],
      attendees: [''],
      searchAttendeeId: null,
      valuationDate: [''],
      suggestedAskingPrice: [],
      suggestedAskingRentLongLet: [],
      suggestedAskingRentShortLet: [],
      suggestedAskingRentLongLetMonthly: [],
      suggestedAskingRentShortLetMonthly: [],

    });
  }

  selectMainStaffMember(staffMember: BaseStaffMember) {
    this.mainStaffMember = staffMember;
    this.staffMemberId = staffMember.staffMemberId;
    this.showCalendar = true;
    this.showOnlyMainStaffMember = true;
    // this.valuationForm.get('valuer').setValue(staffMember);
    // this.valuation.valuer = staffMember as unknown as BaseStaffMember;
  }

  getValuation(id: number) {
    this.valuationService.getValuation(id).subscribe((data => {
      if (data) {
        this.valuation = data;
        this.valuation.valuationStatus === 3 ? this.isEditable = false : this.isEditable = true;
        this.lastKnownOwner = this.valuation.propertyOwner;
        this.existingProperty = this.valuation.property;
        this.attendees = this.valuation.attendees;
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
        approxLeaseExpiryDate: valuation.approxLeaseExpiryDate,
        sqFoot: valuation.sqFt,
        outsideSpace: valuation.outsideSpace,
        parking: valuation.parking,
        propertyFeature: valuation.propertyFeature,
        valuer: valuation.valuer,
        totalHours: valuation.totalHours,
        suggestedAskingPrice: valuation.suggestedAskingPrice ? valuation.suggestedAskingPrice : '',
        suggestedAskingRentLongLet: valuation.suggestedAskingRentLongLet ? valuation.suggestedAskingRentLongLet : '',
        suggestedAskingRentLongLetMonthly: valuation.suggestedAskingRentLongLetMonthly ? valuation.suggestedAskingRentLongLetMonthly : '',
        suggestedAskingRentShortLet: valuation.suggestedAskingRentShortLet ? valuation.suggestedAskingRentShortLet : '',
        suggestedAskingRentShortLetMonthly: valuation.suggestedAskingRentShortLetMonthly ? valuation.suggestedAskingRentShortLetMonthly : ''
      });
    }
    console.log('form values', this.valuationForm.value);
    console.log('valuation values', valuation);
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
    console.log('clear  idd......', tenureId);
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
    }
  }

  addOrUpdateValuation() {
    const valuation = { ...this.valuation, ...this.valuationForm.value };
    const attendees = { ...this.valuation.diaryEvent.staffMembers, ...this.attendees } as BaseStaffMember[];
    console.log('valuation before', valuation);
    valuation.diaryEvent.staffMembers = attendees;
    console.log('attendees', attendees);
    console.log('valuation', valuation);
    this.isSubmitting = true;

    if (this.isNewValuation) {
      this.isInvitationSent.value ? valuation.valuationStatus = ValuationStatusEnum.Invited
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

  onSaveComplete(valuation?: Valuation) {
    this.valuationForm.markAsPristine();
    this.isSubmitting = false;
    this.errorMessage = null;
    if (this.isNewValuation) {
      this.toastr.success('Valuation successfully saved');
      this.sharedService.resetUrl(this.valuationId, valuation.valuationEventId);
      this.router.navigate(['/valuations-register/detail', this.valuationId]);
    } else {
      this.toastr.success('Valuation successfully updated');
    }

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
