import { Component, OnInit, Input, Output, Renderer2 } from '@angular/core';
import { SharedService, WedgeError, AddressAutoCompleteData, InfoDetail } from 'src/app/core/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { Person, Email, PhoneNumber, BasicPerson, TelephoneTypeId } from 'src/app/core/models/person';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { AppConstants, FormErrors, ValidationMessages } from 'src/app/core/shared/app-constants';
import { AppUtils } from 'src/app/core/shared/utils';
import { WedgeValidators } from 'src/app/core/shared/wedge-validators';

@Component({
  selector: 'app-contactgroups-detail-edit',
  templateUrl: './contactgroups-detail-edit.component.html',
  styleUrls: ['./contactgroups-detail-edit.component.scss']
})
export class ContactgroupsDetailEditComponent implements OnInit {
  @Output() addedPersonId = new EventEmitter<number>();
  @Output() hideCanvas = new EventEmitter<boolean>();
  @Output() backToFinder = new EventEmitter<boolean>();
  @Input() basicPerson: BasicPerson;
  prefToggleStatus = false;
  countries: any;
  titles: any;
  telephoneTypes: any;
  listInfo: any;
  titleSelected = 1;
  defaultCountryCode = 232;
  telephoneTypeSelected = 1;
  retrievedAddresses: AddressAutoCompleteData;
  personDetails: Person;
  personForm: FormGroup;
  personId: number;
  newPersonId: number;
  id: number;
  groupPersonId: number;
  isNewContactGroup = false;
  isOffCanvasVisible = false;
  returnUrl: string;
  errorMessage: WedgeError;
  formArraryErrors: string;
  isSubmitting = false;
  isLoadingAddressVisible = false;
  isContactErrorVisible = false;
  backToAddressesList = false;
  enterAddressManually = false;
  isEditingSelectedPerson = false;
  searchTermBK = '';
  invalidPhoneType: boolean;
  formErrors = FormErrors;
  validationMessages = ValidationMessages;
  foundAddress: AddressAutoCompleteData;
  invalidFormArrayControls = {
    number: [],
    email: [],
    typeId: []
  };
  number: string;
  get showPostCode(): boolean {
    return this.address.get('countryId').value === this.defaultCountryCode;
  }
  get addressLines(): FormControl {
    return <FormControl>this.address.get('addressLines');
  }
  get postCode(): FormControl {
    return <FormControl>this.address.get('postCode');
  }
  get countryId(): FormControl {
    return <FormControl>this.address.get('countryId');
  }
  get address(): FormGroup {
    return <FormGroup>this.personForm.get('address');
  }
  get emailAddresses(): FormArray {
    return <FormArray>this.personForm.get('emailAddresses');
  }
  get phoneNumbers(): FormArray {
    return <FormArray>this.personForm.get('phoneNumbers');
  }
  get currentPhoneNumber() {
    return this.number;
  }
  public keepOriginalOrder = (a) => a.key;
  constructor(public sharedService: SharedService,
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _location: Location,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.listInfo = this.sharedService.dropdownListInfo;
    this.countries = this.listInfo.result.countries;
    this.titles = this.listInfo.result.titles;
    this.telephoneTypes = this.listInfo.result.telephoneTypes;
    this.route.params.subscribe(params => this.personId = +params['personId'] || 0);
    this.route.queryParams.subscribe(params => {
      this.groupPersonId = +params['groupPersonId'] || 0;
      this.isEditingSelectedPerson = params['isEditingSelectedPerson'] || false;
    });
    this.setupEditForm();
    const id = this.groupPersonId !== 0 ? this.groupPersonId : this.personId;
    if (this.basicPerson !== undefined) {
      this.populateNewPersonDetails();
    } else {
      this.getPersonDetails(id);
    }
    this.logValidationErrors(this.personForm, false);
    this.personForm.valueChanges
      .pipe(debounceTime(400)).subscribe((data) => {
        this.postCode.setValue(this.sharedService.formatPostCode(data.address.postCode), { emitEvent: false });
        this.logValidationErrors(this.personForm, false);
      });
  }

  logValidationErrors(group: FormGroup = this.personForm, fakeTouched: boolean) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
        this.formErrors[key] = '';
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        this.formErrors[key] = '';
        for (const errorKey in control.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + '\n';
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched);
      }

      if (control instanceof FormArray) {
        this.logValidationErrorsFormArray(control);
      }
    });
  }

  logValidationErrorsFormArray(control: AbstractControl) {
      this.formArraryErrors = '';
      //console.log(control['controls']);
      control['controls'].forEach((x:AbstractControl, i) => {
        const fields = ['number', 'email'];
        fields.forEach(label => {
          const field = x.get(label);
          if(field) {
            const parent = field['parent']['controls'];
            Object.keys(parent).forEach((name) => {
              if (field === parent[name]) {
                if (field.value && !field.valid) {
                  if (!this.invalidFormArrayControls[name].includes(i)) {
                    this.invalidFormArrayControls[name].push(i);
                  }
                } else {
                  const index = this.invalidFormArrayControls[name].indexOf(i);
                  if (index >= 0) {
                    this.invalidFormArrayControls[name].splice(index, 1);
                  }
                }
              }
            });
          }
        })
      });
  }

  isValid(type, i) {
    return this.invalidFormArrayControls[type].includes(i);
  }


  cancel() {
    if (this.basicPerson) {
      this.backToFinder.emit(true);
    } else {
      this._location.back();
    }
  }

  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.personDetails = data;
      console.log('person details', this.personDetails);
      this.displayPersonDetails(data);
    }, error => {
      this.errorMessage = <any>error;
      this.sharedService.showError(this.errorMessage);
    });
  }

  searchAddress() {
    const addressSearchTerm = this.personForm.get('fullAddress').value;
    this.findAddress(addressSearchTerm, '');
  }

  enterAddress(event) {
    event.preventDefault();
    this.enterAddressManually = true;
    setTimeout(() => {
      this.renderer.selectRootElement('#addressLines').focus();
    });
  }

  findAddress(searchTerm: string, container: string) {
    this.retrievedAddresses = null;
    this.isLoadingAddressVisible = true;

    if (container) {
      this.backToAddressesList = true;
    } else {
      this.backToAddressesList = false;
    }
    this.sharedService.findAddress(searchTerm, container).subscribe(data => {
      data.Items.forEach(x => {
        if (x.Id) {
          if (x.Type !== 'Address') {
            x.Action = 'View all';
            this.searchTermBK = searchTerm;
          }
        }
      });
      this.foundAddress = data;
      this.isLoadingAddressVisible = false;
    });
  }

  populateNewPersonDetails() {
    if (this.personForm) {
      this.personForm.reset();
    }
    this.personForm.patchValue({
      firstName: this.basicPerson.firstName,
      lastName: this.basicPerson.lastName,
      address: {
        countryId: this.defaultCountryCode
      },
      contactBy: {
        email: true,
        phone: true
      },
      marketingPreferences: {
        marketBulletin: false,
        offersSurveys: false,
        events: false,
        newHomes: false,
        general: false
      }
    });
    this.personForm.setControl('emailAddresses', this.setExistingEmailAddresses(this.basicPerson.emailAddresses));
    this.personForm.setControl('phoneNumbers', this.setExistingPhoneNumbers(this.basicPerson.phoneNumbers));
    this.personForm.updateValueAndValidity();
    this.personForm.markAsDirty();
  }

  displayPersonDetails(person: Person) {
    if (this.personForm) {
      this.personForm.reset();
    }
    this.personDetails = person;
    if (person.address.postCode) {
      person.address.postCode = person.address.postCode.trim();
    }
    this.personForm.patchValue({
      titleId: person.titleId !== null ? person.titleId : 1,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      amlCompletedDate: this.sharedService.ISOToDate(person.amlCompletedDate),
      address: {
        addressLines: person.address.addressLines,
        postCode: person.address.postCode,
        countryId: person.address.countryId,
        country: person.address.country,
      },
      contactBy: { email: person.contactByEmail, phone: person.contactByPhone },
      marketingPreferences: {
        marketBulletin: person.marketingPreferences.marketBulletin,
        offersSurveys: person.marketingPreferences.offersSurveys,
        events: person.marketingPreferences.events,
        newHomes: person.marketingPreferences.newHomes,
        general: person.marketingPreferences.general
      }
    });
    this.personForm.setControl('emailAddresses', this.setExistingEmailAddresses(person.emailAddresses));
    this.personForm.setControl('phoneNumbers', this.setExistingPhoneNumbers(person.phoneNumbers));

  }

  setExistingPhoneNumbers(phoneNumbers: PhoneNumber[]): FormArray {
    const phoneArray = new FormArray([]);
    phoneNumbers.forEach((x) => {
      phoneArray.push(this.fb.group({
        number: [x.number, { validators: [Validators.required, WedgeValidators.phoneNumberValidator()]}],
        typeId: x.typeId,
        sendSMS: x.sendSMS || false,
        isPreferred: x.isPreferred,
        comments: x.comments
      }, {validators: WedgeValidators.phoneTypeValidator(this)}));
    });
    phoneArray.push(this.createPhoneNumberItem());
    return phoneArray;
  }

  setExistingEmailAddresses(emailAddresses: Email[]): FormArray {
    const emailFormArray = new FormArray([]);
    emailAddresses.forEach(x => {
      emailFormArray.push(this.fb.group({
        id: x.id,
        email: [x.email, { validators: [Validators.required, Validators.pattern(AppConstants.emailPattern)]}],
        isPreferred: x.isPreferred,
        isPrimaryWebEmail: x.isPrimaryWebEmail
      }));
    });
    emailFormArray.push(this.createEmailItem());
    return emailFormArray;
  }

  setupEditForm() {
    this.personForm = this.fb.group({
      titleId: ['', {validators: [Validators.required]}],
      firstName: ['', {validators: [Validators.required, Validators.maxLength(40)]}],
      middleName: ['', {validators: Validators.maxLength(50)}],
      lastName: ['', {validators: [Validators.required, Validators.maxLength(80)]}],
      fullAddress: [''],
      address: this.fb.group({
        addressLines: ['', {validators: Validators.maxLength(500)}],
        countryId: 0,
        postCode: ['', {validators: [Validators.minLength(5), Validators.maxLength(8), Validators.pattern(AppConstants.postCodePattern)]}],
      }),
      contactBy: this.fb.group({
        email: [true],
        phone: [true]
      }),
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
    });
  }

  setValidationForContactPreference(option: string) {
    const emailFormArray = this.personForm.get('emailAddresses');

    if (option === 'email') {
      emailFormArray.setValidators(Validators.required);
    } else {
      emailFormArray.clearValidators();
    }
    emailFormArray.updateValueAndValidity();
  }

  removeValidationForPhoneAndEmail() {
    const phoneNumber = this.phoneNumbers.controls[0];
    const currentNumber = phoneNumber.get('number');
    const email = this.emailAddresses.controls[0];
    const currentEmail = email.get('email');
    if (currentNumber.value === '' && currentEmail.value !== '') {
      currentNumber.clearValidators();
      currentNumber.updateValueAndValidity();
    }
    if (currentEmail.value === '' && currentNumber.value !== '') {
      currentEmail.clearValidators();
      currentEmail.updateValueAndValidity();
    }
  }
  removeValidationForAdditionalFields() {
    const currPhoneNumber = this.phoneNumbers.controls[0];
    const currEmail = this.emailAddresses.controls[0];
    const lastPhoneNumber = this.phoneNumbers.controls[this.phoneNumbers.controls.length - 1];
    const lastEmail = this.emailAddresses.controls[this.emailAddresses.controls.length - 1];

    this.phoneNumbers.controls.forEach(x => {
      if (!this.sharedService.isUKMobile(x.value.number)) {
        x.patchValue({
          sendSMS: false
        });
      }
    });

    if (lastPhoneNumber.get('number').value === '' && currPhoneNumber !== lastEmail) {
      lastPhoneNumber.get('number').clearValidators();
      lastPhoneNumber.get('number').updateValueAndValidity();
    }
    if (lastEmail.get('email').value === '' && currEmail !== lastEmail || currEmail.get('email').value !== '') {
      lastEmail.get('email').clearValidators();
      lastEmail.get('email').updateValueAndValidity();
    }
  }

  togglePreferences(index: number, group: FormArray) {
    if (group === this.phoneNumbers) {
      const phoneNumberPrefs = [];
      const numberFormGroups = this.phoneNumbers.controls;
      const selectedPhoneNumber = numberFormGroups[index].value;
      for (let i = 0; i < numberFormGroups.length; i++) {
        phoneNumberPrefs.push(numberFormGroups[i].value);
      }
      const otherPhoneNumbers = phoneNumberPrefs.filter(x => x !== selectedPhoneNumber);
      otherPhoneNumbers.forEach(x => {
        x.isPreferred = false;
      });
    } else {
      const emailPrefs = [];
      const emailFormGroups = this.emailAddresses.controls;
      const selectedEmail = emailFormGroups[index].value;
      for (let i = 0; i < emailFormGroups.length; i++) {
        emailPrefs.push(emailFormGroups[i].value);
      }
      const otherEmails = emailPrefs.filter(x => x !== selectedEmail);
      otherEmails.forEach(x => {
        x.isPreferred = false;
      });
    }
  }

  checkDuplicateAdressLines() {
   const addressLines = [];
   const countryName = this.getCountryName(this.countryId.value);
   this.errorMessage = {} as WedgeError;
    addressLines.push(this.addressLines.value.split('\n'));
    addressLines.forEach(() => {
      for (const value of  Object.values(addressLines[0])) {
        if (value === this.postCode.value) {
          this.errorMessage.displayMessage = 'Address lines should not contain post code';
        } else if (countryName !== undefined && value !== null && value === countryName) {
          this.errorMessage.displayMessage = 'Address lines should not contain country';
        }
      }
      console.log('errors here...', this.errorMessage);
    });
  }
  removeDuplicateAdressLines(): string {
    if (this.addressLines.value) {
      let newAddress = '';
      const addressLines = [];
       addressLines.push(this.addressLines.value.split('\n'));
       addressLines.forEach(() => {
         for (const value of  Object.values(addressLines[0])) {
           if (value === this.postCode.value) {
           newAddress =  this.addressLines.value.replace(value, ' ');
           } else {
             newAddress = this.addressLines.value;
           }
         }
       });
       return newAddress;
    } else {
      return '';
    }
  }
   getCountryName(id: number) {
    const country = this.countries.filter((x: InfoDetail) => x.id === id);
    return country[0].value;
  }

  addRemovePhoneNumberItem(i, remove) {
    const currPhoneNumber = this.phoneNumbers.controls[i];
    const lastPhoneNumber = this.phoneNumbers.controls[this.phoneNumbers.controls.length - 1];

    if (currPhoneNumber === lastPhoneNumber) {
      this.phoneNumbers.push(this.createPhoneNumberItem());
    }
    if (!currPhoneNumber.value.number && currPhoneNumber !== lastPhoneNumber && remove) {
      this.phoneNumbers.removeAt(i);
    }
  }
  createPhoneNumberItem(): FormGroup {
    return this.fb.group({
      id: 0,
      typeId: 3,
      number: ['', { validators: [Validators.required, WedgeValidators.phoneNumberValidator()]}],
      orderNumber: 0,
      sendSMS: [true],
      isPreferred: [false],
      comments: ['']
    }, {validators: WedgeValidators.phoneTypeValidator(this)});
  }

  addRemoveEmailItem(i, remove) {
    const currEmail = this.emailAddresses.controls[i];
    const lastEmail = this.emailAddresses.controls[this.emailAddresses.controls.length - 1];
    if (currEmail === lastEmail) {
      this.emailAddresses.push(this.createEmailItem());
    }
    if (!currEmail.value.email && currEmail !== lastEmail && remove) {
      this.emailAddresses.removeAt(i);
    }
  }

  createEmailItem(): FormGroup {
    return this.fb.group({
      id: 0,
      orderNumber: 0,
      email: ['', { validators: [Validators.required, Validators.pattern(AppConstants.emailPattern)]}],
      isPreferred: [false],
      isPrimaryWebEmail: [false]
    });
  }

  // checkPhoneType(index: number) {
  //   const currPhoneNumberControl = this.phoneNumbers.controls[index];
  //   const phoneNumber = currPhoneNumberControl.value.number;
  //   this.number = phoneNumber;
  //   const phoneNumberType = currPhoneNumberControl.value.typeId;
  //   const inValidMobileNumber = !this.sharedService.isUKMobile(phoneNumber);
  //   if (phoneNumberType == TelephoneTypeId.Mobile && inValidMobileNumber) {
  //     this.invalidPhoneType = true;
  //     this.errorMessage = { } as WedgeError;
  //     this.errorMessage.displayMessage = `Telephone number ${phoneNumber} is not a valid mobile number`;
  //     console.log('error message to display', this.errorMessage.displayMessage);
  //   }
  // }
  savePerson() {
    this.errorMessage = null;
    const allPhoneNumbers =  this.phoneNumbers.controls.length - 1;
    // for (let index = 0; index < allPhoneNumbers; index++) {
    //   this.checkPhoneType(index);
    // }
    this.removeValidationForPhoneAndEmail();
    this.removeValidationForAdditionalFields();
    this.logValidationErrors(this.personForm, true);
    if (this.personForm.valid) {
      this.isSubmitting = true;
      if (this.personForm.dirty) {
        const person = { ...this.personDetails, ...this.personForm.value };
        const postCode =  this.sharedService.splitPostCode(person.address.postCode);
        if (!person.titleId) {
          person.titleId = 100;
        }
        person.address.outCode = postCode[0];
        person.address.inCode = postCode[1];
        person.address.addressLines = this.removeDuplicateAdressLines();
        if (!this.basicPerson) {
          this.contactGroupService.updatePerson(person).subscribe(res => this.onSaveComplete(res.result),
            (error: WedgeError) => {
              this.errorMessage = error;
              this.sharedService.showError(this.errorMessage);
              this.isSubmitting = false;
            });
        } else {
          this.contactGroupService.addPerson(person).subscribe((data) => {
            console.log(data);
             this.newPersonId = data.personId;
             this.onSaveComplete(); },
            (error: WedgeError) => {
              this.errorMessage = error;
              this.sharedService.showError(this.errorMessage);
              this.isSubmitting = false;
            });
        }
      } else {
        this.onSaveComplete(this.personDetails);
      }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = 'Please correct validation errors';
      if (!this.personForm.value.emailAddresses[0].email && !this.personForm.value.phoneNumbers[0].number) {
        this.isContactErrorVisible = true;
        setTimeout(() => {
          document.getElementById('contact-error').scrollIntoView({block: 'center'});
        });
      }
    }
  }
  onSaveComplete(person?: Person) {
    this.personForm.reset();
    this.sharedService.showSuccess('Person successfully saved');
    if(this.isEditingSelectedPerson && AppUtils.holdingSelectedPeople) {
      const holdingPeople = AppUtils.holdingSelectedPeople;
      holdingPeople.forEach((x,index)=>{
        if(x.personId === person.personId) {
          person.isNewPerson = true;
          holdingPeople[index] = person;
        }
      })
    }
    if (this.newPersonId) {
      this.addNewPerson(this.newPersonId);
      this.backToFinder.emit(true);
      this.makeCanvasInvisible(this.isOffCanvasVisible);
    } else {
      this._location.back();
    }
  }
  addNewPerson(id: number) {
    this.addedPersonId.emit(id);
  }
  makeCanvasInvisible(close: boolean) {
    this.hideCanvas.emit(close);
  }

  canDeactivate(): boolean {
    if (this.personForm.dirty  && !this.isSubmitting) {
      return false;
    }
    return true;
  }
}
