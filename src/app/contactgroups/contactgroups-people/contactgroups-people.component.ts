import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Person, BasicPerson } from 'src/app/shared/models/person';
import {
  ContactGroup, PeopleAutoCompleteResult, ContactGroupsTypes,
  ContactType, CompanyAutoCompleteResult, Company, PotentialDuplicateResult, ContactNote
} from '../shared/contact-group';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { Subject, Observable, EMPTY } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { Location } from '@angular/common';
import { WedgeError, SharedService } from 'src/app/core/services/shared.service';
import { FormErrors } from 'src/app/core/shared/app-constants';
import { AppUtils } from 'src/app/core/shared/utils';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { HeaderService } from 'src/app/core/services/header.service';
import { CompanyService } from 'src/app/company/shared/company.service';
@Component({
  selector: 'app-contactgroups-people',
  templateUrl: './contactgroups-people.component.html',
  styleUrls: ['./contactgroups-people.component.scss']
})
export class ContactgroupsPeopleComponent implements OnInit, OnDestroy {
  listInfo: any;
  warnings: any;
  isCollapsed = {};
  isSelectedCollapsed = false;
  @ViewChild('offCanvasContent', { static: true }) offCanvasContent: ElementRef;
  isOffCanvasVisible = false;
  contactGroupTypes: any;
  personId: number;
  groupPersonId: number;
  contactGroupId: number;
  selectedPeople: Person[] = [];
  foundPeople: PeopleAutoCompleteResult[];
  contactGroupDetails: ContactGroup;
  importantContactNotes: ContactNote[];
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
  isEditingSelectedPerson = false;
  isEditingSelectedCompany = false;
  isNewContactGroup = false;
  isNewPersonalContact = false;
  isSigner = false;
  potentialDuplicatePeople: PotentialDuplicateResult;
  initialContactGroupLength = 0;
  isSubmitting = false;
  isSearchCompanyVisible = true;
  orderFoundPeople = 'matchScore';
  reverse = true;
  isTypePicked = false;
  isNewCompanyContact = false;
  foundCompanies: CompanyAutoCompleteResult[];
  @ViewChild('selectedCompanyInput') selectedCompanyInput: ElementRef;
  @ViewChild('companyNameInput') companyNameInput: ElementRef;
  selectedCompany = '';
  companyDetails: Company;
  selectedCompanyId: number;
  companyFinderForm: FormGroup;
  isCloned: boolean;
  clonedContact: ContactGroup;
  formErrors = FormErrors;
  isCompanyAdded = true;
  importantPeopleNotes: ContactNote[];
  contactNotes: ContactNote[] = [];
  page = 1;
  bottomReached: boolean;
  pageSize = 10;
  suggestions: (text$: Observable<string>) => Observable<any[]>;
  suggestedTerm = '';
  searchTerm = '';
  noSuggestions = false;
  isExistingCompany = false;
  existingCompanyId: number;
  existingCompanyDetails: Company;
  isNewAddress: boolean;
  signer: string;
  companiesSearched: boolean;
  showOnlyMyNotes = false;
  isCreatingNewPerson: boolean = false;
  pendingChanges = false;
  showCompanyFinder = false;
  showSetMainPerson = true;
  groupType: string;
  backToOrigin = false;
  addedCompany: Company;

  get dataNote() {
    if (this.contactGroupDetails) {
      return {
        group: this.contactGroupDetails,
        people: this.contactGroupDetails.contactPeople,
        notes: this.contactNotes
      };
    }
    return null;
  }

  get isMaxPeople() {
    if (this.contactGroupDetails) {
      return this.contactGroupDetails.contactPeople.length && this.contactGroupDetails.contactType === ContactType.CompanyContact;
    }
    return false;
  }
  get companyAlert() {
    return this.contactGroupDetails.contactType === ContactType.CompanyContact && !this.companyDetails;
  }

  get isCompanyPerson() {
    return this.contactGroupDetails.contactType === ContactType.CompanyContact && !this.contactGroupDetails.contactPeople;
  }

  get isAMLCompleted() {
    return this.contactGroupDetails && (!!this.contactGroupDetails.companyAmlCompletedDate || this.contactGroupDetails.isAmlCompleted);
  }

  // get pendingChanges() {
  //   return (this.contactGroupDetails?.contactPeople?.length !== this.initialContactGroupLength) && this.isTypePicked;
  // }

  public keepOriginalOrder = (a) => a.key;
  isLastPerson = false;
  newContactGroupLabel = 'New Contact Group';
  info = '';
  infoTypes: { name: string, isCurrent: boolean }[] = [
    { name: 'contactGroup', isCurrent: true },
    { name: 'notes', isCurrent: false }
  ];
  dialogRef: DynamicDialogRef;
  constructor(
    private contactGroupService: ContactGroupsService,
    private companyService: CompanyService,
    private fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private dialogService: DialogService,
    private _location: Location,
    private sharedService: SharedService,
    private storage: StorageMap,
    private toastr: ToastrService,
    private messageService: MessageService,
    private renderer: Renderer2,
    private headerService: HeaderService,
  ) { }

  ngOnInit() {
    this.contactGroupTypes = ContactGroupsTypes;
    this.route.params.subscribe(params => {
      this.contactGroupId = +params['contactGroupId'] || 0;
      this.groupPersonId = +params['groupPersonId'] || 0;
      this.personId = +params['personId'] || 0;
      if (this.personId) {
        this.getContactGroupFirstPerson(this.personId, false);
      } // Delete isCompanyContactGroup() on confirmation
    });
    this.init();
    this.getContactNotes();
    this.contactGroupService.noteChanges$.subscribe(data => {
      if (data) {
        this.contactNotes = [];
        this.page = 1;
        this.getContactNotes();
        this.contactGroupService.getContactGroupbyId(this.contactGroupId).subscribe(x => {
          this.contactGroupDetails.contactNotes = x.contactNotes;
          this.setImportantNotes();
        });
      }
    });

    this.contactGroupService.contactNotePageChanges$.subscribe(newPageNumber => {
      this.page = newPageNumber;
      this.getNextContactNotesPage(this.page);
    });
    // this.suggestions = (text$: Observable<string>) =>
    //   text$.pipe(
    //     distinctUntilChanged(),
    //     switchMap(term =>
    //       this.contactGroupService.getCompanySuggestions(term).pipe(
    //         tap(data => {
    //           if (data && !data.length) {
    //             this.noSuggestions = true;
    //           }
    //         }),
    //         catchError(() => {
    //           return EMPTY;
    //         }))
    //     )
    //   );

    // Get newly added person
    this.getNewlyAddedPerson();

    // Get newly added company
    this.getNewlyAddedCompany();
  }

  init() {
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.setDropdownLists();
        console.log('list info in contact people....', this.listInfo);
      }
    });
    this.removedPersonIds = [];
    this.selectedPeople = [];
    // Remove After testing 16/04/21
    // if (!this.contactGroupId) {
    //   this.route.queryParams.subscribe(params => {
    //     this.isNewContactGroup = (!AppUtils.holdingSelectedPeople && params['isNewContactGroup']) || false;
    //     this.isNewPersonalContact = params['isNewPersonalContact'] || false;
    //     this.isNewCompanyContact = params['isNewCompanyContact'] || false;
    //     this.isSigner = params['isSigner'] || false;
    //     this.isExistingCompany = params['isExistingCompany'] || false;
    //     this.existingCompanyId = params['existingCompanyId'] || 0;
    //     this.signer = params['signer'] || '';
    //     this.searchTerm = params['searchTerm'] || '';
    //     this.backToOrigin = params['backToOrigin'] || false;
    //       console.log(this.backToOrigin, 'back to orign');

    //     if (this.isExistingCompany || this.isNewPersonalContact) {
    //       this.isOffCanvasVisible = true;
    //     }
    //   });

    //   // Set page label
    //   this.setPageLabel();
    // }
    this.route.queryParams.subscribe(params => {
      this.isNewContactGroup = (!AppUtils.holdingSelectedPeople && params['isNewContactGroup']) || false;
      this.isNewPersonalContact = params['isNewPersonalContact'] || false;
      this.isNewCompanyContact = params['isNewCompanyContact'] || false;
      this.isSigner = params['isSigner'] || false;
      this.isExistingCompany = params['isExistingCompany'] || false;
      this.existingCompanyId = params['existingCompanyId'] || 0;
      this.signer = params['signer'] || '';
      this.searchTerm = params['searchTerm'] || '';
      this.backToOrigin = params['backToOrigin'] || false;

      if (this.isExistingCompany || this.isNewPersonalContact) {
        this.isOffCanvasVisible = true;
      }
    });
    this.setPageLabel();
    this.isSubmitting = false;
    this.companyFinderForm = this.fb.group({
      companyName: [''],
      selectedCompany: ['', Validators.required],
    });

    this.contactGroupDetailsForm = this.fb.group({
      salutation: [''],
      addressee: [''],
      comments: [''],
      isRelocationAgent: false,
      isSolicitor: false,
      isInventoryClerk: false,
      isEstateAgent: false,
      isMortgageAdvisor: false,
      contactType: ContactType.Individual
    });

    if (AppUtils.holdingSelectedPeople || AppUtils.holdingSelectedCompany) {
      AppUtils.holdingSelectedPeople ? this.selectedPeople = AppUtils.holdingSelectedPeople : null;
      AppUtils.holdingSelectedCompany ? this.companyDetails = AppUtils.holdingSelectedCompany : null;
      AppUtils.holdingSelectedCompany ? this.selectCompany(this.companyDetails) : null;
      this.removedPersonIds = AppUtils.holdingRemovedPeople;
      this.isCloned = AppUtils.holdingCloned;
      AppUtils.holdingSelectedPeople = null;
      AppUtils.holdingSelectedCompany = null;
      AppUtils.holdingRemovedPeople = null;
      AppUtils.holdingCloned = false;
      this.isTypePicked = true;
    }

    if (this.contactGroupId) {
      this.getContactGroupById(this.contactGroupId);
    } else {
      this.contactGroupDetails = {} as ContactGroup;
      this.contactGroupDetails.contactPeople = [];
      const contactPeople = this.getContactPeopleFromStorage();
      if (contactPeople) {
        this.pendingChanges = true;
        // this.contactGroupDetails = {} as ContactGroup;
        this.contactGroupDetails.contactPeople = [...contactPeople];
        this.isOffCanvasVisible = false;
        this.setSalutation();
      }
      this.contactGroupDetails.contactType = AppUtils.holdingContactType || ContactType.Individual;
      if (this.isNewCompanyContact && this.isExistingCompany) {
        this.isTypePicked = true;
        this.contactGroupDetails.contactType = ContactType.CompanyContact;
        this.getCompanyDetails(this.existingCompanyId);
      }
      if (this.isNewCompanyContact) {
        const newCompany = JSON.parse(localStorage.getItem('newCompany')) as Company;
        this.isTypePicked = true;
        this.contactGroupDetails.contactType = ContactType.CompanyContact;
        if (newCompany) { this.companyDetails = newCompany; }
      }
      if (AppUtils.holdingContactType === ContactType.CompanyContact) {
        this.isNewCompanyContact = true;
      }
      AppUtils.holdingContactType = null;
      this.addSelectedPeople();
    }
  }

  setDropdownLists() {
    if (this.listInfo) {
      this.warnings = this.listInfo.personWarningStatuses;
    }
  }

  setPageLabel(clearLabel?: boolean) {
    let label: string;
    const isPersonal = this.contactGroupDetails?.contactType === ContactType.Individual;
    const isCompany = this.contactGroupDetails?.contactType === ContactType.CompanyContact;

    if (isPersonal || this.isNewPersonalContact) {
      label = 'Personal Contact Group';
      this.groupType = 'personal';
      console.log('personal here...,', this.groupType);

    }

    if (isCompany || this.isNewCompanyContact) {
      label = 'Company Contact Group';
      this.groupType = 'company';
      console.log('company here...,', this.groupType);
    }

    if (clearLabel) { label = null; }
    this.headerService.setheaderLabel(label);
  }

  isCompanyContactGroup(isSelectedTypeCompany: boolean) {
    this.contactGroupDetails = {} as ContactGroup;
    this.contactGroupDetails.contactPeople = [];
    if (isSelectedTypeCompany) {
      this.contactGroupDetails.contactType = ContactType.CompanyContact;
      this.isNewCompanyContact = true;
      this.newContactGroupLabel = 'Company Contact Group';
    } else {
      this.contactGroupDetails.contactType = ContactType.Individual;
      this.newContactGroupLabel = 'Personal Contact Group';
      this.isOffCanvasVisible = true;
    }
    if (this.personId) {
      this.getContactGroupFirstPerson(this.personId, isSelectedTypeCompany);
    }
    this.isTypePicked = true;

  }

  getNewlyAddedPerson() {
    this.contactGroupService.newPerson$.subscribe(person => {
      if (person) {
        person.isNewPerson = true;
        this.isOffCanvasVisible = false;
        if (this.contactGroupDetails && this.contactGroupDetails.contactPeople.length || this.isExistingCompany) {
          this.contactGroupDetails?.contactPeople?.push(person);
          this.storeContactPeople(this.contactGroupDetails.contactPeople);
        } else {
          const people: Person[] = [];
          people.push(person);
          console.log({ person }, 'new herer', { people });
          this.storeContactPeople(people);
          // this.contactGroupDetails = {} as ContactGroup; TEST AND REMOVE
          // const people = this.contactGroupDetails.contactPeople = [];
          // people.push(person);
          // this.setSalutation();
        }
      }
    });
  }

  getNewlyAddedCompany() {
    this.companyService.newCompanyChanges$.subscribe(company => localStorage.setItem('newCompany', JSON.stringify(company)));
  }

  storeContactPeople(contactPeople: Person[]) {
    localStorage.setItem('contactPeople', JSON.stringify(contactPeople));
  }

  getContactPeopleFromStorage() {
    const data = localStorage.getItem('contactPeople');
    let people = [];
    people = JSON.parse(data) as Person[];
    return people;
  }

  getContactGroupById(contactGroupId: number) {
    const contactPeople = this.getContactPeopleFromStorage();
    this.contactGroupService
      .getContactGroupbyId(contactGroupId, true)
      .subscribe(data => {
        this.contactGroupDetails = data;
        if (contactPeople?.length) {
          this.pendingChanges = true;
          this.contactGroupDetails.contactPeople = [...contactPeople];
          console.log(this.contactGroupDetails.contactPeople, 'new group from merged with stroage', contactPeople, 'from storage');
        }
        this.setImportantNotes();
        this.initialContactGroupLength = this.contactGroupDetails.contactPeople.length;
        console.log('contact details', this.contactGroupDetails);

        this.populateFormDetails(this.contactGroupDetails);
        this.setSalutation();
        // this.addSelectedPeople();
        if (this.isCloned) {
          this.contactGroupDetails.referenceCount = 0;
          this.contactGroupDetails.contactGroupId = 0;
        }
        this.isTypePicked = true;

        this.setPageLabel();
      });
  }

  getContactGroupFirstPerson(personId: number, isSelectedTypeCompany?: boolean) {
    const contactPeople = this.getContactPeopleFromStorage();
    this.contactGroupService.getPerson(personId).subscribe(data => {
      data.isMainPerson = true;
      this.firstContactGroupPerson = data;
      if (this.contactGroupId === 0) {
        if (this.contactGroupDetails) {
          console.log('details hre...', this.contactGroupDetails);

          if (!isSelectedTypeCompany) {
            this.contactGroupDetails.contactType = ContactType.Individual;
          }
          if (contactPeople?.length) {
            this.pendingChanges = true;
            this.contactGroupDetails.contactPeople = [...contactPeople];
            console.log(this.contactGroupDetails.contactPeople, 'new group from merged with stroage', contactPeople, 'from storage');
          } else {
            this.contactGroupDetails.contactPeople = [];
            this.contactGroupDetails.contactPeople.push(this.firstContactGroupPerson);
          }
          this.showPersonWarning();
          this.setSalutation();
        }
      }
    });
  }

  getPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      data.isNewPerson = true;
      this.selectedPerson = data;
      this.collectSelectedPeople(data);
    });
  }

  populateFormDetails(contactGroup: ContactGroup) {
    if (this.contactGroupDetailsForm) {
      this.contactGroupDetailsForm.reset();
    }
    if (contactGroup.companyName) {
      this.companyFinderForm.get('selectedCompany').setValue(contactGroup.companyName);
      this.getCompanyDetails(contactGroup.companyId);
    }
    this.contactGroupDetails = contactGroup;
    this.contactGroupDetailsForm.patchValue({
      salutation: contactGroup.salutation,
      addressee: contactGroup.addressee,
      comments: contactGroup.comments,
      isRelocationAgent: contactGroup.isRelocationAgent,
      isSolicitor: contactGroup.isSolicitor,
      isInventoryClerk: contactGroup.isInventoryClerk,
      isEstateAgent: contactGroup.isEstateAgent,
      isMortgageAdvisor: contactGroup.isMortgageAdvisor,
      contactType: contactGroup.contactType
    });
  }

  createNewPerson() {
    this.isCreatingNewPerson = true;
    this.storeContactPeople(this.contactGroupDetails?.contactPeople);
  }

  setMainPerson(id: number) {
    event.stopPropagation();
    event.preventDefault();
    const contactPeople = this.contactGroupDetails.contactPeople;
    let index: number;
    this.contactGroupDetails.contactPeople.forEach((x: Person) => {

      if (+x.personId === id) {
        x.isMainPerson = true;
        index = contactPeople.indexOf(x);
        contactPeople.unshift(contactPeople.splice(index, 1)[0]);
        this.contactGroupDetailsForm.markAsDirty();
      } else {
        x.isMainPerson = false;
      }
    });
  }

  setImportantNotes() {
    this.importantContactNotes = this.contactGroupDetails.contactNotes
      .filter(x => x.isImportant && +x.contactGroupId === this.contactGroupId);
    this.importantPeopleNotes = this.contactGroupDetails.contactNotes.filter(x => x.isImportant);
    this.contactGroupDetails.contactPeople.forEach(x => {
      x.personNotes = this.importantPeopleNotes.filter(p => p.personId === x.personId);
    });
  }

  getContactNotes() {
    this.bottomReached = false;
    this.getNextContactNotesPage(this.page);
  }

  private getNextContactNotesPage(page) {
    this.contactGroupService
      .getContactGroupNotes(this.contactGroupId, this.pageSize, page, this.showOnlyMyNotes)
      .subscribe(data => {
        if (data) {
          this.contactNotes = _.concat(this.contactNotes, data);
        }
        if (data && !data.length) {
          this.bottomReached = true;
        }
      });
  }

  editSelectedCompany(id: number, newCompany?: boolean) {
    event.preventDefault();
    this.isEditingSelectedCompany = true;
    this.contactGroupBackUp();
    let companyName;
    if (newCompany) {
      companyName = this.companyFinderForm.get('companyName').value;
    }
    this._router.navigate(['/company-centre/detail', id, 'edit'],
      { queryParams: { isNewCompany: newCompany, isEditingSelectedCompany: true, companyName: companyName } });
  }

  editSelectedPerson(id: number) {
    event.stopPropagation();
    event.preventDefault();
    this.isEditingSelectedPerson = true;
    this.contactGroupBackUp();
    this._router.navigate(['../../edit'], { queryParams: { groupPersonId: id, isEditingSelectedPerson: true }, relativeTo: this.route });
  }

  contactGroupBackUp() {
    if (this.firstContactGroupPerson) {
      this.selectedPeople.push(this.firstContactGroupPerson);
    }
    AppUtils.holdingSelectedPeople = this.selectedPeople;
    AppUtils.holdingSelectedCompany = this.companyDetails;
    AppUtils.holdingRemovedPeople = this.removedPersonIds;
    AppUtils.holdingContactType = this.contactGroupDetails.contactType;
    AppUtils.firstContactPerson = this.firstContactGroupPerson;
    AppUtils.holdingCloned = this.isCloned;
  }

  removePerson(id: number, isDialogVisible = false) {
    event.preventDefault();
    event.stopPropagation();
    const isCompanyContact = this.contactGroupDetails.contactType === ContactType.CompanyContact;
    if (this.contactGroupDetails?.contactPeople?.length === 1 && !isCompanyContact) { this.isLastPerson = true; return; }
    let index: number;
    index = this.contactGroupDetails.contactPeople.findIndex(x => x.personId === id);
    const fullName = this.contactGroupDetails.contactPeople[index] !== undefined ?
      this.contactGroupDetails.contactPeople[index].firstName + ' ' + this.contactGroupDetails.contactPeople[index].lastName : '';
    if (isDialogVisible) {
      this.confirmRemove(fullName).subscribe(res => {
        if (res) {
          this.removeSelectedPeople(this.contactGroupDetails.contactPeople, index);
          this.removedPersonIds.push(id);
          this.pendingChanges = true;
        }
      });
    } else {
      this.removeSelectedPeople(this.contactGroupDetails.contactPeople, index);
      if (this.removedPersonIds.indexOf(id) < 0) {
        this.removedPersonIds.push(id);
      }
    }

    // let index: number;
    // index = this.contactGroupDetails.contactPeople.findIndex(x => x.personId === id);
    // const fullName = this.contactGroupDetails.contactPeople[index] !== undefined ?
    //   this.contactGroupDetails.contactPeople[index].firstName + ' ' + this.contactGroupDetails.contactPeople[index].lastName : '';
    // if (isDialogVisible) {
    //   this.confirmRemove(fullName).subscribe(res => {
    //     if (res) {
    //       this.removeSelectedPeople(this.contactGroupDetails.contactPeople, index);
    //       this.saveContactGroup();
    //     }
    //   });
    // }
  }

  confirmRemove(fullName: string) {
    const subject = new Subject<boolean>();
    const data = {
      title: 'Are you sure you want to remove ' + fullName + '?',
      actions: ['No', 'Remove']
    };
    this.dialogRef = this.dialogService.open(ConfirmModalComponent, { data, styleClass: 'dialog dialog--hasFooter', showHeader: false });
    this.dialogRef.onClose.subscribe((res) => { if (res) { subject.next(true); subject.complete(); } });
    return subject.asObservable();
  }

  toggleSearchCompany() {
    event.preventDefault();
    this.isSearchCompanyVisible = !this.isSearchCompanyVisible;
    setTimeout(() => {
      this.companyNameInput.nativeElement.focus();
    });
  }

  selectCompany(company: Company) {
    console.log({ company });

    this.foundCompanies = null;
    this.companyDetails = company;
    this.isCompanyAdded = true;
    this.companyFinderForm.get('selectedCompany').setValue(company.companyName);
    this.selectedCompany = this.companyFinderForm.get('selectedCompany').value;
    this.isSearchCompanyVisible = false;
    this.showCompanyFinder = false;
    this.showSetMainPerson = false;
    setTimeout(() => {
      if (this.selectedCompanyInput) {
        this.selectedCompanyInput.nativeElement.scrollIntoView({ block: 'center' });
      }
    });
  }

  getCompanyDetails(companyId: number) {
    this.contactGroupService.getCompany(companyId).subscribe(data => {
      this.companyDetails = data;
      console.log(this.companyDetails, 'company details');
      this.isSearchCompanyVisible = false;
      this.showSetMainPerson = false;
    });
  }

  getSignerDetails(id: number) {
    this.contactGroupService.getSignerbyId(id).subscribe(data => {
      if (data) {
        this.contactGroupService.signerChanged(data);
      }
    });
  }

  getAddress(address: any) {
    if (address) {
      this.contactGroupDetails.companyAddress = address;
      this.isNewAddress = true;
    }
  }

  addCompany() {

  }

  setShowMyNotesFlag(onlyMyNotes: boolean) {
    this.showOnlyMyNotes = onlyMyNotes;
    this.contactNotes = [];
    this.page = 1;
    this.getContactNotes();
  }

  getSelectedPerson(person: Person) {
    if (person) {
      if (this.removedPersonIds.indexOf(person.personId) >= 0) {
        this.removedPersonIds.splice(this.removedPersonIds.indexOf(person.personId), 1);
      }
      if (person && person.personId !== 0 && !this.sharedService.checkDuplicateInContactGroup(this.contactGroupDetails, person.personId)) {
        this.selectedPersonId = person.personId;
        this.collectSelectedPeople(person);
        console.log('selected pople', this.selectedPeople, 'contact people', this.contactGroupDetails?.contactPeople);

      }
      this.isOffCanvasVisible = false;
      this.renderer.removeClass(document.body, 'no-scroll');
      window.scrollTo(0, 0);
      this.selectedPersonId = 0;
      this.contactGroupDetailsForm.markAsDirty();

      // this.contactGroupDetails.contactPeople?.push(person);
      // console.log({ person });
      // console.log(this.contactGroupDetails.contactPeople, 'people');

      // this.setSalutation();
      // this.saveContactGroup();
    }

    // if (this.removedPersonIds.indexOf(person.personId) >= 0) {
    //   this.removedPersonIds.splice(this.removedPersonIds.indexOf(person.personId), 1);
    // }
    // if (person && person.personId !== 0 && !this.sharedService.checkDuplicateInContactGroup(this.contactGroupDetails, person.personId)) {
    //   this.selectedPersonId = person.personId;
    //   this.collectSelectedPeople(person);
    // }

    // this.isOffCanvasVisible = false;
    // this.renderer.removeClass(document.body, 'no-scroll');
    // window.scrollTo(0, 0);
    // this.selectedPersonId = 0;

    // No save implementation
    // if (person) {
    //   this.contactGroupDetails.contactPeople?.push(person);
    //   console.log({ person });
    //   console.log(this.contactGroupDetails.contactPeople, 'people');

    //   this.setSalutation();
    //   this.saveContactGroup();
    // }

  }

  collectSelectedPeople(person: Person) {
    if (this.selectedPeople) {
      this.selectedPeople.push(person);
      this.pendingChanges = true;
      this.addSelectedPeople();
    }
  }

  showPersonWarning() {
    this.contactGroupDetails.contactPeople.forEach(x => {
      x.warning = this.sharedService.showWarning(x.warningStatusId, this.warnings, x.warningStatusComment);
    });
  }

  addSelectedPeople() {
    if (this.selectedPeople.length) {
      this.selectedPeople.forEach(x => {
        if (!this.sharedService.checkDuplicateInContactGroup(this.contactGroupDetails, x.personId)) {
          this.contactGroupDetails.contactPeople?.push(x);
          this.setSalutation();
        }
      });
      if (this.removedPersonIds.length) {
        this.removedPersonIds.forEach(x => {
          this.removePerson(x, false);
        });
      }
    }
    this.showPersonWarning();
  }

  removeSelectedPeople(people, index: number) {
    people.splice(index, 1);
    this.setSalutation();
  }


  getAddedPersonDetails(personEmitter: any) {
    if (personEmitter) {
      personEmitter.person.isNewPerson = true;
      this.addedPerson = personEmitter.person;
      const people = this.contactGroupDetails.contactPeople;
      people?.push(personEmitter.person);
      this.setSalutation();
      this.saveContactGroup();
    }
    // if (personEmitter) {
    //   personEmitter.person.isNewPerson = true;
    //   this.addedPerson = personEmitter.person;
    //   if (this.contactGroupDetails && this.contactGroupDetails.contactPeople.length || this.isExistingCompany) {
    //     this.collectSelectedPeople(personEmitter.person);
    //   } else {
    //     this.contactGroupDetails = {} as ContactGroup;
    //     const people = this.contactGroupDetails.contactPeople = [];
    //     people.push(personEmitter.person);
    //     this.setSalutation();
    //     if(!personEmitter.otherPersonToAdd) {
    //       this.saveContactGroup();
    //     }
    //   }
    // }
  }

  cloneContactGroup() {
    console.log('contact to clone', this.contactGroupDetails);
    this.isCloned = true;
    if (this.isCloned) {
      this.contactGroupDetails.contactGroupId = 0;
      this.contactGroupDetails.referenceCount = 0;
    }
    this.contactGroupDetailsForm.markAsDirty();
  }

  saveContactGroup() {
    console.log('contact details', this.contactGroupDetailsForm.dirty)
    const validForm = this.contactGroupDetailsForm.valid;

    if (this.contactGroupDetailsForm.invalid) { return; }
    if (this.contactGroupDetailsForm.dirty || this.companyFinderForm.dirty || this.isExistingCompany || this.isNewAddress) {
      const contactPeople = this.contactGroupDetails.contactPeople.length;
      if (this.selectedPeople.length || contactPeople) {
        const contactGroup = { ...this.contactGroupDetails, ...this.contactGroupDetailsForm.value };
        this.isSubmitting = true;
        this.isOffCanvasVisible = false;
        if (contactGroup.contactGroupId) {
          this.updateContactGroup(contactGroup);
        } else {
          this.addNewContactGroup(contactGroup);
        }
      }
    }
    // else {
    //   this.onSaveComplete(this.contactGroupId);
    // }
  }

  private addNewContactGroup(contactGroup: ContactGroup) {
    if (this.isNewCompanyContact) {
      if (!this.contactGroupDetails) {
        this.contactGroupDetails = {} as ContactGroup;
        this.contactGroupDetails.contactPeople = [];
      }
      if (this.companyDetails) {
        this.isCompanyAdded = true;
        contactGroup.companyId = this.companyDetails.companyId;
        contactGroup.companyName = this.companyDetails.companyName;
        contactGroup.contactType = ContactType.CompanyContact;
        if (!this.contactGroupDetails.contactPeople.length) {
          this.contactGroupDetails.contactPeople.push(this.selectedPerson);
        }
        this.contactGroupService
          .addContactGroup(contactGroup)
          .subscribe(res => {
            this.onSaveComplete(res.result.contactGroupId);
          }, (error: WedgeError) => {
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
          this.isSubmitting = false;
        });
    }
  }

  private updateContactGroup(contactGroup: ContactGroup) {
    if (contactGroup.companyName) {
      contactGroup.companyId = this.companyDetails.companyId;
      contactGroup.companyName = this.companyDetails.companyName;
    }
    console.log('contact to update', contactGroup);
    this.contactGroupService
      .updateContactGroup(contactGroup)
      .subscribe(res => {
        console.log({ res }, 'results from update');

        this.onSaveComplete(res.result.contactGroupId);
      }, (error: WedgeError) => {
        this.isSubmitting = false;
      });
  }

  onSaveComplete(contactGroupId): void {
    localStorage.removeItem('contactPeople');
    localStorage.removeItem('newCompany');
    this.pendingChanges = false;
    this.isSubmitting = false;
    this.messageService.add({ severity: 'success', summary: 'Contact Group successfully saved', closable: false });
    if (this.backToOrigin) {
      if (this.isSigner) { this.getSignerDetails(contactGroupId); }
      this.sharedService.back();
    }
    if (!contactGroupId) {
      this.sharedService.back();
    } else {

      // Remove after Testing 23/02/21 ASAP
      // let url = this._router.url;
      // let replacedId = this.contactGroupId;

      // if (url.indexOf('people/' + replacedId) === -1) {
      //   replacedId = 0;
      // }

      // if (url.indexOf('?') >= 0) {
      //   url = url.substring(0, url.indexOf('?'));
      // }

      // url = url.replace('people/' + replacedId, 'people/' + contactGroupId);

      // this._location.replaceState(url);
      // this.contactGroupId = contactGroupId;
      // this.init();
      this._router.navigate(['/contact-centre/detail/', 0, 'people', contactGroupId], { replaceUrl: true });
      // this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      //   this._router.navigate(['/contact-centre/detail/', 0, 'people', contactGroupId]);
      // });
      if (this.isExistingCompany && this.existingCompanyId) {
        this._router.navigate(['/company-centre/detail', this.existingCompanyId]);
      }
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
      type = ContactType.CompanyContact;
    }

    this.contactGroupDetailsForm.patchValue({
      salutation: salutation,
      addressee: addressee,
      contactType: type,
      comments: this.contactGroupDetails.comments
    }, { onlySelf: false });
    this.contactGroupDetailsForm.markAsDirty();
  }


  setInfoType(type: string, index: number) {
    this.info = type;
    this.infoTypes.map(t => t.isCurrent = false);
    this.infoTypes[index].isCurrent = true;
    console.log('info type', this.info);

  }


  hideCanvas(event) {
    this.isOffCanvasVisible = event;
    this.personFinderForm.reset();
    this.renderer.removeClass(document.body, 'no-scroll');
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

  resetCanvasFlag() {
    this.isOffCanvasVisible = false;
  }

  toggleNewPersonVisibility(condition) {
    this.isCreateNewPersonVisible = condition;
    console.log({ condition }, 'in people', this.isCreateNewPersonVisible);
  }

  addNote() {
    this.sharedService.addNote(this.dataNote);
  }

  // Mark form as pristine to allow navigation away when no pending changes. Manual changes to detail section needs to be looked at. 24/02/2021
  canDeactivate(): boolean {
    if (!this.pendingChanges) { this.contactGroupDetailsForm.markAsPristine(); }
    if ((this.contactGroupDetailsForm.dirty || this.companyFinderForm.dirty) &&
      !this.isSubmitting && !this.isEditingSelectedCompany && !this.isCreatingNewPerson) {
      return false;
    }

    return true;
  }

  cancel() {
    localStorage.removeItem('newCompany');
    this.sharedService.back();
  }

  ngOnDestroy() {
    this.setPageLabel(true);

    console.log('destroy component now');

  }
}
