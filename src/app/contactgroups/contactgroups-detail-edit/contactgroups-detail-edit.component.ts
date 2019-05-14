import { Component, OnInit } from '@angular/core';
import { SharedService, Country } from 'src/app/core/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { Person, Email, PhoneNumber } from 'src/app/core/models/person';
import { ActivatedRoute, Router } from '@angular/router';
import { WedgeValidators } from 'src/app/core/shared/wedge-validators';
import { debounceTime } from 'rxjs/operators';

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
validationMessages = {
    required: 'is required.',
    maxlength: 'must be less than # characters.',
};
// validationMessages = {
//   name: {
//     required: 'Full Name is required.',
//     minlength: 'Full Name must be greater than 2 characters',
//     maxlength: 'Full Name must be less than 10 characters.',
//   },
//   email: {
//     required: ' Email is required.'
//   },
//   address: {
//     required: 'Address is required.'
//   },
//   phone: {
//     'required': 'Phone is required.'
//   },
// };
get showFullAddress(): boolean {
 return this.addresses.get('countryId').value === this.defaultCountryCode;
}
get addresses():  FormGroup {
  return <FormGroup> this.personForm.get('addresses');
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
    const firstNameControl = this.personForm.get('firstName');
    firstNameControl.valueChanges.pipe(debounceTime(1000)).subscribe(data => this.logValidationErrors(firstNameControl, 'firstName', 40));
    const middleNameControl = this.personForm.get('middleName');
    middleNameControl.valueChanges.pipe(debounceTime(1000)).subscribe(data => this.logValidationErrors(middleNameControl, 'middleName', 50));
    const lastNameControl = this.personForm.get('lastName');
    lastNameControl.valueChanges.pipe(debounceTime(1000)).subscribe(data => this.logValidationErrors(lastNameControl, 'lastName', 80));
  }

  logValidationErrors(c: AbstractControl, name: string, maxLength: number) {
   this.errorsMessage[name] = '';
   if ((c.dirty || c.touched) && c.errors) {
    this.errorsMessage[name] = Object.keys(c.errors).map(key =>
       this.errorsMessage[name] +=  this.labelGen(name) + ' ' + this.validationMessages[key].replace('#', maxLength)).join('');
   }
  }

  labelGen(name) {
    name = name.split(/(?=[A-Z])/).join(' ');
    name = name.charAt(0).toUpperCase() + name.slice(1)
    return name;
  }

  cancel() {
    this.sharedService.back();
  }

  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.personDetails = data;
     this.displayPersonDetails(data);
    });
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
       addresses: {
        address1: person.address.address1,
        address2: person.address.address2,
        address3: person.address.address3,
        address4: person.address.address4,
        address5: person.address.address5,
        town: person.address.town,
        outCode: person.address.outCode,
        inCode: person.address.inCode,
        countryId: person.address.countryId,
        country: person.address.country,
       },
       contactBy: {email: person.contactByEmail, phone: person.contactByPhone},
       marketingPreferences: {
        marketBulletin: person.marketingPreferences.marketBulletin,
        offerSurveys: person.marketingPreferences.offerSurveys,
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
        phoneNumber: x.number,
        phoneNumberType: x.telephoneTypeId,
        isPreferred: x.isPreferred
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
        addresses: this.fb.group({
          address1: ['', Validators.maxLength(80)],
          address2: ['', Validators.maxLength(80)],
          address3: ['', Validators.maxLength(80)],
          address4: ['', Validators.maxLength(80)],
          address5: ['', Validators.maxLength(80)],
          town: ['', Validators.maxLength(80)],
          countryId: 0,
          country: ['United Kingdom', [Validators.required, Validators.maxLength(50)]],
          inCode: ['', [Validators.required, Validators.maxLength(3)]],
          outCode: ['', [Validators.required, Validators.maxLength(4)]],
          postCode: ['', [Validators.required, Validators.maxLength(6)]] }),
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

  addPhoneNumberItem(i) {
    const currPhoneNumber = this.phoneNumbers.controls[i];
    const lastPhoneNumber = this.phoneNumbers.controls[this.phoneNumbers.controls.length - 1];
    if(lastPhoneNumber.value.phoneNumber) {
      this.phoneNumbers.push(this.createPhoneNumberItem());
    }
    if(!currPhoneNumber.value.phoneNumber && currPhoneNumber !== lastPhoneNumber) {
      this.phoneNumbers.removeAt(i);
    }
  }
  createPhoneNumberItem(): FormGroup {
    return this.fb.group({
      phoneNumber: ['', [Validators.required, WedgeValidators.peoplePhone]],
      phoneNumberType: 3,
      isPreferred: [false]
    });
  }

  addEmailItem(i) {
    const currEmail = this.emailAddresses.controls[i];
    const lastEmail = this.emailAddresses.controls[this.emailAddresses.controls.length - 1];
    if(lastEmail.value.email) {
      this.emailAddresses.push(this.createEmailItem());
    }
    if(!currEmail.value.email && currEmail !== lastEmail) {
      this.emailAddresses.removeAt(i);
    }
  }

  createEmailItem(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.email]],
      isPrimaryWebEmail: [false]
    });
  }

  savePerson() {
    if (this.personForm.valid) {
        if (this.personForm.dirty) {
          const p = {...this.personDetails, ...this.personForm.value};
          this.contactGroupService.updatePerson(p).subscribe(() => this.onSaveComplete(),
          (error: any) => this.errorMessage = <any>error );
        } else {
          this.onSaveComplete();
        }
     } else {
      this.errorMessage = 'Please correct validation errors';
    }
    console.log(this.errorMessage);
  }
  onSaveComplete() {
    // tslint:disable-next-line:no-unused-expression
    this.personForm.reset;
    this.router.navigateByUrl('/contact-centre');
  }
}
