import { Component, NgZone, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { SharedService, WedgeError } from 'src/app/core/services/shared.service'
import { AppConstants, FormErrors, ValidationMessages } from 'src/app/core/shared/app-constants'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
import { Company, Signer } from 'src/app/contact-groups/shared/contact-group.interfaces'
import { CompanyService } from '../shared/company.service'
import { debounceTime } from 'rxjs/operators'
import { WedgeValidators } from 'src/app/shared/wedge-validators'
import { AppUtils } from 'src/app/core/shared/utils'
import { Address } from 'src/app/shared/models/address'
import { StorageMap } from '@ngx-pwa/local-storage'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html'
})
export class CompanyEditComponent implements OnInit {
  companyForm: FormGroup
  isSubmitting: boolean
  listInfo: any
  companyTypes: any
  address: Address
  companyId: number
  isNewCompany: boolean
  isEditingSelectedCompany: boolean
  companyName: string
  companyDetails: Company
  existingSigner: Signer
  signer: Signer
  errorMessage: WedgeError
  defaultCountryCode = 232
  todaysDate = new Date()
  formErrors = FormErrors
  info: any
  isCreatingNewSigner: boolean = false
  showCompanyFinder = false
  isManualEntry = false
  isSignerVisible = false
  backToOrigin = false
  addNewEntityToComplianceChecks: boolean = false

  constructor(
    private contactGroupService: ContactGroupsService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private storage: StorageMap,
    private _location: Location,
    private route: ActivatedRoute,
    private _router: Router,
    private messageService: MessageService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.init()
  }

  init() {
    this.storage.get('info').subscribe((data) => {
      if (data) {
        this.listInfo = data
        this.setDropdownLists()
        console.log('list info company edit....', this.listInfo)
      }
    })

    this.route.params.subscribe((params) => (this.companyId = this.companyId || +params['id'] || 0))
    this.route.queryParams.subscribe((params) => {
      console.log('subscribed to params: ', params)
      this.isNewCompany = this.companyId ? false : params['isNewCompany']
      this.isEditingSelectedCompany = params['isEditingSelectedCompany'] || false
      this.backToOrigin = params['backToOrigin'] || false
      this.companyName = params['companyName'] || null
      if (this.isNewCompany && !this.companyName) {
        this.showCompanyFinder = true
      }
      this.isManualEntry = params['isManualEntry'] === 'true'
      if (this.isManualEntry) this.showCompanyFinder = false
      this.addNewEntityToComplianceChecks = params['addNewEntityToComplianceChecks'] === 'true' ? true : false
    })
    this.setupCompanyForm(this.companyName)
    const id = this.isNewCompany ? 0 : this.companyId
    if (id) {
      this.getCompanyDetails(id)
    }

    this.getSignerDetails()
    this.companyForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => this.logValidationErrors(this.companyForm, false))
  }

  setDropdownLists() {
    if (this.listInfo) {
      this.companyTypes = this.listInfo.companyTypes
    }
  }

  getCompanyDetails(id: number) {
    this.contactGroupService.getCompany(id).subscribe((data) => {
      this.companyDetails = data
      if (!this.signer) {
        this.signer = data?.signer
      }
      this.sharedService.setTitle(this.companyDetails.companyName)
      this.displayCompanyDetails(data)
    })
  }

  createNewSigner() {
    this.isCreatingNewSigner = true
  }

  getSignerDetails(id?: number) {
    this.contactGroupService.signer$.subscribe((data) => {
      if (data) {
        this.signer = data
        this.isCreatingNewSigner = false
      }
    })
  }

  displayCompanyDetails(company: Company) {
    if (this.companyForm) {
      this.companyForm.reset()
    }
    this.companyDetails = company
    this.companyForm.patchValue({
      companyName: company.companyName,
      companyTypeId: company.companyTypeId,
      address: {
        postCode: company.companyAddress.postCode,
        countryId: company.companyAddress.countryId,
        country: company.companyAddress.country
      },
      telephone: company.telephone,
      fax: company.fax,
      website: company.website,
      email: company.email,
      amlCompletedDate: this.sharedService.ISOToDate(company.amlCompletedDate)
    })
    this.existingSigner = company.signer
  }

  populateNewCompanyDetails() {
    if (this.companyForm) {
      this.companyForm.reset()
    }
    this.companyForm.patchValue({
      companyTypeId: this.companyDetails.companyTypeId,
      signer: this.companyDetails.signer,
      address: {
        postCode: this.companyDetails.companyAddress.postCode,
        countryId: this.defaultCountryCode,
        country: this.companyDetails.companyAddress.country
      },
      telephone: this.companyDetails.telephone,
      fax: this.companyDetails.fax,
      website: this.companyDetails.website,
      email: this.companyDetails.email,
      amlCompletedDate: this.companyDetails.amlCompletedDate
    })
  }

  private setupCompanyForm(companyName: string) {
    this.companyForm = this.fb.group({
      companyName: [companyName || '', Validators.required],
      companyTypeId: 0,
      signer: [''],
      fullAddress: [''],
      address: this.fb.group({
        addressLines: ['', { validators: Validators.maxLength(500) }],
        countryId: 0,
        postCode: ['', { validators: [Validators.minLength(5), Validators.maxLength(8)] }]
      }),
      telephone: ['', { validators: WedgeValidators.phoneNumberValidator() }],
      fax: ['', { validators: WedgeValidators.phoneNumberValidator() }],
      email: ['', { validators: Validators.pattern(AppConstants.emailPattern) }],
      website: [''],
      amlCompletedDate: ['']
    })

    if (companyName) {
      this.companyDetails = {} as Company
      this.companyDetails.companyName = companyName
    }
  }

  logValidationErrors(group: FormGroup = this.companyForm, fakeTouched: boolean, scrollToError = false) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key)
      const messages = ValidationMessages[key]
      if (control.valid) {
        FormErrors[key] = ''
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        FormErrors[key] = ''
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

  getSelectedSigner(signer: Signer) {
    if (signer) {
      console.log({ signer })

      this.signer = signer
      this.isSignerVisible = false
      this.companyForm.markAsDirty()
    }
  }

  getAddress(address: Address) {
    if (this.address && JSON.stringify(this.address) !== JSON.stringify(address)) {
      this.companyForm.markAsDirty()
    } else {
      this.companyForm.markAsPristine()
    }
    this.address = address
  }

  // functions used by company-finder dialog
  getCompanyName(name: string) {
    this.companyForm.get('companyName').setValue(name)
    this.companyForm.markAsDirty()
  }

  setManualEntryFlag(ev) {
    this.showCompanyFinder = false
    this.isManualEntry = true
    this.getCompanyName(ev.companyName)
  }

  navigateToCompany(company: Company) {
    this.companyDetails = null
    let url = this._router.url
    if (url.indexOf('?') >= 0) {
      url = url.substring(0, url.indexOf('?'))
    }
    url = url.replace('detail/0', 'detail/' + this.companyId)
    url = url.replace('detail/' + this.companyId, 'detail/' + company.companyId)
    this._location.replaceState(url)
    this.companyId = company.companyId
    this.init()
    this.showCompanyFinder = false
  }

  saveCompany() {
    const isSignerChanged = this.signer || this.signer == null
    this.logValidationErrors(this.companyForm, true, true)
    if (this.companyForm.valid) {
      if (this.companyForm.dirty || isSignerChanged) {
        this.AddOrUpdateCompany()
      } else {
        this.onSaveComplete()
      }
    } else {
      this.errorMessage = {} as WedgeError
      this.errorMessage.displayMessage = 'Please correct validation errors'
    }
  }

  private AddOrUpdateCompany() {
    let companyAddress
    const company = { ...this.companyDetails, ...this.companyForm.value }
    if (this.companyDetails) {
      companyAddress = { ...this.companyDetails.companyAddress, ...this.address }
      company.signer = this.signer
      company.companyAddress = companyAddress
    } else {
      company.signer = this.signer
      company.companyAddress = this.address
    }
    this.isSubmitting = true
    if (this.isNewCompany) {
      console.log('adding new company', company)
      this.companyService.addCompany(company).subscribe(
        (res) => this.onSaveComplete(res.result),
        (error: WedgeError) => {
          this.isSubmitting = false
        }
      )
    } else {
      this.companyService.updateCompany(company).subscribe(
        (res) => this.onSaveComplete(res.result),
        (error: WedgeError) => {
          this.isSubmitting = false
        }
      )
    }
  }

  onSaveComplete(company?: Company) {
    this.companyForm.markAsPristine()
    this.isSubmitting = false
    this.messageService.add({ severity: 'success', summary: 'Company successfully saved', closable: false })
    if (this.backToOrigin) {
      const payload: any = { ...company }
      payload.addNewEntityToComplianceChecks = this.addNewEntityToComplianceChecks
      this.companyService.companyChanged(payload)
      this.sharedService.back()
      return
    }
    if (this.isEditingSelectedCompany && company) {
      AppUtils.holdingSelectedCompany = company
      console.log(AppUtils.holdingSelectedCompany)
      this.sharedService.back()
      return
    }
    console.log('navigating to new company detail page: ', company.companyId)
    this._router.navigate(['company-centre/detail', company.companyId])
    this._location.replaceState('company-centre/detail/' + company.companyId)
    window.location.reload()
  }

  canDeactivate(): boolean {
    if (this.companyForm.dirty && !this.isSubmitting && !this.isCreatingNewSigner) {
      return false
    }
    return true
  }

  cancel() {
    this.sharedService.back()
  }

  clearControlValue(control: AbstractControl) {
    this.sharedService.clearControlValue(control)
  }
}
