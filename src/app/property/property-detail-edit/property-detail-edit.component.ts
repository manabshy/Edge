import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PropertyService } from '../shared/property.service'
import { Property, PropertyLocation, MapCentre } from '../shared/property'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ValidationMessages, FormErrors } from 'src/app/core/shared/app-constants'
import { Location } from '@angular/common'
import { Address } from '../../shared/models/address'
import { SharedService, WedgeError } from '../../core/services/shared.service'
import { Signer } from 'src/app/contact-groups/shared/contact-group'
import { ToastrService } from 'ngx-toastr'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { InfoDetail } from 'src/app/core/services/info.service'
import { StorageMap } from '@ngx-pwa/local-storage'
import { BsModalService } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs'
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component'
import { BaseComponent } from 'src/app/shared/models/base-component'
import { takeUntil } from 'rxjs/operators'
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-property-detail-edit',
  templateUrl: './property-detail-edit.component.html',
  styleUrls: ['./property-detail-edit.component.scss']
})
export class PropertyDetailEditComponent extends BaseComponent implements OnInit {
  propertyId: number
  propertyDetails: Property
  propertyForm: FormGroup
  propertyAddress: Address
  isSubmitting = false
  isNewProperty: boolean
  listInfo: any
  propertyTypes: any[]
  allPropertyStyles: any[]
  propertyStyles: InfoDetail[]
  regions: InfoDetail[]
  allAreas: InfoDetail[]
  areas: InfoDetail[]
  allSubAreas: InfoDetail[]
  subAreas: InfoDetail[]
  selectedStyles: InfoDetail[]
  selectedAreas: InfoDetail[]
  selectedSubAreas: InfoDetail[]
  lastKnownOwner: Signer
  errorMessage: any
  formErrors = FormErrors
  isAddressFormValid: boolean
  isCreatingNewSigner: boolean
  createdSigner: Signer
  isMatchFound = false
  showMatches = false
  isDuplicateCheckerVisible = false
  lastKnownPerson: any
  leadId: number
  personId: number
  // lastKnownPerson: any;
  defaultStyle: number
  defaultRegionId = 1
  searchedAddress: string
  getBack: number
  officeId: number
  propertyLocation: PropertyLocation
  isOfficeIdRequired = false
  checkPossibleDuplicates = false
  dialogRef: DynamicDialogRef
  isLastknownOwnerVisible = false
  isAddressRequired = false
  lastKnownOwnerModalHeader = 'Last known owner'
  backToOrigin = false
  isOwnerRemoved = false

  constructor(
    private route: ActivatedRoute,
    private _router: Router,
    private modalService: BsModalService,
    private propertyService: PropertyService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private contactGroupService: ContactGroupsService,
    private toastr: ToastrService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private _location: Location
  ) {
    super()
  }

  ngOnInit() {
    this.storage.get('info').subscribe((data) => {
      if (data) {
        this.listInfo = data
        this.setDropdownLists()
      }
    })

    this.storage.get('propertyBK').subscribe((data: string) => {
      if (data) {
        this.propertyDetails = <Property>JSON.parse(data)
        this.displayPropertyDetails(this.propertyDetails)
        this.storage.delete('propertyBK').subscribe()
      }
    })

    this.setupEditForm()
    this.route.params.subscribe((params) => {
      this.propertyId = +params['id'] || 0
      if (this.propertyId) {
        this.getPropertyDetails(this.propertyId)
      }
    })
    this.route.queryParams.subscribe((params) => {
      this.isNewProperty = this.propertyId ? (this.isNewProperty = false) : params['isNewProperty']
      this.searchedAddress = params['searchedAddress'] || ''
      this.leadId = +params['leadId'] || 0
      this.personId = +params['personId'] || 0
      this.getBack = +params['getBack'] || 0
      this.backToOrigin = params['backToOrigin'] || false
      this.lastKnownPerson = params['lastKnownPerson']
      console.log('back to orgin', this.backToOrigin)

      if (this.isNewProperty) {
        this.propertyForm.reset()
        this.setupEditForm()
      }
      if (this.lastKnownPerson) {
        // this.lastKnownPerson = JSON.parse(params['lastKnownPerson']);
        this.isLastknownOwnerVisible = true
        this.lastKnownOwnerModalHeader = 'Select last known owner from the list'
        console.log('here....')
      }
    })

    this.logValidationErrors(this.propertyForm, false)
    this.contactGroupService.signer$.subscribe((data) => {
      if (data) {
        this.lastKnownOwner = data
        this.createdSigner = data
        this.isCreatingNewSigner = false
        this.propertyForm.markAsDirty()
      }
    })

    this.propertyForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.propertyForm, false)
    })
  }

  setDropdownLists() {
    this.propertyTypes = this.listInfo.propertyTypes
    this.allPropertyStyles = this.listInfo.propertyStyles
    this.regions = this.listInfo.regions
    this.allAreas = this.listInfo.areas
    this.allSubAreas = this.listInfo.subAreas
    this.getAreas(this.defaultRegionId)
  }

  createNewSigner(event) {
    if (event) {
      this.storage.set('propertyBK', JSON.stringify(this.propertyForm.value)).subscribe()
      this.isCreatingNewSigner = true
    }
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId, false, false, false).subscribe((data) => {
      this.propertyDetails = data
      this.officeId = data.officeId
      this.onSelectType(data.propertyTypeId)
      this.onSelectRegion(data.regionId)
      this.onSelectArea(data.areaId)
      this.displayPropertyDetails(data)
    })
  }

  private displayPropertyDetails(property: Property) {
    if (this.propertyForm) {
      this.propertyForm.reset()
    }
    this.propertyForm.patchValue({
      officeId: property.officeId,
      propertyTypeId: property.propertyTypeId ? property.propertyTypeId : null,
      propertyStyleId: property.propertyStyleId,
      regionId: property.regionId || 1,
      areaId: property.areaId,
      subAreaId: property.subAreaId,
      address: property.address
    })
    this.lastKnownOwner = property.lastKnownOwner
    this.getAreas(property.regionId || 1)
  }

  onSelectType(propertyTypeId: number) {
    this.propertyStyles = this.allPropertyStyles?.filter((x: InfoDetail) => +x.parentId === +propertyTypeId)
    this.propertyForm.get('propertyStyleId').setValue(0)
  }

  onSelectRegion(regionId: number) {
    this.getAreas(+regionId)
    this.propertyForm.get('areaId').setValue(0)
    this.propertyForm.get('subAreaId').setValue(0)
  }

  onSelectArea(areaId: number) {
    this.subAreas = this.allSubAreas?.filter((x: InfoDetail) => +x.parentId === +areaId)
    this.propertyForm.get('subAreaId').setValue(0)
  }

  private getAreas(id: number) {
    if (this.allAreas && this.allAreas.length) {
      this.areas = this.allAreas.filter((x: InfoDetail) => +x.parentId === id)
    }
  }

  setupEditForm() {
    this.propertyForm = this.fb.group({
      propertyTypeId: [null, Validators.required],
      propertyStyleId: [0],
      officeId: [0],
      regionId: [1],
      areaId: [0],
      subAreaId: [0],
      address: ['', Validators.required]
    })
  }

  getSelectedOfficeId(id: number) {
    this.propertyForm.get('officeId').setValue(id)
    console.log({ id })

    id ? (this.isOfficeIdRequired = false) : (this.isOfficeIdRequired = true)
  }

  getAddress(address: Address) {
    if (this.propertyAddress && JSON.stringify(this.propertyAddress) !== JSON.stringify(address)) {
      this.propertyForm.markAsDirty()
    } else {
      this.propertyForm.markAsPristine()
    }
    this.propertyAddress = address
    this.propertyForm.get('address').setValue(address)

    this.isMatchFound = false
    this.propertyService
      .getPropertyOfficeId(address)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        if (result) {
          this.officeId = result.officeId
          this.propertyLocation = result
          this.propertyForm.get('officeId').setValue(result.officeId)
          this.isOfficeIdRequired = false
          console.log('officeId from db', this.officeId)
        }
      })

    if (this.propertyAddress) {
      this.isAddressRequired = false
      this.propertyForm.markAsDirty()
    }
  }

  getSelectedOwner(owner: Signer) {
    this.lastKnownOwner = owner
    this.propertyForm.markAsDirty()
    if (!this.propertyDetails) {
      this.propertyDetails = {} as Property
      this.propertyDetails.lastKnownOwner = owner
    } else {
      this.propertyDetails.lastKnownOwner = owner
    }
    this.isLastknownOwnerVisible = false
  }

  showLastKnowOwnerModal() {
    this.isLastknownOwnerVisible = true
    this.lastKnownOwnerModalHeader = 'Last known owner'
  }
  createNewLastKnownOwner() {
    this.isLastknownOwnerVisible = false
    this.propertyForm.markAsPristine()
  }

  removeLastKnownOwner() {
    this.showLastKnownRemovalWarning().subscribe((res) => {
      if (res) {
        this.propertyDetails.lastKnownOwner = null
        this.lastKnownOwner = null
        this.propertyForm.markAsDirty()
        this.isOwnerRemoved = true
      }
    })
  }
  setCheckDuplicatesFlag(value: boolean) {
    this.checkPossibleDuplicates = value
  }

  getSelectedProperty(property: Property) {
    if (property) {
      this.propertyForm.markAsPristine()
      this.propertyForm.clearValidators()
      this.propertyForm.updateValueAndValidity()
      this.isLastknownOwnerVisible = false
      this._router.navigate(['/property-centre/detail', property.propertyId])
      // if (this.lastKnownPerson) {
      // this.lastKnownOwner = property.lastKnownOwner;
      //   this._router.navigate(['/property-centre/detail', property.propertyId, 'edit'],
      //     { queryParams: { leadId: this.leadId, personId: this.personId, lastKnownPerson: JSON.stringify(this.lastKnownPerson) } });
      // } else {
      //   this._router.navigate(['/property-centre/detail', property.propertyId]);
      // }
    }
  }

  checkPropertyMatches(isFullMatch: boolean) {
    if (isFullMatch) {
      this.isMatchFound = isFullMatch
    } else {
      this.isMatchFound = false
    }
  }

  logValidationErrors(group: FormGroup = this.propertyForm, fakeTouched: boolean, scrollToError = false) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key)
      const messages = ValidationMessages[key]
      if (control.valid) {
        FormErrors[key] = ''
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        FormErrors[key] = ''
        console.log('errors in prop edit', control.errors)
        for (const errorKey in control.errors) {
          if (errorKey) {
            FormErrors[key] += messages[errorKey] + '\n'
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched)
      }
    })
    if (scrollToError) {
      this.sharedService.scrollToFirstInvalidField()
    }
  }

  saveProperty() {
    const isOwnerChanged = this.lastKnownOwner || this.lastKnownOwner == null
    this.setOfficeIdValidator()
    this.setAddressValidator()
    this.logValidationErrors(this.propertyForm, true, true)
    console.log(this.propertyForm)

    this.propertyAddress ? (this.isAddressFormValid = true) : (this.isAddressFormValid = false)
    if (this.propertyForm.valid) {
      if (this.propertyForm.dirty || isOwnerChanged) {
        if (!this.lastKnownOwner && !this.isOwnerRemoved) {
          this.showWarning().subscribe((res) => {
            if (res) {
              this.AddOrUpdateProperty()
            }
          })
        } else {
          this.AddOrUpdateProperty()
        }
      } else {
        this.onSaveComplete()
      }
    } else {
      this.errorMessage = {} as WedgeError
      this.errorMessage.displayMessage = 'Please correct validation errors'
    }
  }

  AddOrUpdateProperty() {
    let propertyAddress
    const property = { ...this.propertyDetails, ...this.propertyForm.value } as Property
    if (this.propertyDetails) {
      propertyAddress = { ...this.propertyDetails.address, ...this.propertyAddress }
      property.lastKnownOwner = this.lastKnownOwner
      property.address = propertyAddress
    } else {
      property.lastKnownOwner = this.lastKnownOwner
      property.address = this.propertyAddress
    }

    if (this.propertyLocation) {
      if (property.mapCentre === undefined) {
        property.mapCentre = {} as MapCentre
      }
      property.mapCentre.latitude = this.propertyLocation.latitude
      property.mapCentre.longitude = this.propertyLocation.longitude
    }

    if (this.isNewProperty) {
      if (this.isMatchFound) {
        console.log('property to be added when full match is found', property)
        this.showMatches = true // To be removed
        this.checkPossibleDuplicates = true
        this.isDuplicateCheckerVisible = true
        this.propertyService.displayDuplicates(this.showMatches)
      } else {
        this.isSubmitting = true
        this.propertyService.addProperty(property).subscribe(
          (res) => {
            if (res) {
              this.onSaveComplete(res)
            }
          },
          (error: WedgeError) => {
            this.isSubmitting = false
          }
        )
      }
    } else {
      if (!this.isMatchFound) {
        this.isSubmitting = true
        this.propertyService.updateProperty(property).subscribe(
          (res) => this.onSaveComplete(res.result),
          (error: WedgeError) => {
            this.isSubmitting = false
          }
        )
      }
    }
  }

  setAddressValidator() {
    const addressControl = this.propertyForm.get('address')
    if (!addressControl.value) {
      this.isAddressRequired = true
      addressControl.setValidators(Validators.required)
      addressControl.updateValueAndValidity()
    }
  }
  setOfficeIdValidator() {
    const officeIdControl = this.propertyForm.get('officeId')
    if (!officeIdControl.value) {
      this.isOfficeIdRequired = true
      officeIdControl.setValidators([Validators.min(1), Validators.required])
      officeIdControl.updateValueAndValidity()
    }
  }

  onSaveComplete(property?: any) {
    this.propertyForm.markAsPristine()
    this.isSubmitting = false
    this.messageService.add({ severity: 'success', summary: 'Property successfully saved', closable: false })
    let url = this._router.url
    let id = this.propertyId

    if (url.indexOf('detail/' + id) === -1) {
      id = 0
    }
    if (url.indexOf('?') >= 0) {
      url = url.substring(0, url.indexOf('?'))
      url = url.replace('detail/' + id, 'detail/' + property.propertyId)
      this._location.replaceState(url)
    }

    this.propertyId = property.propertyId
    this.propertyService.currentPropertyChanged(+this.propertyId)
    if (this.getBack || this.backToOrigin) {
      this.propertyService.setAddedProperty(property)
      this._location.back()
    } else {
      this._router.navigate(['/property-centre/detail', this.propertyId])
    }
  }

  canDeactivate(): boolean {
    console.log(
      'new signer ',
      this.isCreatingNewSigner,
      'is submit',
      this.isSubmitting,
      'dirty form',
      this.propertyForm.dirty
    )

    if (this.propertyForm.dirty && !this.isSubmitting && !this.isCreatingNewSigner) {
      return false
    }
    return true
  }

  cancel() {
    this.sharedService.back()
  }

  showLastKnownRemovalWarning() {
    const subject = new Subject<boolean>()
    const data = {
      title: `<p><strong>Are you sure you want to remove ${this.propertyDetails?.lastKnownOwner?.contactNames} as the Last known owner?</strong></p>
              <p class="message message--warning">You should only clear this field when you are 100% sure they no longer own the property.This field is audited.</p>
             `,
      actions: ['No', 'Yes']
    }

    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      data,
      styleClass: 'dialog dialog--hasFooter',
      header: 'Owner Removal Warning'
    })

    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        subject.next(true)
        subject.complete()
      }
    })
    return subject.asObservable()
  }

  showWarning() {
    const subject = new Subject<boolean>()
    const data = {
      title: "It looks like you haven't set the property owner. Do you want to save anyway?",
      actions: ['No', 'Yes, save']
    }

    this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
      data,
      styleClass: 'dialog dialog--hasFooter',
      showHeader: false
    })
    this.dialogRef.onClose.subscribe((res) => {
      if (res) {
        subject.next(true)
        subject.complete()
      }
    })
    return subject.asObservable()
  }
}
