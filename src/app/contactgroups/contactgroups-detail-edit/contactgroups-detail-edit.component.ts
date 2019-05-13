import { Component, OnInit } from '@angular/core';
import { SharedService, Country } from 'src/app/core/services/shared.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { Person, Email, PhoneNumber } from 'src/app/core/models/person';
import { ActivatedRoute } from '@angular/router';

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
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.listInfo = this.sharedService.dropdownListInfo;
    this.countries = Object.values(this.listInfo)[0];
    this.titles = Object.values(this.listInfo)[1];
    this.telephoneTypes = Object.values(this.listInfo)[2];
    this.route.params.subscribe(params => this.personId = +params['personId'] || 0);
    this.getPersonDetails(this.personId);
    this.setupEditForm();
  }

  cancel() {
    this.sharedService.back();
  }

  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.personDetails = data;
     this.displayPersonDetails(data);
      console.log('this is  person details', this.personDetails);
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
       firstname: person.firstName,
       middlename: person.middleName,
       lastname: person.lastName,
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
        country: person.address.country
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
      console.log('this is isPreferred', x.number, x.isPreferred);
    });
    return phoneArray;
  }
  setExistingEmailAddresses(emailAddresses: Email[]): FormArray {
    const emailFormArray = new FormArray([]);
      emailAddresses.forEach(x => {
        emailFormArray.push(this.fb.group({email: x.email}));
      });
      return emailFormArray;
  }

    setupEditForm() {
      this.personForm = this.fb.group({
        titleSelected: [''],
        firstname: ['', [Validators.required, Validators.maxLength(40)]],
        middlename: ['', Validators.maxLength(50)],
        lastname: ['', [Validators.required, Validators.maxLength(80)]],
        fullAddress: [''],
        addresses: this.fb.group({
          address1: ['', Validators.maxLength(80)],
          address2: ['', Validators.maxLength(80)],
          address3: ['', Validators.maxLength(80)],
          address4: ['', Validators.maxLength(80)],
          address5: ['', Validators.maxLength(80)],
          town: ['', Validators.maxLength(80)],
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

  addPhoneNumberItem() {
    this.phoneNumbers.push(this.createPhoneNumberItem());
  }
  createPhoneNumberItem(): FormGroup {
    return this.fb.group({
      phoneNumber: [''],
      phoneNumberType: 3,
      isPreferred: [false]
    });
  }

  addEmailItem() {
   this.emailAddresses.push(this.createEmailItem());
  }
  createEmailItem(): FormGroup {
    return this.fb.group({email: ['', [Validators.email]]});
  }

  savePerson() {

  }
}
