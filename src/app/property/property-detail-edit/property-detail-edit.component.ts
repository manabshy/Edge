import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Property, PropertyStyle, PropertyType } from '../shared/property';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConstants, ValidationMessages, FormErrors } from 'src/app/core/shared/app-constants';
import { Location } from '@angular/common';
import { Address } from '../../core/models/address';
import { SharedService, InfoDetail, WedgeError } from '../../core/services/shared.service';
import { AppUtils } from 'src/app/core/shared/utils';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ToastrService } from 'ngx-toastr';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';

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
  isSubmitting: boolean;
  isNewProperty: boolean;
  listInfo: any;
  propertyTypes: any;
  allPropertyStyles: any;
  propertyStyles: InfoDetail[];
  regions: InfoDetail[];
  allAreas: InfoDetail[];
  areas: InfoDetail[];
  allSubAreas: InfoDetail[];
  subAreas: InfoDetail[];
  selectedStyles: InfoDetail[];
  selectedAreas: InfoDetail[];
  selectedSubAreas: InfoDetail[];
  lastKnownOwner: Signer;
  errorMessage: any;
  formErrors = FormErrors;
  isAddressFormValid: boolean;

  constructor(private route: ActivatedRoute,
              private _router: Router,
              private propertyService: PropertyService,
              private sharedService: SharedService,
              private contactGroupService: ContactGroupsService,
              private toastr: ToastrService,
              private fb: FormBuilder,
              private _location: Location) {}

  ngOnInit() {
    if (AppUtils.listInfo) {
      this.listInfo = AppUtils.listInfo;
      this.setDropdownLists();
    } else {
      this.sharedService.getDropdownListInfo().subscribe(data => {
        this.listInfo = data;
        this.setDropdownLists();
      });
    }
    this.setupEditForm();
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    this.route.queryParams.subscribe(params => {
      this.isNewProperty = this.propertyId ? this.isNewProperty = false : params['isNewProperty'];
    });
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }
    if (AppUtils.newSignerId) {
      this.getSignerDetails(AppUtils.newSignerId);
    }

    this.propertyForm.valueChanges.subscribe(data => {
      this.onSelectType(+data.propertyTypeId);
      this.selectedStyles = this.propertyStyles;
      this.onSelectRegion(+data.regionId);
      this.selectedAreas = this.areas;
      this.onSelectArea(+data.areaId);
      this.selectedSubAreas = this.subAreas;
      // this.logValidationErrors(this.propertyForm, false);
    });
  }

  setDropdownLists() {
    this.propertyTypes = this.listInfo.result.propertyTypes;
    this.allPropertyStyles = this.listInfo.result.propertyStyles;
    this.regions = this.listInfo.result.regions;
    this.allAreas = this.listInfo.result.areas;
    this.allSubAreas = this.listInfo.result.subAreas;
  }

 getSignerDetails(id: number) {
    this.contactGroupService.getSignerbyId(id).subscribe(data => {
      this.lastKnownOwner = data;
      this.propertyForm.markAsDirty();
    }, error => {
      this.errorMessage = <any>error;
      this.sharedService.showError(this.errorMessage);
    });
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId).subscribe(data => {
      this.propertyDetails = data;
      this.onSelectType(data.propertyTypeId);
      this.onSelectRegion(data.regionId);
      this.onSelectArea(data.areaId);
      this.displayPropertyDetails(data);
    });
  }
  private displayPropertyDetails(data: Property) {
    if (this.propertyForm) {
      this.propertyForm.reset();
    }
    this.propertyForm.patchValue({
      propertyTypeId: data.propertyTypeId,
      propertyStyleId: data.propertyStyleId,
      regionId: data.regionId,
      areaId: data.areaId,
      subAreaId: data.subAreaId,
    });
    this.lastKnownOwner = data.lastKnownOwner;
    this.propertyAddress = data.address;
  }

  onSelectType(propertyTypeId: number) {
    this.propertyStyles = this.allPropertyStyles.filter((x: InfoDetail) => +x.parentId === propertyTypeId);
  }
  onSelectRegion(regionId: number) {
    this.areas = this.allAreas.filter((x: InfoDetail) => +x.parentId === regionId);
  }
  onSelectArea(areaId: number) {
    this.subAreas = this.allSubAreas.filter((x: InfoDetail) => +x.parentId === areaId);
  }
  setupEditForm() {
    this.propertyForm = this.fb.group({
      propertyTypeId: ['', Validators.required],
      propertyStyleId: ['', Validators.required],
      regionId: ['', Validators.required],
      areaId: ['', Validators.required],
      subAreaId: ['', Validators.required],
      fullAddress: ['', Validators.required]
    });
  }


  getAddress(address: Address) {
    if (this.propertyAddress && JSON.stringify(this.propertyAddress) !== JSON.stringify(address)) {
      this.propertyForm.markAsDirty();
    } else {
      this.propertyForm.markAsPristine();
    }
    this.propertyAddress = address;

   if (this.propertyAddress) {
     this.propertyForm.patchValue({fullAddress: this.propertyAddress});
   }
  }

  getSelectedOwner(owner: Signer) {
    if (this.lastKnownOwner !== owner) {
      this.propertyForm.markAsDirty();
    } else {
      this.propertyForm.markAsPristine();
    }
    this.lastKnownOwner = owner;
  }

  getSelectedProperty(property: Property) {
    console.log('selected property', property);
    if (property) {
      this.propertyForm.markAsPristine();
      this.propertyForm.clearValidators();
    }
    this._router.navigate(['/property-centre/detail', property.propertyId]);
  }

  logValidationErrors(group: FormGroup = this.propertyForm, fakeTouched: boolean) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
       FormErrors[key] = '';
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
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
    this.sharedService.scrollToFirstInvalidField();
  }

  saveProperty() {
    const isOwnerChanged = this.lastKnownOwner || this.lastKnownOwner == null;
    const control = this.propertyForm.get('fullAddress');
    this.logValidationErrors(this.propertyForm, true);
    control.clearValidators();
    control.updateValueAndValidity();
    this.propertyAddress ? this.isAddressFormValid = true : this.isAddressFormValid = false;
    if (this.propertyForm.valid) {
      if (this.propertyForm.dirty || isOwnerChanged) {
        this.AddOrUpdateProperty();
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
    }
  }

  AddOrUpdateProperty() {
    let propertyAddress;
    const property = { ...this.propertyDetails, ...this.propertyForm.value };
    if (this.propertyDetails) {
      propertyAddress = { ...this.propertyDetails.address, ...this.propertyAddress };
      this.lastKnownOwner ? property.lastKnownOwner = this.lastKnownOwner :  property.lastKnownOwner = this.propertyDetails.lastKnownOwner;
      property.address = propertyAddress;
    } else {
      property.lastKnownOwner = this.lastKnownOwner;
     property.address = this.propertyAddress;
    }
    this.isSubmitting = true;
    if (this.isNewProperty) {
      this.propertyService.addProperty(property).subscribe(res => {
       if (res) { this.onSaveComplete(res); }
      }, (error: WedgeError) => {
        this.errorMessage = error;
        this.sharedService.showError(this.errorMessage);
        this.isSubmitting = false;
      });
    } else {
      this.propertyService.updateProperty(property).subscribe(res => this.onSaveComplete(res.result), (error: WedgeError) => {
        this.errorMessage = error;
        this.sharedService.showError(this.errorMessage);
        this.isSubmitting = false;
      });
    }
  }

  onSaveComplete(property?: any) {
    this.propertyForm.markAsPristine();
    this.isSubmitting = false;
    this.toastr.success('Property successfully saved');
    let url = this._router.url;
    let id = this.propertyId;

    if (url.indexOf('detail/' + id) === -1) {
      id = 0;
    }
    if (url.indexOf('?') >= 0) {
      url = url.substring(0, url.indexOf('?'));
      url = url.replace('detail/' + id, 'detail/' + property.propertyId);
      this._location.replaceState(url);
    }

    this.propertyId = property.propertyId;
    this.propertyService.currentPropertyChanged(+this.propertyId);
    this._router.navigate(['/property-centre/detail', this.propertyId]);
  }

  canDeactivate(): boolean {
    if (this.propertyForm.dirty  && !this.isSubmitting) {
      return false;
    }
    return true;
  }

  cancel() {
    this.sharedService.back();
  }

}
