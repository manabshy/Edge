import { Component, OnInit } from '@angular/core';
import { Property, MinBedrooms } from 'src/app/property/shared/property';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ValuationService } from '../shared/valuation.service';
import { ActivatedRoute } from '@angular/router';
import { Valuation } from '../shared/valuation';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail, DropdownListInfo } from 'src/app/core/services/info.service';
import { PropertyService } from 'src/app/property/shared/property.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { SharedService } from 'src/app/core/services/shared.service';

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

  get rooms() {
    return MinBedrooms;
  }

  staffMembers = [
    { id: 1, fullName: 'John Smith' },
    { id: 1, fullName: 'Bill Doe' }
  ];

  constructor(private valuationService: ValuationService,
    private propertyService: PropertyService,
    private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.setupForm();
    this.valuationId = +this.route.snapshot.paramMap.get('id');
    if (this.valuationId) {
      this.getValuation(this.valuationId);
    }

    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      this.tenures = info.tenures;
      this.outsideSpaces = info.outsideSpaces;
      this.parkings = info.parkings;
      this.features = info.propertyFeatures;
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

  }

  setupForm() {
    this.valuationForm = this.fb.group({
      reason: [''],
      period: [''],
      marketChat: [''],
      propertyNotes: [''],
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

  selectStaffMember(staffMember: any) {
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
        period: valuation.timeFrame,
        marketChat: valuation.marketChat,
        propertyNotes: valuation.generalNotes,
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
  createNewSigner(event) {

  }

  saveValuation() {

  }

  cancel() {
    this.sharedService.back();
  }
}
