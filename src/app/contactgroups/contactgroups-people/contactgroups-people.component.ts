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
  isSelectedCollapsed = false;
  isOffCanvasVisible = false;
  personId: number;
  groupPersonId: number;
  contactGroupId: number;
  selectedPeople: Person[] = [];
  foundPeople: PeopleAutoCompleteResult[];
  contactGroupDetails: ContactGroup;
  contactGroupDetailsForm: FormGroup;
  personFinderForm: FormGroup;
  selectedPerson: Person;
  selectedPersonId: number;
  isCreateNewPersonVisible = false;
  isLoadingNewPersonVisible = false;
  errorMessage: any;
  constructor(
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

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
    this.personFinderForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe(data => {
        if (
          data.firstName &&
          data.lastName &&
          (data.phoneNumber || data.emailAddress)
        ) {
          this.isCreateNewPersonVisible = true;
        } else {
          this.isCreateNewPersonVisible = false;
        }
        this.findPerson(data);
      });
  }

  getContactGroupById(contactGroupId: number) {
    this.contactGroupService
      .getContactGroupbyId(contactGroupId)
      .subscribe(data => {
        this.contactGroupDetails = data;
        this.populateFormDetails(data);
        this.addSelectedPeople();
        console.log('contact group people', this.contactGroupDetails);
        this.isLoadingNewPersonVisible = false;
      });
  }
  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.selectedPerson = data;
      this.collectSelectedPeople(data);
      console.log('selected person details here', this.selectedPerson);
    });
  }
  populateFormDetails(contactGroup: ContactGroup) {
    if (this.contactGroupDetailsForm) {
      this.contactGroupDetailsForm.reset();
    }
    this.contactGroupDetails = contactGroup;
    this.contactGroupDetailsForm.patchValue({
      salutation: contactGroup.salutation,
      addressee: contactGroup.addressee,
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

  selectPerson(id: number) {
    console.log('selected person id', id);
    this.selectedPersonId = id;
    if (id !== 0) {
      this.isLoadingNewPersonVisible = true;
      this.getPersonDetails(id);
      this.getContactGroupById(this.contactGroupId);
      this.personFinderForm.reset();
    }
    this.isOffCanvasVisible = false;
    this.selectedPersonId = 0;
  }

  collectSelectedPeople(person: Person) {
    if (this.selectedPeople) {
      this.selectedPeople.push(person);
    }
  }

  addSelectedPeople() {
    if (this.selectedPeople.length) {
      this.selectedPeople.forEach(x => {
        this.contactGroupDetails.contactPeople.push(x);
      });
    }
  }

  showEditedPersonDetails(id) {
    console.log('id from child', id);
    if (id !== 0) {
      // this.getPersonDetails(id);
      console.log(this.isOffCanvasVisible);
      this.personFinderForm.reset();
    }
    this.selectedPersonId = 0;
  }

  saveContactGroup() {
    if (this.selectedPeople.length) {
      this.contactGroupService
        .updateContactGroup(this.contactGroupDetails)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => (this.errorMessage = <any>error)
        );
    }
  }
  onSaveComplete(): void {
    console.log('contacts saved', this.contactGroupDetails);
    window.history.back();
  }

  hideCanvas(event) {
    this.isOffCanvasVisible = event;
  }

  backToFinder(event) {
    if (event) {
      this.selectedPersonId = 0;
    }
  }

  showHideMarkPrefs(event, i) {
    event.preventDefault();
    event.stopPropagation();
    if (i >= 0) {
      this.isCollapsed[i] = !this.isCollapsed[i];
    } else {
      this.isSelectedCollapsed = !this.isSelectedCollapsed;
    }
  }

  showHideOffCanvas(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOffCanvasVisible = !this.isOffCanvasVisible;
  }
}
