import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person, BasicPerson } from 'src/app/core/models/person';
import { ContactGroup, PeopleAutoCompleteResult } from '../shared/contact-group';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-contactgroups-people',
  templateUrl: './contactgroups-people.component.html',
  styleUrls: ['./contactgroups-people.component.scss']
})
export class ContactgroupsPeopleComponent implements OnInit {
  isCollapsed = {};
  isOffCanvasVisible = false;
  personId: number;
  groupPersonId: number;
  contactGroupId: number;
  contactPeople: Person[];
  foundPeople: PeopleAutoCompleteResult[];
  contactGroupDetails: ContactGroup;
  contactGroupDetailsForm: FormGroup;
  personFinderForm: FormGroup;
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
      this.personFinderForm = this.fb.group({
       firstName: [''],
       lastName: [''],
       emailAddress: [''],
       phoneNumber: ['']
      });
     this.getContactGroupById(this.contactGroupId);
     this.personFinderForm.valueChanges.pipe(debounceTime(1000)).subscribe(data => {
       this.findPerson(data);
       console.log('from person finder', data);
      });

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

  findPerson(person: BasicPerson) {
    this.contactGroupService.getAutocompletePeople(person).subscribe(data => {
      this.foundPeople = data;
      console.log('found people', this.foundPeople);
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

  showHideOffCanvas(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOffCanvasVisible = !this.isOffCanvasVisible;
  }
}
