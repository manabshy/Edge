import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Property } from '../shared/property';
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
import { ConfirmModalComponent } from 'src/app/core/confirm-modal/confirm-modal.component';

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
  isCreatingNewSigner: boolean;
  createdSigner: Signer;
  isMatchFound = false;
  showMatches = false;

  constructor(private route: ActivatedRoute,
    private _router: Router,
    private modalService: BsModalService,
    private propertyService: PropertyService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private contactGroupService: ContactGroupsService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _location: Location) { }

  ngOnInit() {
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data; this.setDropdownLists();
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
    });
    this.route.queryParams.subscribe(params => {
      this.isNewProperty = this.propertyId ? this.isNewProperty = false : params['isNewProperty'];
    });
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }
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
      this.onSelectType(+data.propertyTypeId);
      this.selectedStyles = this.propertyStyles;
      this.onSelectRegion(+data.regionId);
      this.selectedAreas = this.areas;
      this.onSelectArea(+data.areaId);
      this.selectedSubAreas = this.subAreas;
      this.logValidationErrors(this.propertyForm, false);
    });
  }

  setDropdownLists() {
    this.propertyTypes = this.listInfo.propertyTypes;
    this.allPropertyStyles = this.listInfo.propertyStyles;
    this.regions = this.listInfo.regions;
    this.allAreas = this.listInfo.areas;
    this.allSubAreas = this.listInfo.subAreas;
  }

  createNewSigner(event) {
    if (event) {
      this.storage.set('propertyBK', JSON.stringify(this.propertyForm.value)).subscribe();
      this.isCreatingNewSigner = true;
    }
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
      address: data.address
    });
    this.lastKnownOwner = data.lastKnownOwner;
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
      propertyStyleId: [''],
      regionId: 1,
      areaId: [''],
      subAreaId: [''],
      address: ['', Validators.required]
    });
  }


  getAddress(address: Address) {
    if (this.propertyAddress && JSON.stringify(this.propertyAddress) !== JSON.stringify(address)) {
      this.propertyForm.markAsDirty();
    } else {
      this.propertyForm.markAsPristine();
    }
    this.propertyAddress = address;
    this.isMatchFound = false;

    if (this.propertyAddress) {
      this.propertyForm.patchValue({ address: this.propertyAddress });
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
    if (property) {
      this.propertyForm.markAsPristine();
      this.propertyForm.clearValidators();
      this.propertyForm.updateValueAndValidity();
    }
    this._router.navigate(['/property-centre/detail', property.propertyId]);
  }

  checkPropertyMatches(isFullMatch: boolean) {
    if (isFullMatch) {
      this.isMatchFound = isFullMatch;
    } else {
      this.isMatchFound = false;
    }
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
    const control = this.propertyForm.get('address');
    this.logValidationErrors(this.propertyForm, true);
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
    const property = { ...this.propertyDetails, ...this.propertyForm.value };
    if (this.propertyDetails) {
      propertyAddress = { ...this.propertyDetails.address, ...this.propertyAddress };
      this.lastKnownOwner ? property.lastKnownOwner = this.lastKnownOwner : property.lastKnownOwner = this.propertyDetails.lastKnownOwner;
      property.address = propertyAddress;
    } else {
      property.lastKnownOwner = this.lastKnownOwner;
      property.address = this.propertyAddress;
    }

    if (this.isNewProperty) {
      if (this.isMatchFound) {
        this.showMatches = true;
        this.propertyService.displayDuplicates(this.showMatches);
      } else {
        this.isSubmitting = true;
        this.propertyService.addProperty(property).subscribe(res => {
          if (res) { this.onSaveComplete(res); }
        }, (error: WedgeError) => {
          this.errorMessage = error;
          this.sharedService.showError(this.errorMessage);
          this.isSubmitting = false;
        });
      }
    } else {
      if (!this.isMatchFound) {
        this.isSubmitting = true;
        this.propertyService.updateProperty(property).subscribe(res => this.onSaveComplete(res.result), (error: WedgeError) => {
          this.errorMessage = error;
          this.sharedService.showError(this.errorMessage);
          this.isSubmitting = false;
        });
      }
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
