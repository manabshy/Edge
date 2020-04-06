import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Property, PropertyLocation, MapCentre } from '../shared/property';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessages, FormErrors } from 'src/app/core/shared/app-constants';
import { Location } from '@angular/common';
import { Address } from '../../shared/models/address';
import { SharedService, WedgeError } from '../../core/services/shared.service';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ToastrService } from 'ngx-toastr';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { InfoDetail } from 'src/app/core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-property-detail-edit',
  templateUrl: './property-detail-edit.component.html',
  styleUrls: ['./property-detail-edit.component.scss']
})
export class PropertyDetailEditComponent extends BaseComponent implements OnInit {
  propertyId: number;
  propertyDetails: Property;
  propertyForm: FormGroup;
  propertyAddress: Address;
  isSubmitting: boolean;
  isNewProperty: boolean;
  listInfo: any;
  propertyTypes: any[];
  allPropertyStyles: any[];
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
  isCreatingNewSigner: boolean;
  createdSigner: Signer;
  isMatchFound = false;
  showMatches = false;
  lastKnownPerson: any;
  leadId: number;
  personId: number;
  lastKnownPersonParam: any;
  defaultStyle: number;
  defaultRegionId = 1;
  searchedAddress: string;
  getBack: number;
  officeId: number;
  propertyLocation: PropertyLocation;
  isOfficeIdRequired: boolean;

  constructor(private route: ActivatedRoute,
    private _router: Router,
    private modalService: BsModalService,
    private propertyService: PropertyService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private contactGroupService: ContactGroupsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _location: Location) { super(); }

  ngOnInit() {
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.setDropdownLists();
      }
    });

    this.storage.get('propertyBK').subscribe((data: string) => {
      if (data) {
        this.propertyDetails = <Property>JSON.parse(data);
        this.displayPropertyDetails(this.propertyDetails);
        this.storage.delete('propertyBK').subscribe();
      }
    });

    this.setupEditForm();
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
      if (this.propertyId) {
        this.getPropertyDetails(this.propertyId);
      }
    });
    this.route.queryParams.subscribe(params => {
      this.isNewProperty = this.propertyId ? this.isNewProperty = false : params['isNewProperty'];
      this.searchedAddress = params['searchedAddress'] || '';
      this.leadId = +params['leadId'] || 0;
      this.personId = +params['personId'] || 0;
      this.getBack = +params['getBack'] || 0;
      this.lastKnownPersonParam = params['lastKnownPerson'];
      if (this.isNewProperty) {
        this.propertyForm.reset();
        this.setupEditForm();
      }
      if (this.lastKnownPersonParam) {
        this.lastKnownPerson = JSON.parse(params['lastKnownPerson']);
      }
    });

    this.logValidationErrors(this.propertyForm, false);
    this.contactGroupService.signer$.subscribe(data => {
      if (data) {
        this.lastKnownOwner = data;
        this.createdSigner = data;
        this.isCreatingNewSigner = false;
        this.propertyForm.markAsDirty();
      }
    });

    this.propertyForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.propertyForm, false);
    });
  }

  setDropdownLists() {
    this.propertyTypes = this.listInfo.propertyTypes;
    this.allPropertyStyles = this.listInfo.propertyStyles;
    this.regions = this.listInfo.regions;
    this.allAreas = this.listInfo.areas;
    this.allSubAreas = this.listInfo.subAreas;
    this.getAreas(this.defaultRegionId);
  }

  createNewSigner(event) {
    if (event) {
      this.storage.set('propertyBK', JSON.stringify(this.propertyForm.value)).subscribe();
      this.isCreatingNewSigner = true;
    }
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId, false, false, false).subscribe(data => {
      this.propertyDetails = data;
      this.officeId = data.officeId;
      this.onSelectType(data.propertyTypeId);
      this.onSelectRegion(data.regionId);
      this.onSelectArea(data.areaId);
      this.displayPropertyDetails(data);
    });
  }

  private displayPropertyDetails(property: Property) {
    if (this.propertyForm) {
      this.propertyForm.reset();
    }
    this.propertyForm.patchValue({
      officeId: property.officeId,
      propertyTypeId: property.propertyTypeId,
      propertyStyleId: property.propertyStyleId,
      regionId: property.regionId,
      areaId: property.areaId,
      subAreaId: property.subAreaId,
      address: property.address
    });
    this.lastKnownOwner = property.lastKnownOwner;
  }

  onSelectType(propertyTypeId: number) {
    this.propertyStyles = this.allPropertyStyles.filter((x: InfoDetail) => +x.parentId === +propertyTypeId);
    this.propertyForm.get('propertyStyleId').setValue(0);
  }

  onSelectRegion(regionId: number) {
    this.getAreas(+regionId);
    this.propertyForm.get('areaId').setValue(0);
    this.propertyForm.get('subAreaId').setValue(0);
  }

  onSelectArea(areaId: number) {
    this.subAreas = this.allSubAreas.filter((x: InfoDetail) => +x.parentId === +areaId);
    this.propertyForm.get('subAreaId').setValue(0);
  }

  private getAreas(id: number) {
    if (this.allAreas && this.allAreas.length) {
      this.areas = this.allAreas.filter((x: InfoDetail) => +x.parentId === id);
    }
  }

  setupEditForm() {
    this.propertyForm = this.fb.group({
      propertyTypeId: [0, Validators.required],
      propertyStyleId: [0],
      officeId: [0],
      regionId: 1,
      areaId: [0],
      subAreaId: [0],
      address: ['', Validators.required]
    });
  }

  getSelectedOfficeId(id: number) {
    this.propertyForm.get('officeId').setValue(id);
    id ? this.isOfficeIdRequired = false : this.isOfficeIdRequired = true;
  }

  getAddress(address: Address) {
    if (this.propertyAddress && JSON.stringify(this.propertyAddress) !== JSON.stringify(address)) {
      this.propertyForm.markAsDirty();
    } else {
      this.propertyForm.markAsPristine();
    }
    this.propertyAddress = address;
    this.isMatchFound = false;
    this.propertyService.getPropertyOfficeId(address).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.officeId = result.officeId;
          this.propertyLocation = result;
          this.propertyForm.get('officeId').setValue(result.officeId);
          console.log('officeId from db', this.officeId);
        }
      });
    if (this.propertyAddress) {
      this.propertyForm.patchValue({ address: this.propertyAddress });
    }
  }

  getSelectedOwner(owner: Signer) {
    this.lastKnownOwner = owner;
    this.propertyForm.markAsDirty();
  }

  getSelectedProperty(property: Property) {
    if (property) {
      this.propertyForm.markAsPristine();
      this.propertyForm.clearValidators();
      this.propertyForm.updateValueAndValidity();
    }
    if (this.lastKnownPerson) {
      this._router.navigate(['/property-centre/detail', property.propertyId, 'edit'],
        { queryParams: { leadId: this.leadId, personId: this.personId, lastKnownPerson: JSON.stringify(this.lastKnownPerson) } });
    } else {
      this._router.navigate(['/property-centre/detail', property.propertyId]);
    }
  }

  checkPropertyMatches(isFullMatch: boolean) {
    if (isFullMatch) {
      this.isMatchFound = isFullMatch;
    } else {
      this.isMatchFound = false;
    }
  }

  logValidationErrors(group: FormGroup = this.propertyForm, fakeTouched: boolean, scrollToError = false) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
        FormErrors[key] = '';
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        FormErrors[key] = '';
        console.log('errors in prop edit', control.errors)
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
    if (scrollToError) {
      this.sharedService.scrollToFirstInvalidField();
    }
  }

  saveProperty() {
    const isOwnerChanged = this.lastKnownOwner || this.lastKnownOwner == null;
    console.log(this.lastKnownOwner);
    const control = this.propertyForm.get('address');
    this.setOfficeIdValidator();
    this.logValidationErrors(this.propertyForm, true, true);
    control.clearValidators();
    control.updateValueAndValidity();
    this.propertyAddress ? this.isAddressFormValid = true : this.isAddressFormValid = false;
    if (this.propertyForm.valid) {
      if (this.propertyForm.dirty || isOwnerChanged) {
        if (!this.lastKnownOwner) {
          this.showWarning().subscribe(res => {
            if (res) {
              this.AddOrUpdateProperty();
            }
          });
        } else {
          this.AddOrUpdateProperty();
        }
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
    const property = { ...this.propertyDetails, ...this.propertyForm.value } as Property;
    if (this.propertyDetails) {
      propertyAddress = { ...this.propertyDetails.address, ...this.propertyAddress };
      property.lastKnownOwner = this.lastKnownOwner;
      property.address = propertyAddress;
    } else {
      property.lastKnownOwner = this.lastKnownOwner;
      property.address = this.propertyAddress;
    }

    if (this.propertyLocation) {
      if (property.mapCentre === undefined) {
        property.mapCentre = {} as MapCentre;
      }
      property.mapCentre.latitude = this.propertyLocation.latitude;
      property.mapCentre.longitude = this.propertyLocation.longitude;
    }

    console.log('property to be added', property)
    if (this.isNewProperty) {
      if (this.isMatchFound) {
        this.showMatches = true;
        this.propertyService.displayDuplicates(this.showMatches);
      } else {
        this.isSubmitting = true;
        this.propertyService.addProperty(property).subscribe(res => {
          if (res) { this.onSaveComplete(res); }
        }, (error: WedgeError) => {
          this.isSubmitting = false;
        });
      }
    } else {
      if (!this.isMatchFound) {
        this.isSubmitting = true;
        this.propertyService.updateProperty(property).subscribe(res => this.onSaveComplete(res.result), (error: WedgeError) => {
          this.isSubmitting = false;
        });
      }
    }
  }

  setOfficeIdValidator() {
    const officeIdControl = this.propertyForm.get('officeId');
    if (!officeIdControl.value) {
      this.isOfficeIdRequired = true;
      officeIdControl.setValidators([Validators.min(1), Validators.required]);
      officeIdControl.updateValueAndValidity();
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
    if (this.lastKnownPerson) {
      if (this.personId) {
        this._router.navigate(['/contact-centre/detail/', this.personId]);
      } else {
        if (this.leadId) {
          this._router.navigate(['/leads-register/edit/', this.leadId]);
        } else {
          this._router.navigate(['/leads-register/edit/', this.leadId],
            { queryParams: { isNewLead: true, personId: this.lastKnownPerson.personId } });
        }
      }
    } else {
      if (this.getBack) {
        this.propertyService.setAddedProperty(property);
        console.log('property in edit.........xxxxxxxxx', property);
        this._location.back();
      } else {
        this._router.navigate(['/property-centre/detail', this.propertyId]);
      }
    }
  }

  canDeactivate(): boolean {
    if (this.propertyForm.dirty && !this.isSubmitting && !this.isCreatingNewSigner) {
      return false;
    }
    return true;
  }

  cancel() {
    this.sharedService.back();
  }

  showWarning() {
    const subject = new Subject<boolean>();
    const initialState = {
      title: 'It looks like you haven\'t set the property owner. Do you want to save anyway?',
      actions: ['No', 'Yes, save']
    };
    const modal = this.modalService.show(ConfirmModalComponent, { ignoreBackdropClick: true, initialState });
    modal.content.subject = subject;
    return subject.asObservable();
  }
}
