import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Person, BasicPerson } from 'src/app/core/models/person';
import { ContactGroup, PeopleAutoCompleteResult, ContactGroupsTypes,
         ContactType, CompanyAutoCompleteResult, Company, PotentialDuplicateResult, ContactGroupsNote } from '../shared/contact-group';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from 'src/app/core/confirm-modal/confirm-modal.component';
import { Location } from '@angular/common';
import { WedgeError, SharedService } from 'src/app/core/services/shared.service';
import { FormErrors, ValidationMessages } from 'src/app/core/shared/app-constants';
import { AppUtils } from 'src/app/core/shared/utils';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contactgroups-people',
  templateUrl: './contactgroups-people.component.html',
  styleUrls: ['./contactgroups-people.component.scss']
})
export class ContactgroupsPeopleComponent implements OnInit {
  listInfo: any;
  warnings: any;
  warning: any;
  isCollapsed = {};
  isSelectedCollapsed = false;
  @ViewChild('offCanvasContent') offCanvasContent: ElementRef;
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
  isLoadingDetails = false;
  isCreateNewPersonVisible = false;
  isLoadingNewPersonVisible = false;
  isEditingSelectedPerson = false;
  isEditingSelectedCompany = false;
  isCreateNewPerson = false;
  isNewContactGroup = false;
  isSigner = false;
  potentialDuplicatePeople: PotentialDuplicateResult;
  initialContactGroupLength = 0;
  isSubmitting = false;
  errorMessage: WedgeError;
  isLoadingCompaniesVisible = false;
  orderFoundPeople = 'matchScore';
  reverse = true;
  isTypePicked = false;
  isNewCompanyContact = false;
  foundCompanies: CompanyAutoCompleteResult[];
  @ViewChild('companyNameInput') companyNameInput : ElementRef;
  searchCompanyTermBK: string = '';
  selectedCompanyDetails: Company;
  selectedCompanyId: number;
  companyFinderForm: FormGroup;
  isCloned: boolean;
  clonedContact: ContactGroup;
  contactGroupNotes: ContactGroupsNote[];
  formErrors = FormErrors;
  isCompanyAdded = true;
  get dataNote() {
    if(this.contactGroupDetails) {
      return {
        group: this.contactGroupDetails,
        people: this.contactGroupDetails.contactPeople,
        notes: this.contactGroupNotes
      }
    }
    return null;
  }

  get isMaxPeople() {
    if(this.contactGroupDetails){
      return this.contactGroupDetails.contactPeople.length && this.contactGroupDetails.contactType === ContactType.CompanyContact;
    }
    return false;
  }
  get companyAlert() {
    return this.contactGroupDetails.contactType === ContactType.CompanyContact && !this.selectedCompanyDetails;
  }

  get isAMLCompleted() {
    return this.contactGroupDetails && (!!this.contactGroupDetails.companyAmlCompletedDate || this.contactGroupDetails.isAmlCompleted)
  }
  public keepOriginalOrder = (a) => a.key;

  constructor(
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private _location: Location,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.contactGroupTypes =  ContactGroupsTypes;
    this.route.params.subscribe(params => {
      this.contactGroupId = +params['contactGroupId'] || 0;
      this.groupPersonId = +params['groupPersonId'] || 0;
      this.personId = +params['personId'] || 0;
    });
    this.init();
  }

  init() {
    // this.listInfo = this.sharedService.dropdownListInfo;
    this.sharedService.getDropdownListInfo().subscribe(data=>{
      this.listInfo = data;
      this.warnings = this.listInfo.result.personWarningStatuses;
    });
    this.removedPersonIds = [];
    this.selectedPeople = [];
    if(!this.contactGroupId) {
      this.route.queryParams.subscribe(params => {
        this.isNewContactGroup = (!AppUtils.holdingSelectedPeople && params['isNewContactGroup']) || false;
        this.isSigner = params['isSigner'] || false;
      });
    }
    this.isSubmitting = false;
    this.companyFinderForm = this.fb.group({
      companyName: ['', Validators.required],
    });
    this.contactGroupDetailsForm = this.fb.group({
      salutation: [''],
      addressee: [''],
      comments: [''],
      isRelocationAgent: false,
      contactType: ContactType.Individual
    });
    this.personFinderForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      fullName: [''],
      emailAddress: [''],
      phoneNumber: ['']
    });
    if(AppUtils.holdingSelectedPeople || AppUtils.holdingSelectedCompany) {
      AppUtils.holdingSelectedPeople ? this.selectedPeople = AppUtils.holdingSelectedPeople : null;
      AppUtils.holdingSelectedCompany ? this.selectedCompanyDetails = AppUtils.holdingSelectedCompany : null;
      AppUtils.holdingSelectedCompany ? this.selectCompany(this.selectedCompanyDetails) : null;
      this.removedPersonIds = AppUtils.holdingRemovedPeople;
      this.isCloned = AppUtils.holdingCloned;
      AppUtils.holdingSelectedPeople = null;
      AppUtils.holdingSelectedCompany = null;
      AppUtils.holdingRemovedPeople = null;
      AppUtils.holdingCloned = false;
      this.isTypePicked = true;
    }

    if(this.contactGroupId) {
      this.getContactGroupById(this.contactGroupId)
    } else {
      this.contactGroupDetails = {} as ContactGroup;
      this.contactGroupDetails.contactPeople = [];
      this.contactGroupDetails.contactType = AppUtils.holdingContactType || ContactType.Individual;
      if(AppUtils.holdingContactType === ContactType.CompanyContact) {
        this.isNewCompanyContact = true;
      }
      AppUtils.holdingContactType = null;
      this.addSelectedPeople();
    }
    this.personFinderForm.valueChanges
      .pipe(debounceTime(400))
      .subscribe(data => {
        if (
          data.fullName &&
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
        console.log('new person initialised', this.newPerson);
        this.findPotentialDuplicatePerson(data);
      });

    this.companyFinderForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(data => this.findCompany(data));
    this.getContactGroupNotes(this.contactGroupId);
  }

  isCompanyContactGroup(isSelectedTypeCompany: boolean) {
    this.contactGroupDetails = {} as ContactGroup;
    this.contactGroupDetails.contactPeople = [];
    if (isSelectedTypeCompany) {
      this.contactGroupDetails.contactType = ContactType.CompanyContact;
      this.isNewCompanyContact = true;
    } else {
      this.contactGroupDetails.contactType = ContactType.Individual;
    }
    if (this.personId) {
      this.getContactGroupFirstPerson(this.personId, isSelectedTypeCompany);
    }
    this.isTypePicked = true;
  }

  getContactGroupById(contactGroupId: number) {
    this.isLoadingDetails = true;
    this.contactGroupService
      .getContactGroupbyId(contactGroupId)
      .subscribe(data => {
        this.contactGroupDetails = data;
        this.initialContactGroupLength = this.contactGroupDetails.contactPeople.length;
        this.populateFormDetails(data);
        this.addSelectedPeople();
        if (this.isCloned) {
          this.contactGroupDetails.referenceCount = 0;
          this.contactGroupDetails.contactGroupId = 0;
        }
        this.isTypePicked = true;
        this.isLoadingDetails = false;
      });
  }
  getContactGroupNotes(contactGroupId: number){
    this.contactGroupService.getContactGroupNotes(contactGroupId).subscribe(data=> this.contactGroupNotes = data);
  }
  getContactGroupFirstPerson(personId: number, isSelectedTypeCompany: boolean) {
    this.isLoadingNewPersonVisible = true;
    this.contactGroupService.getPerson(personId).subscribe(data => {
      data.isMainPerson = true;
      this.firstContactGroupPerson = data;
      if (this.contactGroupId === 0) {
        if (this.contactGroupDetails) {
          if (!isSelectedTypeCompany) {
            this.contactGroupDetails.contactType = ContactType.Individual;
          }
          this.contactGroupDetails.contactPeople = [];
          this.contactGroupDetails.contactPeople.push(this.firstContactGroupPerson);
          this.setSalutation();
          this.isLoadingNewPersonVisible = false;
        }
      }
    });
  }
  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      data.isNewPerson = true;
      this.selectedPerson = data;
      this.addedPerson = data;
      this.collectSelectedPeople(data);
    });
  }

  populateFormDetails(contactGroup: ContactGroup) {
    if (this.contactGroupDetailsForm) {
      this.contactGroupDetailsForm.reset();
    }
    if(contactGroup.companyName) {
      this.companyFinderForm.get('companyName').setValue(contactGroup.companyName);
      this.getCompanyDetails(contactGroup.companyId);
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
  findCompany(searchTerm: string) {
    this.isLoadingCompaniesVisible = true;
    this.contactGroupService.getAutocompleteCompany(searchTerm).subscribe(data => {
      this.foundCompanies = data;
      this.isLoadingCompaniesVisible = false;
    });
  }

  findPotentialDuplicatePerson(person: BasicPerson) {
    this.contactGroupService.getPotentialDuplicatePeople(person).subscribe(data => {
      this.potentialDuplicatePeople = data;
      if (data) {
      // this.newPerson = {} as  BasicPerson;
      this.newPerson.firstName = data.firstName,
      this.newPerson.middleName = data.middleName,
      this.newPerson.lastName = data.lastName;
      }
      console.log(' for new person', data);
      console.log('new person', this.newPerson);
      this.checkDuplicatePeople(person);
    });
  }
  checkDuplicatePeople(person: BasicPerson) {
   const matchedPeople = [];
   if (this.potentialDuplicatePeople) {
      this.potentialDuplicatePeople.matches.forEach((x) => {
        const firstName = x.firstName ? x.firstName.toLowerCase() : '';
        const middleName = x.middleNames ? x.middleNames.toLowerCase() : '';
        const lastName = x.lastName ? x.lastName.toLowerCase() : '';
        const fullName =  middleName ? `${firstName} ${middleName} ${lastName} ` :  `${firstName} ${lastName} `;
        const sameName = fullName.toLowerCase().trim() === person.fullName.toLowerCase().trim();
        const email = x.emailAddresses.filter(x => x === person.emailAddress);
        const phone = x.phoneNumbers.filter(x => x === person.phoneNumber ? person.phoneNumber.replace(/\s+/g, '') : '');
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
      this.potentialDuplicatePeople.matches = matchedPeople;
   }
  }
  createNewContactGroupPerson(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isCreateNewPerson = true;
    if (this.isCreateNewPerson) {
      this.newPerson;
    }
    setTimeout(() => {
      this.offCanvasContent.nativeElement.scrollTo(0, 0);
    });
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

  editSelectedCompany(id: number, newCompany?: boolean) {
    event.preventDefault();
    this.isEditingSelectedCompany = true;
    this.contactGroupBackUp();
    let companyName;
    if(newCompany) {
      companyName = this.companyFinderForm.get("companyName").value;
    }
    this._router.navigate(['/company-centre/detail', id, 'edit'], {queryParams: {isNewCompany: newCompany, isEditingSelectedCompany: true, companyName: companyName }});
  }

  editSelectedPerson(id: number) {
    this.isEditingSelectedPerson = true;
    this.contactGroupBackUp();
    this._router.navigate(['../../edit'], {queryParams: {groupPersonId: id, isEditingSelectedPerson: true}, relativeTo: this.route});
  }

  contactGroupBackUp() {
    if(this.firstContactGroupPerson) {
      this.selectedPeople.push(this.firstContactGroupPerson);
    }
    AppUtils.holdingSelectedPeople = this.selectedPeople;
    AppUtils.holdingSelectedCompany = this.selectedCompanyDetails;
    AppUtils.holdingRemovedPeople = this.removedPersonIds;
    AppUtils.holdingContactType = this.contactGroupDetails.contactType;
    AppUtils.firstContactPerson = this.firstContactGroupPerson;
    AppUtils.holdingCloned = this.isCloned;
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
      if (this.removedPersonIds.indexOf(id) < 0) {
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

   initCompanySearch() {
    if(this.contactGroupDetails && this.contactGroupDetails.referenceCount){
      return;
    }
    this.selectedCompanyDetails = null;
    this.isCompanyAdded = false;
    if(this.companyFinderForm.get('companyName').value){
      this.companyFinderForm.get('companyName').setValue(this.searchCompanyTermBK);
    }
   }

   selectCompany(company: Company) {
    this.foundCompanies = null;
    this.selectedCompanyDetails = company;
    this.isCompanyAdded = true;
    this.searchCompanyTermBK = this.companyFinderForm.get('companyName').value;
    this.companyFinderForm.get('companyName').setValue(company.companyName);
    setTimeout(()=>{
      if(this.companyNameInput) {
        this.companyNameInput.nativeElement.scrollIntoView({block: 'center'});
      }
    })
   }

  getCompanyDetails(companyId: number) {
    this.contactGroupService.getCompany(companyId).subscribe(data => {
      this.selectedCompanyDetails = data;
    });
  }

  getAddress(address: any) {
    this.contactGroupDetails.companyAddress = address;
  }

  selectPerson(id: number) {
    if(this.removedPersonIds.indexOf(id) >= 0 ){
      this.removedPersonIds.splice(this.removedPersonIds.indexOf(id),1);
    }
    if (id !== 0 && !this.checkDuplicateInContactGroup(id)) {
      this.selectedPersonId = id;
      this.isLoadingNewPersonVisible = true;
      this.getPersonDetails(id);
      if (this.contactGroupId) {
        this.getContactGroupById(this.contactGroupId);
      }
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
    this.contactGroupDetails.contactPeople.forEach(x => {
      if (x.personId === id) {
        isDuplicate = true;
      }
    });
    return isDuplicate;
  }

  addSelectedPeople() {
    if (this.selectedPeople.length) {
      this.selectedPeople.forEach(x => {
        if (!this.checkDuplicateInContactGroup(x.personId)) {
          this.contactGroupDetails.contactPeople.push(x);
          this.setSalutation();
          this.isLoadingNewPersonVisible = false;
        }
      });
      if (this.removedPersonIds.length) {
        this.removedPersonIds.forEach(x => {
          this.removePerson(x, false);
        });
      }
      this.errorMessage = null;
    }
  }
  removeSelectedPeople(people, index: number) {
    people.splice(index, 1);
    this.errorMessage = null;
    this.setSalutation();
  }

  showAddedPersonDetails(id) {
    if (id !== 0) {
      this.selectedPersonId = id;
      this.getPersonDetails(id);
    }
    this.selectedPersonId = 0;
  }

  cloneContactGroup() {
     this.isCloned = true;
    if (this.isCloned) {
      this.contactGroupDetails.contactGroupId = 0;
      this.contactGroupDetails.referenceCount = 0;
    }
    this.contactGroupDetailsForm.markAsDirty();
  }
  saveContactGroup() {
    let validityCondition = this.contactGroupDetailsForm.valid;
    if(this.contactGroupDetails.contactType === ContactType.CompanyContact) {
      validityCondition = this.contactGroupDetailsForm.valid && this.companyFinderForm.valid;
    }
   if (validityCondition) {
     if (this.contactGroupDetailsForm.dirty || this.companyFinderForm.dirty) {
        const contactPeople = this.contactGroupDetails.contactPeople.length;
        if (this.selectedPeople.length || contactPeople) {
          let contactGroup = {...this.contactGroupDetails, ...this.contactGroupDetailsForm.value};
          this.isSubmitting = true;
          this.errorMessage = null;
          if (contactGroup.contactGroupId) {
            this.updateContactGroup(contactGroup);
          } else {
            this.addNewContactGroup(contactGroup);
          }
        }
     } else {
      this.onSaveComplete(this.contactGroupId);
     }
   } else {
     this.errorMessage = {} as WedgeError;
    this.errorMessage.displayMessage = 'Please correct validation errors';
   }
  }
  private addNewContactGroup(contactGroup: ContactGroup) {
    if (this.isNewCompanyContact) {
      if(!this.contactGroupDetails){
        this.contactGroupDetails = {} as ContactGroup;
        this.contactGroupDetails.contactPeople = [];
      }
      if (this.selectedCompanyDetails) {
        console.log(this.selectedCompanyDetails);
        this.isCompanyAdded = true;
        contactGroup.companyId = this.selectedCompanyDetails.companyId;
        contactGroup.companyName = this.selectedCompanyDetails.companyName;
        contactGroup.contactType = ContactType.CompanyContact;
        if(!this.contactGroupDetails.contactPeople.length) {
          this.contactGroupDetails.contactPeople.push(this.selectedPerson);
        }
        this.contactGroupService
        .addContactGroup(contactGroup)
        .subscribe(res => {
          this.onSaveComplete(res.result.contactGroupId);
        }, (error: WedgeError) => {
          this.errorMessage = error;
          this.sharedService.showError(this.errorMessage);
          this.isSubmitting = false;
        });
      } else {
        this.contactGroupDetails.contactPeople.push(this.selectedPerson);
        this.isCompanyAdded = false;
        this.isSubmitting = false;
        this.contactGroupDetails.contactType = ContactType.CompanyContact;
      }

    } else {
    this.contactGroupService
      .addContactGroup(contactGroup)
      .subscribe(res => {
        this.onSaveComplete(res.result.contactGroupId);
      }, (error: WedgeError) => {
        this.errorMessage = error;
        this.sharedService.showError(this.errorMessage);
        this.isSubmitting = false;
      });
    }
  }

  private updateContactGroup(contactGroup: ContactGroup) {
    if(contactGroup.companyName) {
      contactGroup.companyId = this.selectedCompanyDetails.companyId;
      contactGroup.companyName = this.selectedCompanyDetails.companyName;
    }
    this.contactGroupService
      .updateContactGroup(contactGroup)
      .subscribe(res => {
        this.onSaveComplete(res.result.contactGroupId);
      }, (error: WedgeError) => {
        this.errorMessage = error;
        this.sharedService.showError(this.errorMessage);
        this.isSubmitting = false;
      });
  }

  onSaveComplete(contactGroupId): void {
    this.toastr.success('Contact Group successfully saved');
    if(!contactGroupId) {
      this._location.back();
    } else {
      if(this.isSigner) {
        AppUtils.newSignerId = contactGroupId;
        this._location.back();
      }
      let url = this._router.url;
      let replacedId = this.contactGroupId;

      if(url.indexOf("people/"+replacedId) === -1) {
        replacedId = 0;
      }

      if(url.indexOf("?") >= 0) {
        url = url.substring(0,url.indexOf("?"));
      }

      url = url.replace('people/'+replacedId, 'people/'+contactGroupId);

      this._location.replaceState(url);
      this.contactGroupId = contactGroupId;
      this.init();
    }
  }

  setSalutation() {
    const people = this.contactGroupDetails.contactPeople;
    let salutation = '';
    let addressee = '';
    let counter = 0;
    let seperator = '';
    let type = ContactType.Individual;
    people.forEach(person => {
      seperator = counter === 0 ? '' : (counter === people.length - 1 ? ' & ' : ' , ');
      addressee += seperator + person.addressee;
      salutation += seperator + person.salutation;
      counter++;
    });
    if (this.contactGroupDetails.contactType === ContactType.CompanyContact) {
      type = ContactType.CompanyContact
    }
    this.contactGroupDetailsForm.patchValue({
      salutation: salutation,
      addressee: addressee,
      contactType: type,
      comments: this.contactGroupDetails.comments
    }, {onlySelf: false});
    this.contactGroupDetailsForm.markAsDirty();
  }

  hideCanvas(event) {
    this.isOffCanvasVisible = event;
    this.personFinderForm.reset();
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

  addNote() {
    this.sharedService.addNote(this.dataNote);
  }

  canDeactivate(): boolean {
    if ((this.contactGroupDetailsForm.dirty || this.companyFinderForm.dirty) && !this.isSubmitting && !this.isEditingSelectedPerson && !this.isEditingSelectedCompany) {
      return false;
    }
    return true;
  }

  cancel() {
    this._location.back();
  }

  showWarning(id):any {
    return this.sharedService.showWarning(id, this.warnings);
  }
}
