import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';
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
countries: any;
titles: any;
telephoneTypes: any;
listInfo: any;
titleSelected = 1;
coutrySelected = 232;
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
       title: person.title,
       firstname: person.firstName,
       middlename: person.middleName,
       lastname: person.lastName,
      //  contactBy: person.contactByEmail
      amlCompletedDate: person.amlCompletedDate,
      marketingPreferences: {events: person.marketingPreferences.events}
     });
     this.personForm.setControl('emailAddresses', this.setExistingEmailAddresses(person.emailAddresses));
     this.personForm.setControl('phoneNumbers', this.setExistingPhoneNumbers(person.phoneNumbers));

  }
  setExistingPhoneNumbers(phoneNumbers: PhoneNumber[]): FormArray {
    const phoneArray = new FormArray([]);
    phoneNumbers.forEach(x => {
      phoneArray.push(this.fb.group({
        phoneNumber: x.number,
        phoneNumberType: x.type
      }));
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
        title: [''],
        firstname: ['', [Validators.required, Validators.maxLength(40)]],
        middlename: ['', Validators.maxLength(50)],
        lastname: ['', [Validators.required, Validators.maxLength(80)]],
        addresses: this.fb.group({
          address1: ['', Validators.maxLength(80)],
          address2: ['', Validators.maxLength(80)],
          address3: ['', Validators.maxLength(80)],
          address4: ['', Validators.maxLength(80)],
          address5: ['', Validators.maxLength(80)],
          country: ['United Kingdom', [Validators.required, Validators.maxLength(50)]],
          postCode: ['', Validators.maxLength(6)] }),
        // contactBy: this.fb.group({
        //   email: [true],
        //   post: [false],
        //   phone: [false]
        // }),
        contactByEmail: true,
        contactByPhone: true,
        contactByPost: true,
        marketingPreferences: this.fb.group({
          marketBulletin: [false],
          offers: [false],
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
      phoneNumberType: ['']
      // favourite: ['']
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
