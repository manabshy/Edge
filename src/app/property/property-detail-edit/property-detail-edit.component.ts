import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Property } from '../shared/property';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { Location } from '@angular/common';
import { Address } from '../../core/models/address';

@Component({
  selector: 'app-property-detail-edit',
  templateUrl: './property-detail-edit.component.html',
  styleUrls: ['./property-detail-edit.component.scss']
})
export class PropertyDetailEditComponent implements OnInit {
  propertyId: number;
  propertyDetails: Property;
  propertyForm: FormGroup;
  propertyAddress: Address;
  isSubmitting: false;

  constructor(private route: ActivatedRoute,
              private propertyService: PropertyService,
              private fb: FormBuilder,
              private _location: Location) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    this.setupEditForm();
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId).subscribe(data => {
      this.propertyDetails = data;
      console.log(this.propertyDetails);
    });
  }

  setupEditForm() {
    this.propertyForm = this.fb.group({
      propertyTypeId: [''],
      propertyStyleId: [''],
      fullAddress: [''],
      address: this.fb.group({
        addressLines: ['', {validators: Validators.maxLength(500)}],
        countryId: 0,
        postCode: ['', {validators: [Validators.minLength(5), Validators.maxLength(8), Validators.pattern(AppConstants.postCodePattern)]}],
      })
    });
  }

  getAddress(address: Address) {
    if (this.propertyAddress && JSON.stringify(this.propertyAddress) != JSON.stringify(address)) {
      this.propertyForm.markAsDirty();
    } else {
      this.propertyForm.markAsPristine();
    }
    this.propertyAddress = address;
  }

  canDeactivate(): boolean {
    if (this.propertyForm.dirty  && !this.isSubmitting) {
      return false;
    }
    return true;
  }

  cancel() {
    this._location.back();
  }

}
