import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Property } from '../shared/property';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { Location } from '@angular/common';
import { Address } from '../../core/models/address';
import { SharedService, InfoDetail } from '../../core/services/shared.service';

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
  listInfo: any;
  propertyTypes: any;
  allPropertyStyles: any;
  propertyStyles: InfoDetail[];
  regions: InfoDetail[];
  allAreas: InfoDetail[];
  areas: InfoDetail[];
  allSubAreas: InfoDetail[];
  subAreas: InfoDetail[];

  constructor(private route: ActivatedRoute,
              private propertyService: PropertyService,
              private sharedService: SharedService,
              private fb: FormBuilder,
              private _location: Location) {}

  ngOnInit() {
    // this.listInfo = this.sharedService.dropdownListInfo;
    this.sharedService.getDropdownListInfo().subscribe(data => {
      this.listInfo = data;
      this.propertyTypes = this.listInfo.result.propertyTypes;
      this.allPropertyStyles = this.listInfo.result.propertyStyles;
      this.regions = this.listInfo.result.regions;
      this.allAreas = this.listInfo.result.areas;
      this.allSubAreas = this.listInfo.result.subAreas;
    });
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
      this.onSelectType(data.propertyTypeId);
      this.onSelectRegion(data.regionId);
      this.onSelectArea(data.areaId);
      this.propertyForm.patchValue({
        propertyTypeId: data.propertyTypeId,
        propertyStyleId: data.propertyStyleId,
        regionId: data.regionId,
        areaId: data.areaId,
        subAreaId: data.subAreaId,
      });
      console.log(this.propertyDetails);
    });
  }
  onSelectType(propertyTypeId){
    console.log('selected type id', propertyTypeId );
    console.log('selected styles', this.allPropertyStyles );
    this.propertyStyles = this.allPropertyStyles.filter((x:InfoDetail)=>x.parentId==propertyTypeId);
    console.log('selected styles', this.propertyStyles );
  }
  onSelectRegion(regionId) {
    this.areas = this.allAreas.filter((x:InfoDetail)=>x.parentId==regionId);
  }
  onSelectArea(areaId) {
    this.subAreas = this.allSubAreas.filter((x:InfoDetail)=>x.parentId==areaId);
  }
  setupEditForm() {
    this.propertyForm = this.fb.group({
      propertyTypeId: [''],
      propertyStyleId: [''],
      fullAddress: [''],
      regionId: 0,
      areaId: 0,
      subAreaId: 0,
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
