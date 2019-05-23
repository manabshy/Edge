import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Person, BasicPerson } from 'src/app/core/models/person';
import { ContactGroup, PeopleAutoCompleteResult, ContactGroupsTypes, ContactType } from '../shared/contact-group';
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
  contactGroupTypes: any;
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
  initialContactGroupLength = 0;
  errorMessage: any;
  public keepOriginalOrder = (a) => a.key;
  constructor(
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.contactGroupTypes =  ContactGroupsTypes;
    console.log('contact types here', this.contactGroupTypes);
    this.route.params.subscribe(params => {
      this.contactGroupId = +params['contactGroupId'] || 0;
      this.groupPersonId = +params['groupPersonId'] || 0;
      this.personId = +params['personId'] || 0;
    });
    this.contactGroupDetailsForm = this.fb.group({
      salutation: [''],
      addressee: [''],
      comments: [''],
      isRelocationAgent: false,
      contactType: 0
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
        this.initialContactGroupLength = this.contactGroupDetails.contactPeople.length;
        this.populateFormDetails(data);
        this.addSelectedPeople();
        console.log('contact group people', this.contactGroupDetails);
        this.isLoadingNewPersonVisible = false;
      });
  }
  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      data.isNewPerson = true;
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
      comments: contactGroup.comments,
      isRelocationAgent: contactGroup.isRelocationAgent,
      contactType: contactGroup.contactType
    });
    console.log('contact type', this.contactGroupDetailsForm);
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
    this.isLoadingNewPersonVisible = true;
    if (id !== 0) {
      this.getPersonDetails(id);
      this.getContactGroupById(this.contactGroupId);

      this.personFinderForm.reset();
    }
    this.isOffCanvasVisible = false;
    window.scrollTo(0,0);
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
        this.setSalution();
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
      const contactGroup = {...this.contactGroupDetails, ...this.contactGroupDetailsForm.value};
      console.log('contact to add', contactGroup);
      this.contactGroupService
        .updateContactGroup(contactGroup)
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

   /**
   * Set the salutation and addressee based on contact type
   */
   setSalutationMobileApp(): void {
    const people = this.contactGroupDetails.contactPeople;
    let salutation = '';
    let addressee = '';
    // -->Set: people based on the fields
    const setNames = function (person, ...fields): string {
      return (person) ? fields
        .filter(i => person[i])
        .map(i => person[i])
        .join(' ') : '';
    };
    // -->Set: salutation and addressee based on the contact type group
    if (this.contactGroupDetails.contactType === ContactType.Individual) { // individual group
      // -->Set: 1 people case
      if (people.length === 1) {
        salutation = setNames(people[0], 'title', 'lastName');
        addressee = setNames(people[0], 'title', 'firstName', 'lastName');
      }
      // -->Set: 2 people group
      if (people.length === 2) {
        if (setNames(people[0], 'lastName') === setNames(people[1], 'lastName')) {
          salutation = setNames(people[0], 'title') + ' & ' + setNames(people[1], 'title') + ' ' + setNames(people[0], 'lastName');
          addressee = setNames(people[0], 'title') + ' & ' + setNames(people[1], 'title') + ' ' + setNames(people[0], 'firstName', 'lastName');
        } else {
          salutation = setNames(people[0], 'title', 'lastName') + ' & ' + setNames(people[1], 'title', 'lastName');

          addressee = setNames(people[0], 'title', 'firstName', 'lastName') + ' & '
            + setNames(people[1], 'title', 'firstName', 'lastName');
        }
      }
    } else if (this.contactGroupDetails.contactType === ContactType.Sharers) { // share group
      // Set: multiple people
      if (people.length > 0) {
        people.map(p => {
          if (salutation.length <= 0) {
            salutation += setNames(p, 'title', 'lastName');
            addressee += setNames(p, 'title', 'firstName', 'lastName');
          } else {
            salutation += ' & ' + setNames(p, 'title', 'lastName');
            addressee += ' & ' + setNames(p, 'title', 'firstName', 'lastName');
          }
        });
      }
    } else if (this.contactGroupDetails.contactType === ContactType.CompanyContact ||
      this.contactGroupDetails.contactType === ContactType.ReloContact) { // company && relo company
      // -->Set: 1 people case
      if (people.length >= 1) {
        salutation = setNames(people[0], 'title', 'lastName');
        addressee = setNames(people[0], 'title', 'firstName', 'lastName');
      }
    }
    // -->Set: salutation
    this.contactGroupDetailsForm.patchValue({
      salutation: salutation,
      addressee: addressee
    }, {onlySelf: false});
    console.log('salution:', salutation, 'addressee:', addressee);
  }
  setSalution() {
    const people = this.contactGroupDetails.contactPeople;
    let salutation = '';
    let addressee = '';
    let counter = 0;
    let seperator = '';
    people.forEach(person => {
      seperator = counter === 0 ? '' : (counter === people.length - 1 ? ' & ' : ' , ');
      addressee += seperator + person.addressee;
      salutation += seperator + person.title + ' ' + person.lastName;
      counter++;
    });
    this.contactGroupDetailsForm.patchValue({
      salutation: salutation,
      addressee: addressee
    }, {onlySelf: false});
    console.log('salution:', salutation, 'addressee:', addressee);
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
