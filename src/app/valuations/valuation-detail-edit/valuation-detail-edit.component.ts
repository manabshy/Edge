import { Component, OnInit } from '@angular/core';
import { Property, MinBedrooms } from 'src/app/property/shared/property';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ValuationService } from '../shared/valuation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Valuation } from '../shared/valuation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail, DropdownListInfo } from 'src/app/core/services/info.service';
import { PropertyService } from 'src/app/property/shared/property.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { ToastrService } from 'ngx-toastr';
import { FormErrors, ValidationMessages } from 'src/app/core/shared/app-constants';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-valuation-detail-edit',
  templateUrl: './valuation-detail-edit.component.html',
  styleUrls: ['./valuation-detail-edit.component.scss']
})
export class ValuationDetailEditComponent implements OnInit {
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
  allStaffMembers: StaffMember[];
  attendees: StaffMember[] = [];
  attendee: StaffMember;
  mainStaffMember: StaffMember;
  staffMemberId: number;
  isNewValuation: string;
  errorMessage: WedgeError;
  isSubmitting: boolean;
  formErrors = FormErrors;

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
    private toastr: ToastrService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.setupForm();
    this.valuationId = +this.route.snapshot.paramMap.get('id');
    this.isNewValuation = this.route.snapshot.queryParamMap.get('isNewValuation');
    if (this.valuationId) {
      this.getValuation(this.valuationId);
    }

    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      this.tenures = info.tenures;
      this.outsideSpaces = info.outsideSpaces;
      this.parkings = info.parkings;
      this.features = info.propertyFeatures;
    });

    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.allStaffMembers = data as StaffMember[];
      }
    });

    this.propertyService.newPropertyAdded$.subscribe(newProperty => {
      if (newProperty) {
        this.createdProperty = newProperty;
        console.log('should send to finder', this.createdProperty);
      }
    });

    this.contactGroupService.signer$.subscribe(data => {
      if (data) {
        // this.lastKnownOwner = data;
        this.createdSigner = data;
        this.isCreatingNewSigner = false;
      }
    });
    this.valuationForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => this.sharedService.logValidationErrors(this.valuationForm, false));
  }

  setupForm() {
    this.valuationForm = this.fb.group({
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
      features: [null],
      attendees: [null]
    });
  }

  selectMainStaffMember(staffMember: StaffMember) {
    this.mainStaffMember = staffMember;
    this.staffMemberId = staffMember.staffMemberId;
    this.showCalendar = true;
  }

  getValuation(id: number) {
    this.valuationService.getValuation(id).subscribe((data => {
      if (data) {
        this.valuation = data;
        this.populateForm(data);
      }
    }));
  }

  populateForm(valuation: Valuation) {
    console.log('data to populate', valuation);
    if (this.valuationForm) {
      this.valuationForm.reset();
    }
    if (valuation) {
      this.valuationForm.patchValue({
        reason: valuation.reason,
        timeFrame: valuation.timeFrame,
        marketChat: valuation.marketChat,
        generalNotes: valuation.generalNotes,
        bedrooms: valuation.bedrooms,
        bathrooms: valuation.bathrooms,
        receptions: valuation.receptions,
        tenureId: valuation.tenureId,
        sqFoot: valuation.sqFt,
        outsideSpace: valuation.outsideSpace,
        parking: valuation.parking,
        features: valuation.propertyFeature
      });
    }
    console.log('form values', this.valuationForm.value);
  }

  getSelectedProperty(property: Property) {
    if (property) {
      console.log('selected property', property);
    }
  }

  getSelectedOwner(owner: Signer) {
    if (owner) {
      this.lastKnownOwner = owner;
      console.log('selected owner', owner);
    }
  }

  getSelectedDate(date: Date) {
    if (date) {
      console.log('selected date in val', date);
      this.selectedDate = date;
      this.showCalendar = false;
    }
  }

  onStaffMemberChange(staffMember: StaffMember) {
    if (staffMember) {
      this.attendee = staffMember;
      console.log('selected', staffMember);
    }

  }

  addAttendee() {
    const existingAttendee = this.attendees.find(x => x.staffMemberId === this.attendee.staffMemberId);
    if (this.attendee && !existingAttendee) {
      this.attendees.push(this.attendee);
    }
  }

  setMain(staffMember: StaffMember) {
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

  onClear() {
    console.log('clear......');
  }

  changeDate() {
    this.showCalendar = true;
  }

  createNewSigner(event) {

  }

  saveValuation() {
    this.sharedService.logValidationErrors(this.valuationForm, true);

    if (this.valuationForm.valid) {
      if (this.valuationForm.dirty) {
        const valuation = { ...this.valuation, ...this.valuationForm.value };
        this.addOrUpdateValuation(valuation);
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
    }
  }

  addOrUpdateValuation(valuation: Valuation) {
    this.isSubmitting = true;
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

  onSaveComplete(valuation?: Valuation) {
    this.valuationForm.markAsPristine();
    this.isSubmitting = false;
    this.errorMessage = null;
    if (this.isNewValuation) {
      this.toastr.success('Valuation successfully saved');
    } else {
      this.toastr.success('Valuation successfully updated');
    }

    this.sharedService.resetUrl(this.valuationId, valuation.valuationEventId);
    this.router.navigate(['/valuations-register/detail', this.valuationId]);
  }

  cancel() {
    this.sharedService.back();
  }

  canDeactivate(): boolean {
    if (this.valuationForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }
}
