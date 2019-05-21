import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  selectedPerson: Person;
  foundPersonId: number;
  showCreateNewPerson: boolean = false;
  constructor(private contactGroupService: ContactGroupsService,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) { }

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
       if(data.firstName && data.lastName && (data.phoneNumber || data.emailAddress)) {
        this.showCreateNewPerson = true;
       } else {
        this.showCreateNewPerson = false;
       }
       this.findPerson(data);
      });

  }

  getContactGroupById(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      this.contactGroupDetails = data;
      this.populateFormDetails(data);
    });
  }
  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.selectedPerson = data;
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
    });
  }

  removePerson(event, id: number) {
    event.preventDefault();
    event.stopPropagation();
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
 selectPerson(id: number ) {
  console.log('selected person id', id);
  this.foundPersonId = id;
  this.getPersonDetails(id);
 }
}
