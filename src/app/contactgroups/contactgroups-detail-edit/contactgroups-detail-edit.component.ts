import { Component, OnInit, Input, Output } from '@angular/core';
import { SharedService, WedgeError, AddressAutoCompleteData } from 'src/app/core/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { Person, Email, PhoneNumber, BasicPerson } from 'src/app/core/models/person';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-contactgroups-detail-edit',
  templateUrl: './contactgroups-detail-edit.component.html',
  styleUrls: ['./contactgroups-detail-edit.component.scss']
})
export class ContactgroupsDetailEditComponent implements OnInit {
  @Output() editedPersonId = new EventEmitter<number>();
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
  id: number;
  groupPersonId: number;
  isOffCanvasVisible = false;
  returnUrl: string;
  errorMessage: string;
  isSubmitting = false;
  isLoadingAddressVisible = false;
  postCodePattern = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]?[\s]+?[0-9][A-Za-z]{2}|[Gg][Ii][Rr][\s]+?0[Aa]{2})$/;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  validationMessages = {
    'firstName': {
      required: 'First Name is required.',
      minlength: 'First Name must be greater than 2 characters',
      maxlength: 'First Name must be less than 40 characters.',
    },
    'middleName': {
      maxlength: 'Middle Name must be less than 50 characters'
    },
    'lastName': {
      required: 'Last name is required.',
      minlength: 'Last name must be greater than 2 characters',
      maxlength: 'Last name must be less than 80 characters.',
    },
    'emailAddress': {
      'email': {
        required: ' Email is required.'
      },
    },
    'email': {
      required: ' Email is required.',
      pattern: 'Email is not valid'
    },
    'address': {
      required: 'Address is required.'
    },
    'number': {
      required: 'Phone is required.'
    },
    'postCode': {
      required: 'Postcode is required.',
      minlength: 'Postcode must be at least 5 characters.',
      maxlength: 'Postcode cannot be more than 7 characters.',
      pattern: 'Postcode is not valid'
    }
  };

  formErrors = {
    'firstName': '',
    'lastName': '',
    'email': '',
    'emailAddresses': {
      'email': '',
    },
    'address': '',
    'number': '',
    'postCode': ''
  };
  foundAddress: AddressAutoCompleteData;

  get showPostCode(): boolean {
    return this.address.get('countryId').value == this.defaultCountryCode;
  }
  get postCode(): FormControl {
    return <FormControl>this.address.get('postCode');
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
  public keepOriginalOrder = (a) => a.key;
  constructor(public sharedService: SharedService,
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private _location: Location,
    private router: Router) { }

  ngOnInit() {
    this.listInfo = this.sharedService.dropdownListInfo;
    this.countries = Object.values(this.listInfo)[0];
    this.titles = Object.values(this.listInfo)[1];
    this.telephoneTypes = Object.values(this.listInfo)[2];
    this.route.params.subscribe(params => this.personId = +params['personId'] || 0);
    this.route.queryParams.subscribe(params => {
      this.groupPersonId = +params['groupPersonId'] || 0;
    });
    this.setupEditForm();
    const id = this.groupPersonId !== 0 ? this.groupPersonId : this.personId;
    if (this.basicPerson !== undefined) {
      this.populateNewPersonDetails();
    } else {
      this.getPersonDetails(id);
    }
    this.personForm.valueChanges.pipe(debounceTime(1000))
      .subscribe((data) => {
        this.postCode.setValue(this.sharedService.formatPostCode(data.address.postCode), { emitEvent: false });
        this.logValidationErrors(this.personForm, false);
      });
    console.log(this.personForm);

    // const addressControl = this.personForm.get('fullAddress');
    // addressControl.valueChanges.pipe(debounceTime(500)).subscribe(data => {
    //   this.findAddress(data, '');
    // });
  }

  logValidationErrors(group: FormGroup = this.personForm, fakeTouched: boolean) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = this.validationMessages[key];
      if (control && !control.valid && (fakeTouched || control.touched)) {
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
    });
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
    }, error => this.errorMessage = <any>error);
  }

  searchAddress() {
    const addressSearchTerm = this.personForm.get('fullAddress').value;
    this.isLoadingAddressVisible = true;
    this.findAddress(addressSearchTerm, '');
  }

  findAddress(searchTerm: string, container: string) {
    this.sharedService.findAddress(searchTerm, container).subscribe(data => {
      this.foundAddress = data;
      this.isLoadingAddressVisible = false;
      console.log('id here', data.Items[0].Id);
      data.Items.forEach(x=>{
        console.log(x.Description);
        if(x.Id) {
          if(!x.Id.includes('|B|')) {
            this.findAddress(searchTerm, x.Id);
          }
        }
      });
    });
  }
  private retrieveAddress(id: string) {
    if (this.foundAddress) {
      this.sharedService.getAddress(id).subscribe(data => {
        this.retrievedAddresses = data;
        console.log('found addresses here', data);
      });
    }
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
    console.log('this is called', this.personForm.value);
  }

  displayPersonDetails(person: Person) {
    if (this.personForm) {
      this.personForm.reset();
    }
    this.personDetails = person;
    this.personForm.patchValue({
      titleSelected: person.titleId !== null ? person.titleId : 1,
      //  title: person.title,
      firstName: person.firstName,
      middleName: person.middleName,
      lastName: person.lastName,
      amlCompletedDate: person.amlCompletedDate,
      address: {
        addressLines: person.address.addressLines,
        // outCode: person.address.outCode,
        // inCode: person.address.inCode,
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
    phoneNumbers.forEach(x => {
      phoneArray.push(this.fb.group({
        number: x.number,
        typeId: x.typeId,
        isPreferred: x.isPreferred,
        comments: x.comments
      }));
    });
    phoneArray.push(this.createPhoneNumberItem());
    return phoneArray;
  }

  setExistingEmailAddresses(emailAddresses: Email[]): FormArray {
    const emailFormArray = new FormArray([]);
    emailAddresses.forEach(x => {
      emailFormArray.push(this.fb.group({
        id: x.id,
        email: x.email,
        isPreferred: x.isPreferred,
        isPrimaryWebEmail: x.isPrimaryWebEmail
      }));
    });
    emailFormArray.push(this.createEmailItem());
    return emailFormArray;
  }

  setupEditForm() {
    this.personForm = this.fb.group({
      titleSelected: [''],
      firstName: ['', [Validators.required, Validators.maxLength(40)]],
      middleName: ['', Validators.maxLength(50)],
      lastName: ['', [Validators.required, Validators.maxLength(80)]],
      fullAddress: [''],
      address: this.fb.group({
        addressLines: ['', Validators.maxLength(500)],
        countryId: 0,
        postCode: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(8), Validators.pattern(this.postCodePattern)]],
        // inCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
        // outCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      }),
      contactBy: this.fb.group({
        email: [false],
        phone: [false]
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
    console.log('email address with validation set', emailFormArray);
  }

  removeValidationForAdditionalFields() {
    const currPhoneNumber = this.phoneNumbers.controls[0];
    const currEmail = this.emailAddresses.controls[0];
    const lastPhoneNumber = this.phoneNumbers.controls[this.phoneNumbers.controls.length - 1];
    const lastEmail = this.emailAddresses.controls[this.emailAddresses.controls.length - 1];
    if (lastPhoneNumber.get('number').value === '' && currPhoneNumber !== lastEmail) {
      lastPhoneNumber.get('number').clearValidators();
      lastPhoneNumber.get('number').updateValueAndValidity();
    }
    if (lastEmail.get('email').value === '' && currEmail !== lastEmail || currEmail.get('email').value !== '') {
      lastEmail.get('email').clearValidators();
      lastEmail.get('email').updateValueAndValidity();
    }
  }

  isValid(event, el) {
    if (el.invalid) {
      event.target.classList.add('is-invalid');
    } else {
      event.target.classList.remove('is-invalid');
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
      console.log('group here phone numbers ');
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
      console.log('emails group here');
    }
  }

  checkDuplicateAdressLines(address: string, postcode: string, country: string) {
    const addressLines = [];
    let duplicateErrorMessage = '';
    addressLines.push(address.split('\n'));
    addressLines.forEach(x => {
      if (x === postcode) {
        duplicateErrorMessage = 'Address lines should not contain post code';
        console.log('addres parts here...', x);
      } else if (x === country) {
        duplicateErrorMessage = 'Address lines should not contain country';
      }
      console.log('addres parts here...', x);
    });
  }
  addPhoneNumberItem(i) {
    const currPhoneNumber = this.phoneNumbers.controls[i];
    const lastPhoneNumber = this.phoneNumbers.controls[this.phoneNumbers.controls.length - 1];
    if (lastPhoneNumber.value.number) {
      this.phoneNumbers.push(this.createPhoneNumberItem());
    }
    if (!currPhoneNumber.value.number && currPhoneNumber !== lastPhoneNumber) {
      this.phoneNumbers.removeAt(i);
    }
  }
  createPhoneNumberItem(): FormGroup {
    return this.fb.group({
      id: 0,
      typeId: 3,
      number: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(16), Validators.pattern(/^\+?[ \d]+$/g)]],
      orderNumber: 0,
      isPreferred: [false],
      comments: ['']
    });
  }

  addEmailItem(i) {
    const currEmail = this.emailAddresses.controls[i];
    const lastEmail = this.emailAddresses.controls[this.emailAddresses.controls.length - 1];
    if (lastEmail.value.email) {
      this.emailAddresses.push(this.createEmailItem());
    }
    if (!currEmail.value.email && currEmail !== lastEmail) {
      this.emailAddresses.removeAt(i);
    }
  }

  createEmailItem(): FormGroup {
    return this.fb.group({
      id: 0,
      orderNumber: 0,
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      isPreferred: [false],
      isPrimaryWebEmail: [false]
    });
  }

  savePerson() {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.removeValidationForAdditionalFields();
    this.logValidationErrors(this.personForm, true);
    if (this.personForm.valid) {
      if (this.personForm.dirty) {
        const person = { ...this.personDetails, ...this.personForm.value };
        const postCode =  this.sharedService.splitPostCode(person.address.postCode);
        person.address.outCode = postCode[0];
        person.address.inCode = postCode[1];
        this.contactGroupService.updatePerson(person).subscribe(() => this.onSaveComplete(),
          (error: WedgeError) => {
            this.errorMessage = error.displayMessage;
            this.isSubmitting = false;
          });
        console.log('post code details to post', this.sharedService.splitPostCode(person.address.postCode));
        console.log('person details form values', this.personForm.value);
        console.log('person details to post', person);
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct validation errors';
    }

    console.log(this.personForm);
    console.log(this.errorMessage);
  }
  onSaveComplete() {
    this.personForm.reset();
    // this.editSelectPerson(this.foundPersonId);
    if (this.basicPerson) {
      this.makeCanvasInvisible(this.isOffCanvasVisible);
    } else {
      this._location.back();
    }
  }
  editSelectPerson(id: number) {
    this.editedPersonId.emit(id);
  }
  makeCanvasInvisible(close: boolean) {
    this.hideCanvas.emit(close);
  }

  canDeactivate(): boolean {
    if(this.personForm.dirty  && !this.isSubmitting) {
      return false;
    }
    return true;
  }
}
