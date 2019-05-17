import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/core/models/person';
import { ContactGroup } from '../shared/contact-group';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-contactgroups-people',
  templateUrl: './contactgroups-people.component.html',
  styleUrls: ['./contactgroups-people.component.scss']
})
export class ContactgroupsPeopleComponent implements OnInit {
  isCollapsed = {};
  personId: number;
  groupPersonId: number;
  contactGroupId: number;
  contactPeople: Person[];
  contactGroupDetails: ContactGroup;
  contactGroupDetailsForm: FormGroup;
  constructor(private contactGroupService: ContactGroupsService, private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {
     this.route.params.subscribe(params => {
       this.contactGroupId = +params['contactGroupId'] || 0;
       this.groupPersonId = +params['groupPersonId'] || 0;
       this.personId = +params['personId'] || 0;
      });
      this.contactGroupDetailsForm = this.fb.group({
       salutation: [''],
       addressee: [''],
       comments: ['']
      });
     this.getContactGroupById(this.contactGroupId);
  }

  getContactGroupById(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      this.contactGroupDetails = data;
      this.populateFormDetails(data);
      console.log('contact group people', this.contactGroupDetails);
    });
  }
  populateFormDetails(contactGroup: ContactGroup) {
    if (this.contactGroupDetailsForm) {
      this.contactGroupDetailsForm.reset();
    }
      this.contactGroupDetails = contactGroup;
      this.contactGroupDetailsForm.patchValue({
        salutation: contactGroup.salutation,
        addressee : contactGroup.addressee,
        comments: contactGroup.comments
      });
  }

  removePerson(event, id: number) {
    event.preventDefault();
    event.stopPropagation();
    console.log('id of person to be removed is:', id);
  }

  showHideMarkPrefs(event, i) {
    event.preventDefault();
    event.stopPropagation();
    this.isCollapsed[i] = !this.isCollapsed[i];
  }
}
