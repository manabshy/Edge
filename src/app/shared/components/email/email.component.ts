import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { Email, Person } from '../../models/person';
import { StaffMember } from '../../models/staff-member';
import lodash from "lodash";

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit, OnChanges {
  @Input() contactGroup: ContactGroup;
  @Output() hideModal = new EventEmitter<boolean>();
  emailForm: FormGroup;
  groupedPeople = [];
  currentStaffMember: StaffMember;
  isContactGroupFinderVisible = false;
  showButton = false;
  constructor(private fb: FormBuilder, private storage: StorageMap,
    public staffMemberService: StaffMemberService) { }

  ngOnInit(): void {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe(res => this.currentStaffMember = res);
      }
      console.log('current user from storage in email....', this.currentStaffMember);
    });

    this.setupForm();
  }

  private setupForm() {
    this.emailForm = this.fb.group(({
      senderEmail: [this?.currentStaffMember?.email],
      recipientEmail: ['', Validators.required],
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
    this.groupedPeople = [];
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

  getSelectedContactGroup(group: ContactGroup) {
    if (group) {
      this.isContactGroupFinderVisible = false;

      this.contactGroup.contactPeople = [...this.contactGroup.contactPeople, ...group.contactPeople];
      const people = lodash.uniqBy(this.contactGroup.contactPeople, 'personId');
      console.log({people });

      this.getGroupedPeople(people);
    }

  }

  send() {
    console.log(this.emailForm?.value, 'send email form');
  }

  cancel() {
    this.emailForm?.reset();
    this.hideModal.emit();
  }
}
