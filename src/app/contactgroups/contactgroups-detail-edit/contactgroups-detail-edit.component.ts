import { Component, OnInit } from '@angular/core';
import { SharedService, Country } from 'src/app/core/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl, ValidationErrors, EmailValidator } from '@angular/forms';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { Person, Email, PhoneNumber } from 'src/app/core/models/person';
import { ActivatedRoute, Router } from '@angular/router';
import { WedgeValidators } from 'src/app/core/shared/wedge-validators';
import { debounceTime } from 'rxjs/operators';
import { mapValues, filter, isArray, isPlainObject, keys, merge, last } from 'lodash';

@Component({
  selector: 'app-contactgroups-detail-edit',
  templateUrl: './contactgroups-detail-edit.component.html',
  styleUrls: ['./contactgroups-detail-edit.component.scss']
})
export class ContactgroupsDetailEditComponent implements OnInit {
// countries: any;
countries: any;
titles: any;
telephoneTypes: any;
listInfo: any;
titleSelected = 1;
defaultCountryCode = 232;
telephoneTypeSelected = 1;
personDetails: Person;
personForm: FormGroup;
personId: number;
groupPersonId: number;
errorMessage: string;
errorsMessage: any = [];
emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
validationMessagesSimple = {
    required: 'is required.',
    maxlength: 'must be less than # characters.',
};
validationMessages = {
  'firstName': {
    required: 'First name is required.',
    minlength: 'First name must be greater than 2 characters',
    maxlength: 'First name must be less than 40 characters.',
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
    required: ' Email is required.'
  },
  'address': {
    required: 'Address is required.'
  },
  'number': {
    required: 'Phone is required.'
  },
  'inCode': {
    required: 'Postcode is required.',
    minlength: 'Incode must be 3 characters.',
    maxlength: 'Incode cannot be more than 3 characters.',
  },
  'outCode': {
    required: 'Postcode is required.',
    minlength: 'outCode must be 3 characters or more.',
    maxlength: 'outCode cannot be more than 4 characters.',
  },
};

formErrors = {
  'firstName': '',
  'lastName': '',
  'email': '',
  'emailAddresses': {
    'email': '',
  },
  'address': '',
  'number' : '',
  'inCode' : '',
  'outCode' : ''
};
get showPostCode(): boolean {
 return this.address.get('countryId').value === this.defaultCountryCode;
}
get address():  FormGroup {
  return <FormGroup> this.personForm.get('address');
}
get emailAddresses(): FormArray {
  return <FormArray> this.personForm.get('emailAddresses');
}
get phoneNumbers(): FormArray {
  return <FormArray> this.personForm.get('phoneNumbers');
}
public keepOriginalOrder = (a) => a.key;
  constructor(public sharedService: SharedService,
              private contactGroupService: ContactGroupsService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.listInfo = this.sharedService.dropdownListInfo;
    this.countries = Object.values(this.listInfo)[0];
    this.titles = Object.values(this.listInfo)[1];
    this.telephoneTypes = Object.values(this.listInfo)[2];
    this.route.params.subscribe(params => this.personId = +params['personId'] || 0);
    this.route.queryParams.subscribe(params => this.groupPersonId = +params['groupPersonId'] || 0);
    this.setupEditForm();
    const id = this.groupPersonId !== 0 ? this.groupPersonId : this.personId;
    this.getPersonDetails(id);
    this.personForm.valueChanges
    .subscribe(data => this.logValidationErrors(this.personForm));
  }

  logValidationErrors(group: FormGroup = this.personForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = this.validationMessages[key];
      this.formErrors[key] = '';
      if (control && !control.valid && (control.touched || control.dirty)) {
        for (const errorKey  in control.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + '';
          }
        }
      }
      if (control instanceof FormGroup) {
       this.logValidationErrors(control);
      }
    });
  }

  cancel() {
    this.sharedService.back();
  }
  setValidationForContactPreference(option: string) {
    const emailFormArray = this.personForm.get('emailAddresses');
    const phonesFormArray = this.personForm.get('phoneNumbers');

    if (option === 'email') {
      emailFormArray.setValidators(Validators.required);
    } else {
      emailFormArray.clearValidators();
    }
    emailFormArray.updateValueAndValidity();
    console.log('email address with validation set', emailFormArray);
  }
  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.personDetails = data;
      console.log('person details', this.personDetails);
     this.displayPersonDetails(data);
    }, error => this.errorMessage = <any>error);
  }

  displayPersonDetails(person: Person) {
    if (this.personForm) {
      this.personForm.reset();
     }
     this.personDetails = person;
     this.personForm.patchValue({
      titleSelected: person.titleId,
      //  title: person.title,
       firstName: person.firstName,
       middleName: person.middleName,
       lastName: person.lastName,
       amlCompletedDate: person.amlCompletedDate,
       address: {
        addressLines: person.address.addressLines,
        outCode: person.address.outCode,
        inCode: person.address.inCode,
        countryId: person.address.countryId,
        country: person.address.country,
       },
       contactBy: {email: person.contactByEmail, phone: person.contactByPhone},
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
          email: x.email,
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
          inCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
          outCode: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
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
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      isPrimaryWebEmail: [false]
    });
  }

  savePerson() {
    this.removeValidationForAdditionalFields();
    if (this.personForm.valid) {
        if (this.personForm.dirty) {
          const p = {...this.personDetails, ...this.personForm.value};
          this.contactGroupService.updatePerson(p).subscribe(() => this.onSaveComplete(),
          (error: any) => this.errorMessage = <any>error );
          console.log('person details to post', p);
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
    this.router.navigateByUrl('/contact-centre');
  }
}
