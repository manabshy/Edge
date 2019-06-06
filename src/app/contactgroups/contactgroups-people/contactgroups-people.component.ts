import { Component, OnInit, OnChanges } from '@angular/core';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Person, BasicPerson } from 'src/app/core/models/person';
import { ContactGroup, PeopleAutoCompleteResult, ContactGroupsTypes, ContactType } from '../shared/contact-group';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from 'src/app/core/confirm-modal/confirm-modal.component';
import { Location } from '@angular/common';
import { WedgeError, SharedService } from 'src/app/core/services/shared.service';

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
  firstContactGroupPerson: Person;
  selectedPersonId: number;
  removedPersonId: number;
  newPerson: BasicPerson;
  isCreateNewPersonVisible = false;
  isLoadingNewPersonVisible = false;
  isCreateNewPerson = false;
  initialContactGroupLength = 0;
  isSubmitting = false;
  errorMessage: string;
  isSwitchTypeMsgVisible = false;
  public keepOriginalOrder = (a) => a.key;
  constructor(
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private _location: Location,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.contactGroupTypes =  ContactGroupsTypes;
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
    this.contactGroupId ? this.getContactGroupById(this.contactGroupId) : {};
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
        data.emailAddresses = [];
        data.emailAddresses.push({
          id: 0,
          email: data.emailAddress,
          isPreferred: true,
          isPrimaryWebEmail: true
        });
        data.phoneNumbers = [];
        data.phoneNumbers.push({
          number: data.phoneNumber,
          typeId: 3,
          isPreferred: true,
          comments: ''
        });
        this.newPerson = data;
        this.findPerson(data);
      });

      if (this.contactGroupId === 0){
        this.getContactGroupFirstPerson(this.personId);
      }
  }
  getContactGroupById(contactGroupId: number) {
    this.contactGroupService
      .getContactGroupbyId(contactGroupId)
      .subscribe(data => {
        this.contactGroupDetails = data;
        console.log('contact group details',  this.contactGroupDetails);
        this.initialContactGroupLength = this.contactGroupDetails.contactPeople.length;
        this.populateFormDetails(data);
        this.addSelectedPeople();
        if (this.removedPersonId) {
          this.removePerson(this.removedPersonId, false);
        }
        this.isLoadingNewPersonVisible = false;
      });
  }
  getContactGroupFirstPerson(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.firstContactGroupPerson = data;
      if(this.contactGroupId === 0){
        this.contactGroupDetails = {} as ContactGroup;
        if(this.contactGroupDetails){
          this.contactGroupDetails.contactType = ContactType.Individual;
          this.contactGroupDetails.contactPeople = [];
          this.contactGroupDetails.contactPeople.push(this.firstContactGroupPerson);
          this.setSalution();
          console.log('get group details', this.contactGroupDetails);
        }
      }
      console.log('get person details here', this.firstContactGroupPerson);
      console.log('get person id', this.personId);
    });
  }
  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      // this.firstContactGroupPerson = data;
      data.isNewPerson = true;
      this.selectedPerson = data;
      this.collectSelectedPeople(data);
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
  }

  findPerson(person: BasicPerson) {
    this.contactGroupService.getAutocompletePeople(person).subscribe(data => {
      this.foundPeople = data;
    });
  }
  createNewContactGroupPerson(event) {
    event.preventDefault();
    event.stopPropagation();
   this.isCreateNewPerson = true;
   if (this.isCreateNewPerson) {
     this.newPerson;
   }
   console.log('person from finder form 1', this.newPerson);
  }

  removePerson(id: number, isDialogVisible) {
    event.preventDefault();
    event.stopPropagation();
    this.removedPersonId = id;
    let index;
    if (this.selectedPeople.length) {
      index = this.selectedPeople.findIndex(x => x.personId === id);
      this.removeSelectedPeople(index);
      this.removedPersonId = 0;
    }
    index = this.contactGroupDetails.contactPeople.findIndex(x => x.personId === id);
    const fullName = this.contactGroupDetails.contactPeople[index] !== undefined ?
      this.contactGroupDetails.contactPeople[index].firstName + ' ' + this.contactGroupDetails.contactPeople[index].lastName : '';
    if (isDialogVisible) {
      this.confirmRemove(fullName).subscribe(res => {
        if (res) {
          this.removeSelectedPeople(index);
        }
      });
    } else { this.removeSelectedPeople(index); }
  }

  confirmRemove(fullName: string) {
    const subject = new Subject<boolean>();
    const initialState = {
      title: 'Are you sure you want to remove ' + fullName + '?',
      actions: ['No', 'Remove']
    };
    const modal = this.modalService.show(ConfirmModalComponent, {ignoreBackdropClick: true, initialState});
    modal.content.subject = subject;
    return subject.asObservable();
   }

  selectPerson(id: number) {
    if (id !== 0 && !this.checkDuplicateInContactGroup(id)) {
      this.selectedPersonId = id;
      this.isLoadingNewPersonVisible = true;
      this.getPersonDetails(id);
      this.getContactGroupById(this.contactGroupId);

      this.personFinderForm.reset();
    } else {
      return false;
    }
    this.isOffCanvasVisible = false;
    window.scrollTo(0, 0);
    this.selectedPersonId = 0;
  }

  collectSelectedPeople(person: Person) {
    if (this.selectedPeople) {
      this.selectedPeople.push(person);
    }
  }

  checkDuplicateInContactGroup(id) {
    let isDuplicate = false;
    this.contactGroupDetails.contactPeople.forEach(x => {
      if (x.personId === id) {
        isDuplicate = true;
      }
    })

    return isDuplicate;
  }

  addSelectedPeople() {
    if (this.selectedPeople.length) {
      this.selectedPeople.forEach(x => {
        this.contactGroupDetails.contactPeople.push(x);
        this.setSalution();
      });
      this.errorMessage = '';
      this.changeType();
    }
  }
  removeSelectedPeople(index: number) {
    if (this.selectedPeople.length) {
      this.selectedPeople.splice(index, 1);
      console.log('selected people', this.selectedPeople);
    } else {
      this.contactGroupDetails.contactPeople.splice(index, 1);
      console.log('contact group people', this.contactGroupDetails.contactPeople);
    }
    this.errorMessage = '';
    this.changeType();
    this.setSalution();
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

  changeType() {
    const contactPeople = this.contactGroupDetails.contactPeople.length;
    const contactGroupType = this.contactGroupDetailsForm.controls['contactType'];
    if (contactPeople > 2 && contactGroupType.value === ContactType.Individual) {
      contactGroupType.setValue(ContactType.Sharers);
      this.isSwitchTypeMsgVisible = true;
    } else  if (contactPeople < 2 && contactGroupType.value === ContactType.Sharers) {
      contactGroupType.setValue(ContactType.Individual);
      this.isSwitchTypeMsgVisible = true;
    } else {
      this.isSwitchTypeMsgVisible = false;
    }
  }

  saveContactGroup() {
    const contactPeople = this.contactGroupDetails.contactPeople.length;
    if (this.selectedPeople.length || contactPeople) {
      const contactGroup = {...this.contactGroupDetails, ...this.contactGroupDetailsForm.value};
      this.isSubmitting = true;
      this.errorMessage = '';
      this.contactGroupService
        .updateContactGroup(contactGroup)
        .subscribe( () => this.onSaveComplete(),
          (error: WedgeError) => {
              this.errorMessage = error.displayMessage;
              this.sharedService.showError(this.errorMessage);
              this.isSubmitting = false;
          });
    }
  }
  onSaveComplete(): void {
    console.log('contacts saved', this.contactGroupDetails);
    this._location.back();
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

    this.contactGroupDetailsForm.markAsDirty();
  }

  hideCanvas(event) {
    this.isOffCanvasVisible = event;
  }

  backToFinder(event) {
    if (event) {
      this.isCreateNewPerson = false;
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

  isTypeDisabled(key) {
    if (this.contactGroupDetails) {
      if (key === 2 && this.contactGroupDetails.contactPeople.length < 2) {
        return true;
      } else if (key === 1 && this.contactGroupDetails.contactPeople.length > 2) {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  canDeactivate(): boolean {
    if (this.contactGroupDetailsForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }

  cancel() {
    this._location.back();
  }
}
