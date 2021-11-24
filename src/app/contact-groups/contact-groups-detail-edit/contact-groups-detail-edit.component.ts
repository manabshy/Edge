import { Component, OnInit, Input, Output, OnDestroy } from '@angular/core'
import { SharedService, WedgeError } from 'src/app/core/services/shared.service'
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms'
import { ContactGroupsService } from '../shared/contact-groups.service'
import { Person, Email, PhoneNumber, BasicPerson } from 'src/app/shared/models/person'
import { ActivatedRoute } from '@angular/router'
import { EventEmitter } from '@angular/core'
import { debounceTime } from 'rxjs/operators'
import { AppConstants, FormErrors, ValidationMessages } from 'src/app/core/shared/app-constants'
import { AppUtils } from 'src/app/core/shared/utils'
import { WedgeValidators } from 'src/app/shared/wedge-validators'
import { Address } from 'src/app/shared/models/address'
import { StaffMember, Permission } from 'src/app/shared/models/staff-member'
import { AddressAutoCompleteData } from 'src/app/core/services/address.service'
import { InfoDetail, DropdownListInfo } from 'src/app/core/services/info.service'
import { StorageMap } from '@ngx-pwa/local-storage'
import { SubSink } from 'subsink'
import { MessageService } from 'primeng/api'

@Component({
  selector: 'app-contact-groups-detail-edit',
  templateUrl: './contact-groups-detail-edit.component.html'
})
export class ContactGroupsDetailEditComponent implements OnInit, OnDestroy {
  @Output() addedPersonDetails = new EventEmitter<any>()
  @Output() addedPersonId = new EventEmitter<number>()
  @Output() hideCanvas = new EventEmitter<boolean>()
  @Output() backToFinder = new EventEmitter<boolean>()
  // @Input() basicPerson: BasicPerson;
  @Input() isCompanyContactGroup = false
  basicPerson: BasicPerson
  prefToggleStatus = false
  countries: InfoDetail[] = []
  titles: Record<number, string>
  warnings: InfoDetail[] = []
  telephoneTypes: Record<number, string>
  listInfo: DropdownListInfo
  titleSelected = 1
  // defaultCountryCode = 232;
  telephoneTypeSelected = 1
  todaysDate = new Date()
  retrievedAddresses: AddressAutoCompleteData
  personDetails: Person
  personForm: FormGroup
  personId: number
  newPersonId: number
  id: number
  groupPersonId: number
  isNewContactGroup = false
  isOffCanvasVisible = false
  returnUrl: string
  errorMessage: WedgeError
  formArraryErrors: string
  isSubmitting = false
  isSubmittingAndAdd = false
  backToAddressesList = false
  enterAddressManually = false
  isEditingSelectedPerson = false
  searchTermBK = ''
  invalidPhoneType: boolean
  formErrors = FormErrors
  validationMessages = ValidationMessages
  foundAddress: AddressAutoCompleteData
  invalidFormArrayControls = {
    number: [],
    email: [],
    typeId: []
  }
  number: string
  currentStaffMember: StaffMember
  isWarningsEnabled = false
  warningStatus: number
  emailPhoneRequired: boolean = true
  private subs = new SubSink()
  addNewEntityToComplianceChecks: boolean = false

  // get showPostCode(): boolean {
  //   return this.address.get('countryId').value === this.defaultCountryCode;
  // }
  get addressLines(): FormControl {
    return <FormControl>this.address.get('addressLines')
  }
  get postCode(): FormControl {
    return <FormControl>this.address.get('postCode')
  }
  get countryId(): FormControl {
    return <FormControl>this.address.get('countryId')
  }
  get warningStatusIdControl(): FormControl {
    return <FormControl>this.personForm.get('warningStatusId')
  }
  get address(): FormGroup {
    return <FormGroup>this.personForm.get('address')
  }
  get emailAddresses(): FormArray {
    return <FormArray>this.personForm.get('emailAddresses')
  }
  get phoneNumbers(): FormArray {
    return <FormArray>this.personForm.get('phoneNumbers')
  }
  get currentPhoneNumber() {
    return this.number
  }
  get isWarningCommentVisible() {
    return +this.personForm.get('warningStatusId').value === 100
  }
  get isTitleOtherVisible() {
    return +this.personForm.get('titleId').value === 100
  }

  public keepOriginalOrder = (a) => a.key
  constructor(
    public sharedService: SharedService,
    private messageService: MessageService,
    private storage: StorageMap,
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.subs.sink = this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data
      }
      // console.log("current user info here....", data);
    })

    this.subs.sink = this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.listInfo = data
        this.setDropdownLists()
        // console.log("app info in contact edit ....", data);
      }
    })

    this.subs.sink = this.route.params.subscribe((params) => (this.personId = +params['personId'] || 0))
    this.subs.sink = this.route.queryParams.subscribe((params) => {
      this.groupPersonId = +params['groupPersonId'] || 0
      this.isEditingSelectedPerson = params['isEditingSelectedPerson'] || false
      const newPerson = params['newPerson']
      if (newPerson) {
        this.basicPerson = JSON.parse(newPerson) as BasicPerson
      }
      this.emailPhoneRequired = JSON.parse(params['emailPhoneRequired'])
      this.addNewEntityToComplianceChecks = params['addNewEntityToComplianceChecks'] === 'true' ? true : false
    })
    this.setupEditForm()
    const id = this.groupPersonId !== 0 ? this.groupPersonId : this.personId
    if (this.basicPerson !== undefined) {
      // console.log("basic person in edit form", this.basicPerson);
      this.populateNewPersonDetails()
    } else {
      this.getPersonDetails(id)
    }
    this.logValidationErrors(this.personForm, true)
    this.subs.sink = this.personForm.valueChanges.pipe(debounceTime(400)).subscribe((data) => {
      this.postCode.setValue(this.sharedService.formatPostCode(data.address.postCode), { emitEvent: false })
      this.logValidationErrors(this.personForm, false)
    })
    this.subs.sink = this.warningStatusIdControl.valueChanges.subscribe(() => this.togglePersonWarnings())
  }

  setDropdownLists() {
    this.countries = this.listInfo.countries
    this.titles = this.listInfo.titles
    this.warnings = this.listInfo.personWarningStatuses
    this.telephoneTypes = this.listInfo.telephoneTypes
  }

  togglePersonWarnings() {
    let setPermission: Permission
    let clearPermission: Permission
    let isEnabled = true
    if (this.currentStaffMember?.permissions?.length) {
      setPermission = this.currentStaffMember.permissions.find((x) => x.permissionId === 67)
      clearPermission = this.currentStaffMember.permissions.find((x) => x.permissionId === 68)
    }

    if (this.personDetails?.warningStatusId > 1) {
      isEnabled = !!clearPermission
    } else {
      isEnabled = !!setPermission
    }
    this.isWarningsEnabled = isEnabled
  }

  logValidationErrors(group: FormGroup = this.personForm, fakeTouched: boolean, scrollToError = false) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key)
      const messages = ValidationMessages[key]
      if (control.valid) {
        this.formErrors[key] = ''
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        this.formErrors[key] = ''
        for (const errorKey in control.errors) {
          if (errorKey) {
            // console.log(messages);
            this.formErrors[key] += messages[errorKey] + '\n'
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched)
      }

      if (control instanceof FormArray) {
        this.logValidationErrorsFormArray(control)
      }
    })
    if (scrollToError) {
      this.sharedService.scrollToFirstInvalidField()
    }
  }

  logValidationErrorsFormArray(control: AbstractControl) {
    this.formArraryErrors = ''
    control['controls'].forEach((x: AbstractControl, i) => {
      const fields = ['number', 'email']
      fields.forEach((label) => {
        const field = x.get(label)
        if (field) {
          const parent = field['parent']['controls']
          Object.keys(parent).forEach((name) => {
            if (field === parent[name]) {
              if (field.value && !field.valid) {
                if (!this.invalidFormArrayControls[name].includes(i)) {
                  this.invalidFormArrayControls[name].push(i)
                }
              } else {
                const index = this.invalidFormArrayControls[name].indexOf(i)
                if (index >= 0) {
                  this.invalidFormArrayControls[name].splice(index, 1)
                }
              }
            }
          })
        }
      })
    })
  }

  isValid(type, i) {
    return this.invalidFormArrayControls[type].includes(i)
  }

  cancel() {
    this.sharedService.back()
  }

  clearControlValue(control: AbstractControl) {
    this.sharedService.clearControlValue(control)
  }

  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe((data) => {
      this.personDetails = data
      this.warningStatus = this.personDetails.warningStatusId
      this.displayPersonDetails(data)
    })
  }

  populateNewPersonDetails() {
    const emailAddresses: Email[] = []
    const phoneNumbers: PhoneNumber[] = []

    this.personForm.patchValue({
      warningStatusId: 1,
      firstName: this.basicPerson.firstName,
      middleName: this.basicPerson.middleName,
      lastName: this.basicPerson.lastName,
      contactByEmail: true,
      contactByPhone: true,
      marketingPreferences: {
        marketBulletin: false,
        offersSurveys: false,
        events: false,
        newHomes: false,
        general: false
      }
    })

    if (this.basicPerson.emailAddress) {
      emailAddresses.push({ email: this.basicPerson.emailAddress } as Email)
      this.personForm.setControl('emailAddresses', this.setExistingEmailAddresses(emailAddresses))
    }

    if (this.basicPerson.phoneNumber) {
      phoneNumbers.push({
        number: this.basicPerson.phoneNumber
      } as PhoneNumber)
      this.personForm.setControl('phoneNumbers', this.setExistingPhoneNumbers(phoneNumbers))
    }
    this.personForm.updateValueAndValidity()
    this.personForm.markAsDirty()
  }

  displayPersonDetails(person: Person) {
    if (this.personForm) {
      this.personForm.reset()
    }
    this.personDetails = person
    if (person.address.postCode) {
      person.address.postCode = person.address.postCode.trim()
    }
    this.personForm.patchValue({
      warningStatusId: person.warningStatusId !== null ? person.warningStatusId : 1,
      warningStatusComment: person.warningStatusComment,
      titleId: person.titleId !== null ? person.titleId : 1,
      titleOther: person.titleOther,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      amlCompletedDate: this.sharedService.ISOToDate(person.amlCompletedDate),
      address: {
        addressLines: person.address.addressLines,
        postCode: person.address.postCode,
        countryId: person.address.countryId,
        country: person.address.country
      },
      contactByEmail: person.contactByEmail,
      contactByPhone: person.contactByPhone,
      marketingPreferences: {
        marketBulletin: person.marketingPreferences.marketBulletin,
        offersSurveys: person.marketingPreferences.offersSurveys,
        events: person.marketingPreferences.events,
        newHomes: person.marketingPreferences.newHomes,
        general: person.marketingPreferences.general
      }
    })
    this.personForm.setControl('emailAddresses', this.setExistingEmailAddresses(person.emailAddresses))
    this.personForm.setControl('phoneNumbers', this.setExistingPhoneNumbers(person.phoneNumbers))
  }

  setExistingPhoneNumbers(phoneNumbers: PhoneNumber[]): FormArray {
    const phoneArray = new FormArray([])
    phoneNumbers?.forEach((x) => {
      phoneArray.push(
        this.fb.group(
          {
            number: [x.number, { validators: [WedgeValidators.phoneNumberValidator()] }],
            id: x.id || 0,
            typeId: x.typeId || 3, // cross check this asap
            sendSMS: x.sendSMS || false,
            isPreferred: x.isPreferred || false,
            isUKMobileNumber: this.sharedService.isUKMobile(x.number) ? true : false,
            comments: x.comments
          },
          { validators: WedgeValidators.phoneTypeValidator(this) }
        )
      )
    })
    phoneArray.push(this.createPhoneNumberItem())
    return phoneArray
  }

  setExistingEmailAddresses(emailAddresses: Email[]): FormArray {
    const emailFormArray = new FormArray([])
    emailAddresses?.forEach((x) => {
      emailFormArray.push(
        this.fb.group({
          id: x.id || 0,
          email: [x.email, { validators: [Validators.pattern(AppConstants.emailPattern)] }],
          isPreferred: x.isPreferred || false,
          isPrimaryWebEmail: x.isPrimaryWebEmail || false
        })
      )
    })
    emailFormArray.push(this.createEmailItem())
    return emailFormArray
  }

  setupEditForm() {
    this.personForm = this.fb.group(
      {
        warningStatusId: [''],
        warningStatusComment: ['', { validators: [Validators.maxLength(20)] }],
        titleId: ['', { validators: [Validators.required] }],
        titleOther: ['', { validators: [Validators.maxLength(20)] }],
        firstName: ['', { validators: [Validators.required, Validators.maxLength(40)] }],
        middleName: ['', { validators: Validators.maxLength(50) }],
        lastName: ['', { validators: [Validators.required, Validators.maxLength(80)] }],
        fullAddress: [''],
        address: this.fb.group({
          addressLines: ['', { validators: Validators.maxLength(500) }],
          countryId: 0,
          postCode: [
            '',
            {
              validators: [
                Validators.minLength(5),
                Validators.maxLength(8),
                Validators.pattern(AppConstants.postCodePattern)
              ]
            }
          ]
        }),
        contactByEmail: [true],
        contactByPhone: [true],
        marketingPreferences: this.fb.group({
          marketBulletin: [false],
          offersSurveys: [false],
          events: [false],
          newHomes: [false],
          general: [false],
          count: 0
        }),
        amlCompletedDate: [''],
        emailAddresses: this.fb.array([this.createEmailItem()]),
        phoneNumbers: this.fb.array([this.createPhoneNumberItem()])
      },
      {
        validators: [
          WedgeValidators.emailPhoneValidator(this.emailPhoneRequired),
          WedgeValidators.warningStatusValidator(),
          WedgeValidators.titleValidator()
        ]
      }
    )
    // this.warningStatusId.disable();
  }

  togglePreferences(index: number, group: FormArray, toggleSendSMS = false) {
    if (group === this.phoneNumbers) {
      const phoneNumberPrefs = []
      const numberFormGroups = this.phoneNumbers.controls
      const selectedPhoneNumber = numberFormGroups[index].value
      for (let i = 0; i < numberFormGroups.length; i++) {
        phoneNumberPrefs.push(numberFormGroups[i].value)
      }
      const otherPhoneNumbers = phoneNumberPrefs.filter((x) => x !== selectedPhoneNumber)
      otherPhoneNumbers.forEach((x) => {
        x.isPreferred = false
      })
      if (toggleSendSMS) {
        phoneNumberPrefs[index] = selectedPhoneNumber
      }
      this.personForm.get('phoneNumbers').setValue(phoneNumberPrefs)
    } else {
      const emailPrefs = []
      const emailFormGroups = this.emailAddresses.controls
      const selectedEmail = emailFormGroups[index].value
      for (let i = 0; i < emailFormGroups.length; i++) {
        emailPrefs.push(emailFormGroups[i].value)
      }
      const otherEmails = emailPrefs.filter((x) => x !== selectedEmail)
      otherEmails.forEach((x) => {
        x.isPreferred = false
      })

      this.personForm.get('emailAddresses').setValue(emailPrefs)
    }
  }

  checkDuplicateAdressLines() {
    const addressLines = []
    const countryName = this.getCountryName(this.countryId.value)
    this.errorMessage = {} as WedgeError
    addressLines.push(this.addressLines.value.split('\n'))
    addressLines.forEach(() => {
      for (const value of Object.values(addressLines[0])) {
        if (value === this.postCode.value) {
          this.errorMessage.displayMessage = 'Address lines should not contain post code'
        } else if (countryName !== undefined && value !== null && value === countryName) {
          this.errorMessage.displayMessage = 'Address lines should not contain country'
        }
      }
      // console.log("errors here...", this.errorMessage);
    })
  }
  removeDuplicateAdressLines(): string {
    if (this.addressLines.value) {
      let newAddress = ''
      const addressLines = []
      addressLines.push(this.addressLines.value.split('\n'))
      addressLines.forEach(() => {
        for (const value of Object.values(addressLines[0])) {
          if (value === this.postCode.value) {
            newAddress = this.addressLines.value.replace(value, ' ')
          } else {
            newAddress = this.addressLines.value
          }
        }
      })
      return newAddress
    } else {
      return ''
    }
  }
  getCountryName(id: number) {
    const country = this.countries.filter((x: InfoDetail) => x.id === id)
    return country[0].value
  }

  addRemovePhoneNumberItem(i, remove) {
    const currPhoneNumber = this.phoneNumbers.controls[i] as FormGroup
    const lastPhoneNumber = this.phoneNumbers.controls[this.phoneNumbers.controls.length - 1]

    if (currPhoneNumber === lastPhoneNumber) {
      this.phoneNumbers.push(this.createPhoneNumberItem())
    }
    if (!currPhoneNumber.value.number && currPhoneNumber !== lastPhoneNumber && remove) {
      this.phoneNumbers.removeAt(i)
    }
  }
  createPhoneNumberItem(isUKMobileNumber?: boolean): FormGroup {
    return this.fb.group(
      {
        id: 0,
        typeId: 3,
        number: ['', { validators: [WedgeValidators.phoneNumberValidator()] }],
        orderNumber: 0,
        sendSMS: [false],
        isPreferred: [false],
        comments: [''],
        isUKMobileNumber: isUKMobileNumber
      },
      { validators: WedgeValidators.phoneTypeValidator(this) }
    )
  }

  addRemoveEmailItem(i, remove) {
    const currEmail = this.emailAddresses.controls[i]
    const lastEmail = this.emailAddresses.controls[this.emailAddresses.controls.length - 1]
    if (currEmail === lastEmail) {
      this.emailAddresses.push(this.createEmailItem())
    }
    if (!currEmail.value.email && currEmail !== lastEmail && remove) {
      this.emailAddresses.removeAt(i)
    }
  }

  createEmailItem(): FormGroup {
    return this.fb.group({
      id: 0,
      orderNumber: 0,
      email: ['', { validators: [Validators.pattern(AppConstants.emailPattern)] }],
      isPreferred: [false],
      isPrimaryWebEmail: [false]
    })
  }

  getAddress(address: Address) {
    const personAddress = this.personForm.get('address')
    if (JSON.stringify(personAddress.value) !== JSON.stringify(address)) {
      this.personForm.markAsDirty()
    } else {
      this.personForm.markAsPristine()
    }
    personAddress.setValue(address)
  }

  removeSMSLandlines() {
    this.phoneNumbers.controls.forEach((x) => {
      if (this.sharedService.isUKMobile(x.value.number)) {
        x.patchValue({
          sendSMS: true
        })
      }
    })
  }

  removeOthers() {
    if (+this.personForm.get('warningStatusId').value !== 100) {
      this.personForm.get('warningStatusComment').setValue('')
    }

    if (+this.personForm.get('titleId').value !== 100) {
      this.personForm.get('titleOther').setValue('')
    }
  }

  savePerson(otherPersonToAdd) {
    this.errorMessage = null
    this.removeOthers()
    this.logValidationErrors(this.personForm, true, true)
    if (this.personForm.valid) {
      if (otherPersonToAdd) {
        this.isSubmittingAndAdd = true
      } else {
        this.isSubmitting = true
      }
      if (this.personForm.dirty) {
        const person = { ...this.personDetails, ...this.personForm.value }

        if (!person.titleId) {
          person.titleId = 100
        }
        if (!this.basicPerson) {
          this.subs.sink = this.contactGroupService.updatePerson(person).subscribe(
            (res) => this.onSaveComplete(res.result, otherPersonToAdd),
            (error: WedgeError) => {
              this.isSubmitting = false
              this.isSubmittingAndAdd = false
            }
          )
        } else {
          this.subs.sink = this.contactGroupService.addPerson(person).subscribe(
            (data) => {
              this.newPersonId = data.personId
              this.onSaveComplete(data, otherPersonToAdd)
            },
            (error: WedgeError) => {
              this.isSubmitting = false
              this.isSubmittingAndAdd = false
            }
          )
        }
      } else {
        this.onSaveComplete(this.personDetails, otherPersonToAdd)
      }
    } else {
      this.errorMessage = {} as WedgeError
      this.errorMessage.displayMessage = 'Please correct validation errors'
    }
  }

  onSaveComplete(person?: Person, otherPersonToAdd?: boolean) {
    this.personForm.markAsPristine()
    this.isSubmitting = false
    this.isSubmittingAndAdd = false
    this.errorMessage = null
    this.messageService.add({
      severity: 'success',
      summary: 'Person successfully saved',
      closable: false
    })
    if (this.isEditingSelectedPerson && AppUtils.holdingSelectedPeople) {
      const holdingPeople = AppUtils.holdingSelectedPeople
      holdingPeople.forEach((x, index) => {
        if (x.personId === person.personId) {
          person.isNewPerson = true
          holdingPeople[index] = person
        }
      })
    }
    if (this.newPersonId) {
      const payload: any = { ...person }
      payload.addNewEntityToComplianceChecks = this.addNewEntityToComplianceChecks
      this.contactGroupService.getAddedPerson(payload)
      this.addedPersonId.emit(this.newPersonId)
      const personEmitter = {
        person: person,
        otherPersonToAdd: otherPersonToAdd
      }
      this.addedPersonDetails.emit(personEmitter)
      this.backToFinder.emit(otherPersonToAdd)
      if (!personEmitter.otherPersonToAdd) {
        this.makeCanvasInvisible(this.isOffCanvasVisible)
      }
      this.sharedService.back()
    } else {
      this.sharedService.back()
    }
  }

  makeCanvasInvisible(close: boolean) {
    this.hideCanvas.emit(close)
  }

  canDeactivate(): boolean {
    if (this.personForm.dirty && !this.isSubmitting && !this.isSubmittingAndAdd) {
      return false
    }
    return true
  }

  ngOnDestroy() {
    this.subs.unsubscribe()
  }
}
