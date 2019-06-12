import { Component, OnInit, OnChanges, Renderer2 } from '@angular/core';
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
  addedPerson: Person;
  addedContactGroup: any;
  firstContactGroupPerson: Person;
  selectedPersonId: number;
  removedPersonIds: any[] = [];
  newPerson: BasicPerson;
  isCreateNewPersonVisible = false;
  isLoadingNewPersonVisible = false;
  isCreateNewPerson = false;
  isNewContactGroup = false;
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
    private sharedService: SharedService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.contactGroupTypes =  ContactGroupsTypes;
    this.route.params.subscribe(params => {
      this.contactGroupId = +params['contactGroupId'] || 0;
      this.groupPersonId = +params['groupPersonId'] || 0;
      this.personId = +params['personId'] || 0;
    });
    this.route.queryParams.subscribe(params => {
      this.isNewContactGroup = params['isNewContactGroup'] || false;
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

      let contactTypeField = this.contactGroupDetailsForm.controls.contactType;
      contactTypeField.valueChanges
        .subscribe(data=>{
          if(data && data !== this.contactGroupDetails.contactType && contactTypeField.pristine) {
            this.isSwitchTypeMsgVisible = true;
          } else {
            this.isSwitchTypeMsgVisible = false;
          }
        })

      if (this.contactGroupId === 0) {
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
        if (this.removedPersonIds.length) {
          this.removedPersonIds.forEach(x => {
            this.removePerson(x, false);
          })
        }
      });
  }
  getContactGroupFirstPerson(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      data.isMainPerson = true;
      this.firstContactGroupPerson = data;
      if (this.contactGroupId === 0) {
        this.contactGroupDetails = {} as ContactGroup;
        if (this.contactGroupDetails) {
          this.contactGroupDetails.contactType = ContactType.Individual;
          this.contactGroupDetails.contactPeople = [];
          this.contactGroupDetails.contactPeople.push(this.firstContactGroupPerson);
          this.setSalution();
          this.isSwitchTypeMsgVisible = false;
          console.log('get group details', this.contactGroupDetails);
        }
      }
      console.log('get person details here', this.firstContactGroupPerson);
      console.log('get person id', this.personId);
    });
  }
  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      data.isNewPerson = true;
      this.selectedPerson = data;
      this.addedPerson = data;
      console.log('selected person here.....', this.selectedPerson);
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

  setMainPerson(id: number) {
   this.contactGroupDetails.contactPeople.forEach((x: Person) => {
    if (x.personId === id) {
      x.isMainPerson = true;
    } else {
      x.isMainPerson = false;
    }
   });
  }
  removePerson(id: number, isDialogVisible) {
    event.preventDefault();
    event.stopPropagation();
    let index;
    index = this.contactGroupDetails.contactPeople.findIndex(x => x.personId === id);
    const fullName = this.contactGroupDetails.contactPeople[index] !== undefined ?
      this.contactGroupDetails.contactPeople[index].firstName + ' ' + this.contactGroupDetails.contactPeople[index].lastName : '';
    if (isDialogVisible) {
      this.confirmRemove(fullName).subscribe(res => {
        if (res) {
          this.removeSelectedPeople(this.contactGroupDetails.contactPeople, index);
          this.removedPersonIds.push(id);
        }
      });
    } else {
      this.removeSelectedPeople(this.contactGroupDetails.contactPeople, index);
      if(this.removedPersonIds.indexOf(id) < 0) {
        this.removedPersonIds.push(id);
      }
    }
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
    if (this.isNewContactGroup) {
      this.selectedPersonId = id;
      this.isLoadingNewPersonVisible = true;
      this.getPersonDetails(id);
      this.contactGroupDetails = {} as ContactGroup;
      this.contactGroupDetails.contactPeople = [];
      if (this.selectedPerson) {
         this.contactGroupDetails.contactPeople.push(this.selectedPerson);
      }
      this.isNewContactGroup = false;
    }
     else if (id !== 0 && !this.checkDuplicateInContactGroup(id)) {
      this.selectedPersonId = id;
      this.isLoadingNewPersonVisible = true;
      this.getPersonDetails(id);
      this.getContactGroupById(this.contactGroupId);

      this.personFinderForm.reset();
    } else {
      return false;
    }
    this.isOffCanvasVisible = false;
    this.renderer.removeClass(document.body, 'no-scroll');
    window.scrollTo(0, 0);
    this.selectedPersonId = 0;
  }

  collectSelectedPeople(person: Person) {
    if (this.selectedPeople) {
      this.selectedPeople.push(person);
      this.addSelectedPeople();
    }
  }

  checkDuplicateInContactGroup(id) {
    let isDuplicate = false;
    if (!this.isNewContactGroup) {
      this.contactGroupDetails.contactPeople.forEach(x => {
        if (x.personId === id) {
          isDuplicate = true;
        }
      })

    }
    return isDuplicate;
  }

  addSelectedPeople() {
    if (this.selectedPeople.length) {
      this.selectedPeople.forEach(x => {
        if (!this.checkDuplicateInContactGroup(x.personId)){
          this.contactGroupDetails.contactPeople.push(x);
          this.setSalution();
          this.isLoadingNewPersonVisible = false;
        }
      });
      this.errorMessage = '';
    }
  }
  removeSelectedPeople(people, index: number) {
    people.splice(index, 1);
    this.errorMessage = '';
    this.setSalution();
  }

  showAddedPersonDetails(id) {
    console.log('id from child', id);
    if (id !== 0) {
      this.selectedPersonId = id;
      this.getPersonDetails(id);
      console.log('selected person id', this.selectedPersonId);
      console.log(this.isOffCanvasVisible);
    }
    this.selectedPersonId = 0;
  }

  saveContactGroup() {
    const contactPeople = this.contactGroupDetails.contactPeople.length;
    if (this.selectedPeople.length || contactPeople) {
      const contactGroup = {...this.contactGroupDetails, ...this.contactGroupDetailsForm.value};
      this.isSubmitting = true;
      this.errorMessage = '';
      if (this.contactGroupDetails.contactGroupId) {
        this.contactGroupService
        .updateContactGroup(contactGroup)
        .subscribe( () => this.onSaveComplete(),
          (error: WedgeError) => {
              this.errorMessage = error.displayMessage;
              this.sharedService.showError(this.errorMessage);
              this.isSubmitting = false;
          });
      } else {
        this.contactGroupService
        .addContactGroup(contactGroup)
        .subscribe( () => this.onSaveComplete(),
          (error: WedgeError) => {
              this.errorMessage = error.displayMessage;
              this.sharedService.showError(this.errorMessage);
              this.isSubmitting = false;
          });
      }
    }
  }
  onSaveComplete(): void {
    console.log('contacts saved', this.contactGroupDetails);
    this._location.back();
  }

  setSalution() {
    let people = this.contactGroupDetails.contactPeople;
    let salutation = '';
    let addressee = '';
    let counter = 0;
    let seperator = '';
    let type = 0;
    people.forEach(person => {
      seperator = counter === 0 ? '' : (counter === people.length - 1 ? ' & ' : ' , ');
      addressee += seperator + person.addressee;
      salutation += seperator + person.title + ' ' + person.lastName;
      counter++;
    });

    if (this.contactGroupDetails.contactType !== ContactType.CompanyContact) {
      switch (true) {
        case people.length > 2:
        case people.length === 2 && this.contactGroupDetails.contactType === ContactType.Sharers:
          type = 2;
          break;
        default:
          type = 1;
      }
    } else {
      type = 3;
    }

    this.contactGroupDetailsForm.patchValue({
      salutation: salutation,
      addressee: addressee,
      contactType: type
    }, {onlySelf: false});

    this.contactGroupDetailsForm.markAsDirty();
  }

  hideCanvas(event) {
    this.isOffCanvasVisible = event;
    this.renderer.removeClass(document.body, 'no-scroll');
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
    if (this.isOffCanvasVisible) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
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
