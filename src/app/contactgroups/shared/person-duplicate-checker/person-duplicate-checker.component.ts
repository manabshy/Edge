import { Component, OnInit, Renderer2, Input, Output, EventEmitter, OnChanges, ɵConsole } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PotentialDuplicateResult, ContactGroup, ContactType } from '../contact-group';
import { BasicPerson, Person } from 'src/app/shared/models/person';
import { ContactGroupsService } from '../contact-groups.service';
import { CompanyService } from 'src/app/company/shared/company.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/core/services/shared.service';
import { InfoService } from 'src/app/core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-person-duplicate-checker',
  templateUrl: './person-duplicate-checker.component.html',
  styleUrls: ['./person-duplicate-checker.component.scss']
})
export class PersonDuplicateCheckerComponent implements OnInit, OnChanges {
  @Input() contactGroupDetails: ContactGroup;
  @Input() isOffCanvasVisible: boolean;
  @Input() isCreateNewPerson = false;
  @Input() searchTerm: string;
  @Output() addedPersonDetails = new EventEmitter<Person>();
  @Output() selectedPerson = new EventEmitter<Person>();
  @Output() isCanvasHidden = new EventEmitter<boolean>();
  @Output() makeButtonVisible = new EventEmitter<boolean>();
  // selectedPerson: Person;
  isCompanyContactGroup: boolean = false;
  personFinderForm: FormGroup;
  potentialDuplicatePeople: PotentialDuplicateResult;
  selectedPersonId: number;
  isPersonCanvasVisible = false;
  isCreateNewPersonVisible = false;
  newPerson: BasicPerson;

  constructor(private fb: FormBuilder,
    private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private router: Router,
    private renderer: Renderer2) { }

  ngOnInit() {
    this.personFinderForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      fullName: [this.searchTerm],
      emailAddress: [''],
      phoneNumber: ['']
    });
    if (this.searchTerm) {
      this.findPotentialDuplicatePerson(this.personFinderForm.value);
    }
    this.personFinderForm.valueChanges
      .pipe(debounceTime(750))
      .subscribe((data: BasicPerson) => {
        if (
          data.fullName &&
          (data.phoneNumber || data.emailAddress)
        ) {
          this.isCreateNewPersonVisible = true;
          this.makeButtonVisible.emit(true);
        } else {
          this.isCreateNewPersonVisible = false;
          this.makeButtonVisible.emit(false);
        }
        // data.emailAddresses = [];
        // data.emailAddresses.push({
        //   id: 0,
        //   email: data.emailAddress,
        //   isPreferred: true,
        //   isPrimaryWebEmail: true
        // });
        // data.phoneNumbers = [];
        // data.phoneNumbers.push({
        //   number: data.phoneNumber,
        //   typeId: 3,
        //   isPreferred: true,
        //   comments: ''
        // });
        // this.newPerson = data;
        this.findPotentialDuplicatePerson(data);
      });
  }

  ngOnChanges() {
    if (this.contactGroupDetails?.contactType === ContactType.CompanyContact) {
      this.isCompanyContactGroup = true;
    }
    if (this.isOffCanvasVisible) {
      this.isPersonCanvasVisible = this.isOffCanvasVisible;
    }

  }
  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      if (data) {
        data.isNewPerson = true;
        this.selectedPerson.emit(data);
      }
    });
  }

  findPotentialDuplicatePerson(person: BasicPerson) {
    if (person?.fullName) {
      this.contactGroupService.getPotentialDuplicatePeople(person).subscribe(data => {
        this.potentialDuplicatePeople = data;

        this.newPerson = { ...data };
        this.newPerson.emailAddress = this.personFinderForm.get('emailAddress')?.value;
        this.newPerson.phoneNumber = this.personFinderForm.get('phoneNumber')?.value;
        this.checkDuplicatePeople(person);
      });
    }
  }

  checkDuplicatePeople(person: BasicPerson) {
    const matchedPeople = [];
    if (this.potentialDuplicatePeople) {
      if (this.potentialDuplicatePeople.matches && this.potentialDuplicatePeople.matches.length) {
        this.potentialDuplicatePeople.matches.forEach((x) => {
          const firstName = x.firstName ? x.firstName.toLowerCase() : '';
          const middleName = x.middleNames ? x.middleNames.toLowerCase() : '';
          const lastName = x.lastName ? x.lastName.toLowerCase() : '';
          const fullName = middleName ? `${firstName} ${middleName} ${lastName} ` : `${firstName} ${lastName} `;
          const sameName = fullName.toLowerCase().trim() === person.fullName.toLowerCase().trim();
          const email = x.emailAddresses ? x.emailAddresses.filter(x => x === person.emailAddress) : [];
          const phone = x.phoneNumbers ?
            x.phoneNumbers.filter(x => x === person.phoneNumber ? person.phoneNumber.replace(/\s+/g, '') : '') : [];
          const samePhone = phone[0] ? phone[0].toString() === person.phoneNumber.replace(/\s+/g, '') : false;
          const sameEmail = email[0] ? email[0].toLowerCase() === person.emailAddress : false;
          switch (true) {
            case sameName && sameEmail && samePhone:
              x.matchScore = 10;
              break;
            case (sameName) && (sameEmail || samePhone):
              x.matchScore = 7;
              break;
            default:
              x.matchScore = 0;
          }
          matchedPeople.push(x);
        });
      }
      this.potentialDuplicatePeople.matches = matchedPeople;
    }
  }

  selectPerson(id: number) {
    if (id !== 0 && !this.sharedService.checkDuplicateInContactGroup(this.contactGroupDetails, id)) {
      this.selectedPersonId = id;
      // this.isLoadingNewPersonVisible = true;
      this.getPersonDetails(id);
      this.personFinderForm.reset();
    } else {
      return false;
    }

    this.isPersonCanvasVisible = false;
    this.renderer.removeClass(document.body, 'no-scroll');
    window.scrollTo(0, 0);
    this.selectedPersonId = 0;
  }

  isAlreadyInContactgroup(id: number) {
    return this.sharedService.checkDuplicateInContactGroup(this.contactGroupDetails, id);
  }

  // TODO: Replace this with a directive
  /* Only allow spaces, dashes, the plus sign and digits */
  phoneNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    const isCodeNotAllowed = charCode > 31 && charCode !== 45 && charCode !== 43 && charCode !== 32 && (charCode < 48 || charCode > 57);
    if (isCodeNotAllowed) {
      return false;
    }
    return true;

  }

  showHideOffCanvas(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isPersonCanvasVisible = !this.isPersonCanvasVisible;
    if (this.isPersonCanvasVisible) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
    this.isCanvasHidden.emit(this.isPersonCanvasVisible);
    console.log('canvas condition', this.isPersonCanvasVisible);
  }

  getAddedPersonDetails(person: Person) {
    if (person) {
      this.addedPersonDetails.emit(person);
      console.log('new person here..', person);
    }

  }

  createNewContactGroupPerson(event) {
    // event.preventDefault();
    // event.stopPropagation();
    // this.isCreateNewPerson = true;
    this.router.navigate(['contact-centre', 'detail', 0, 'edit'], { queryParams: { newPerson: JSON.stringify(this.newPerson) } })

  }
  hideCanvas(event) {
    this.isPersonCanvasVisible = event;
    this.isCanvasHidden.emit(true);
    console.log('is canvas visible here', event);
    this.personFinderForm.reset();
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  backToFinder(otherPersonToAdd) {
    this.isCreateNewPerson = false;
    if (otherPersonToAdd) {
      this.personFinderForm.reset();
    }
  }
}
