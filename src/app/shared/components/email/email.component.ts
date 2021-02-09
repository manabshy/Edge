import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { Email, Person } from '../../models/person';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit, OnChanges {
  @Input() contactGroup: ContactGroup;
  emailFormGroup: FormGroup;
  groupedPeople = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.emailFormGroup = this.fb.group(({
      senderEmail: [''],
      recipientEmail: [''],
      ccInternalEmail: [''],
      ccExternalEmail: [''],
      subject: [''],
      body: ['', Validators.required]
    }));
  }

  ngOnChanges() {
    if (this.contactGroup) {
      console.log(this.contactGroup, 'group');
      this.getGroupedPeople(this.contactGroup.contactPeople);
    }
  }

  getGroupedPeople(people: Person[]) {
    people?.forEach(x => {
      const item = { label: x.addressee, value: x.addressee, items: this.getEmails(x.emailAddresses) };
      this.groupedPeople.push(item);
      console.log('group', this.groupedPeople);
    });
  }

  getEmails(emailAddresses: Email[]) {
    const emails = [];
    emailAddresses.forEach(x => emails.push({ name: x.email, value: x.email }));
    return emails;
  }

  send() { }
}
