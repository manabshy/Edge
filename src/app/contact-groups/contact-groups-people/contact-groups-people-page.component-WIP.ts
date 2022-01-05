// import { Component, OnInit, Renderer2, ViewChild, ElementRef, OnDestroy } from '@angular/core'
// import { ContactGroupsService } from '../shared/contact-groups.service'
// import { ActivatedRoute, Router } from '@angular/router'
// import { Person, BasicPerson } from 'src/app/shared/models/person'
// import {
//   ContactGroup,
//   PeopleAutoCompleteResult,
//   ContactGroupsTypes,
//   ContactType,
//   CompanyAutoCompleteResult,
//   Company,
//   PotentialDuplicateResult,
//   ContactNote
// } from '../shared/contact-group.interfaces'
// import { FormGroup, FormBuilder, Validators } from '@angular/forms'
// import { take, takeUntil, tap } from 'rxjs/operators'
// import { Subject, Observable, combineLatest } from 'rxjs'
// import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component'
// import { WedgeError, SharedService } from 'src/app/core/services/shared.service'
// import { FormErrors } from 'src/app/core/shared/app-constants'
// import { AppUtils } from 'src/app/core/shared/utils'
// import * as _ from 'lodash'
// import { StorageMap } from '@ngx-pwa/local-storage'
// import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog'
// import { MessageService } from 'primeng/api'
// import { HeaderService } from 'src/app/core/services/header.service'
// import { CompanyService } from 'src/app/company/shared/company.service'
// import { ContactGroupsFacadeService } from '../shared/contact-groups-facade.service'

// @Component({
//   selector: 'app-contact-groups-people-page',
//   templateUrl: './contact-groups-people-page.component.html'
// })
// export class ContactGroupsPeoplePageComponentWIP implements OnInit, OnDestroy {
//   listInfo: any
//   warnings: any
//   isCollapsed = {}
//   isSelectedCollapsed = false
//   @ViewChild('offCanvasContent', { static: true }) offCanvasContent: ElementRef
//   showDuplicateChecker = false
//   contactGroupTypes: any
//   personId: number
//   groupPersonId: number
//   contactGroupId: number
//   selectedPeople: Person[] = []
//   foundPeople: PeopleAutoCompleteResult[]
//   contactGroupDetails: ContactGroup
//   importantContactNotes: ContactNote[]
//   contactGroupDetailsForm: FormGroup
//   personFinderForm: FormGroup
//   selectedPerson: Person
//   addedPerson: Person
//   addedContactGroup: any
//   firstContactGroupPerson: Person
//   selectedPersonId: number
//   removedPersonIds: any[] = []
//   newPerson: BasicPerson
//   isCreateNewPersonVisible = false
//   isEditingSelectedPerson = false
//   isEditingSelectedCompany = false
//   isNewContactGroup = false
//   isNewPersonalContact = false
//   isSigner = false
//   potentialDuplicatePeople: PotentialDuplicateResult
//   initialContactGroupLength = 0
//   isSubmitting = false
//   isSearchCompanyVisible = true
//   orderFoundPeople = 'matchScore'
//   reverse = true
//   isTypePicked = false
//   isNewCompanyContact = false
//   foundCompanies: CompanyAutoCompleteResult[]
//   @ViewChild('selectedCompanyInput') selectedCompanyInput: ElementRef
//   @ViewChild('companyNameInput') companyNameInput: ElementRef
//   selectedCompany = ''
//   companyDetails: Company
//   selectedCompanyId: number
//   companyFinderForm: FormGroup
//   isCloned: boolean
//   clonedContact: ContactGroup
//   formErrors = FormErrors
//   isCompanyAdded = true
//   importantPeopleNotes: ContactNote[]
//   contactNotes: ContactNote[] = []
//   page = 0
//   bottomReached: boolean
//   pageSize = 10
//   suggestions: (text$: Observable<string>) => Observable<any[]>
//   suggestedTerm = ''
//   searchTerm = ''
//   noSuggestions = false
//   isExistingCompany = false
//   existingCompanyId: number
//   existingCompanyDetails: Company
//   isNewAddress: boolean
//   signer: string
//   companiesSearched: boolean
//   showOnlyMyNotes = false
//   isCreatingNewPerson = false
//   pendingChanges = false
//   showCompanyFinder = false
//   showSetMainPerson = true
//   groupType: string
//   backToOrigin = false
//   addedCompany: Company
//   destroy = new Subject()
//   showAddNewBtn: boolean

//   get dataNote() {
//     if (this.contactGroupDetails?.contactGroupId) {
//       return {
//         contactGroupId: this.contactGroupDetails.contactGroupId,
//         people: this.contactGroupDetails.contactPeople,
//         notes: this.contactNotes
//       }
//     }
//     if (this.contactGroupId) {
//       return { contactGroupId: this.contactGroupId, notes: this.contactNotes }
//     }
//     return null
//   }

//   get isMaxPeople() {
//     if (this.contactGroupDetails) {
//       return (
//         this.contactGroupDetails.contactPeople.length &&
//         this.contactGroupDetails.contactType === ContactType.CompanyContact
//       )
//     }
//     return false
//   }

//   get companyAlert() {
//     return this.contactGroupDetails.contactType === ContactType.CompanyContact && !this.companyDetails
//   }

//   get isCompanyPerson() {
//     return (
//       this.contactGroupDetails.contactType === ContactType.CompanyContact && !this.contactGroupDetails.contactPeople
//     )
//   }

//   get isAMLCompleted() {
//     return (
//       this.contactGroupDetails &&
//       (!!this.contactGroupDetails.companyAmlCompletedDate || this.contactGroupDetails.isAmlCompleted)
//     )
//   }

//   public keepOriginalOrder = (a) => a.key
//   isLastPerson = false
//   newContactGroupLabel = 'New Contact Group'
//   info = ''
//   infoTypes: { name: string; isCurrent: boolean }[] = [
//     { name: 'contactGroup', isCurrent: true },
//     { name: 'notes', isCurrent: false }
//   ]
//   dialogRef: DynamicDialogRef

//   vm$: Observable<any>

//   constructor(
//     private contactGroupService: ContactGroupsService,
//     private companyService: CompanyService,
//     private fb: FormBuilder,
//     private _router: Router,
//     private route: ActivatedRoute,
//     private dialogService: DialogService,
//     private sharedService: SharedService,
//     private storage: StorageMap,
//     private messageService: MessageService,
//     private renderer: Renderer2,
//     private headerService: HeaderService,
//     private _contactGroupsFacadeSvc: ContactGroupsFacadeService
//   ) {}

//   ngOnInit() {
//     console.log('🚧🚧 ContactGroupsPeopleComponent: WIP 🚧🚧')

//     this.contactGroupTypes = ContactGroupsTypes // ? purpose?

//     combineLatest([this.route.params, this.route.queryParams])
//       .pipe(
//         tap(([routeParams, queryParams]) => {
//           console.log('queryParams: ', queryParams)
//           console.log('routeParams: ', routeParams)
//           this.contactGroupId = +routeParams['contactGroupId'] || 0
//           this.groupPersonId = +routeParams['groupPersonId'] || 0
//           this.personId = +routeParams['personId'] || 0

//           this.isNewContactGroup = queryParams['isNewContactGroup'] === 'true'
//           this.isNewPersonalContact = queryParams['isNewPersonalContact'] === 'true'
//           this.isNewCompanyContact = queryParams['isNewCompanyContact'] === 'true'
//           this.isSigner = queryParams['isSigner'] || false
//           this.isExistingCompany = queryParams['isExistingCompany'] === 'true'
//           this.existingCompanyId = queryParams['existingCompanyId'] || 0
//           this.signer = queryParams['signer'] || ''
//           this.searchTerm = queryParams['searchTerm'] || ''
//           this.backToOrigin = queryParams['backToOrigin'] === 'true'
//           this.backToOrigin = queryParams['backToOrigin'] === 'true'

//           if (this.isExistingCompany || this.isNewPersonalContact || queryParams['showDuplicateChecker']) {
//             this.showDuplicateChecker = true
//           }
//           if (this.isNewCompanyContact === true) {
//             this.showCompanyFinder = true
//           }

//           console.log('finished setting up from route & query params')
//         })
//       )
//       .subscribe(() => {
//         console.log('off to service to build the view model')
//         this.vm$ = this._contactGroupsFacadeSvc
//           .getContactGroupsPeoplePageVm$(this.personId, this.contactGroupId, this.existingCompanyId)
//           .pipe(
//             tap((data) => {
//               console.log('vm$ looks like: ', data)
//               this.contactGroupDetails = data.contactGroupData
//               this.companyDetails = data.companyDetails
//               this.init()
//             })
//           )
//       })
//   }

//   private getContactNotes() {
//     this.contactGroupService.getContactGroupById(this.contactGroupId).subscribe((x) => {
//       this.contactGroupDetails.contactNotes = x.contactNotes
//       this.setImportantNotes()
//     })
//   }

//   init() {
//     // this.getPagedContactNotes()

//     // this.contactGroupService.noteChanges$.subscribe((data) => {
//     //   if (data) {
//     //     this.contactNotes = []
//     //     this.page = 1
//     //     this.getPagedContactNotes()
//     //     if (this.contactGroupId) {
//     //       this.getContactNotes()
//     //     }
//     //   }
//     // })

//     // this.contactGroupService.contactNotePageChanges$.pipe(takeUntil(this.destroy)).subscribe((newPageNumber) => {
//     //   this.page = newPageNumber
//     //   this.getNextContactNotesPage(this.page)
//     // })

//     // Get newly added person
//     // this.getNewlyAddedPerson()

//     // Get newly added company
//     // this.getNewlyAddedCompany()

//     // 1 get 'info' from local storage
//     this.storage.get('info').subscribe((data) => {
//       if (data) {
//         this.listInfo = data
//         this.setDropdownLists()
//         // console.log('list info in contact people....', this.listInfo)
//       }
//     })

//     // what are these arrays for?


//     // 7 checks some utility holding properties...
//     // if (AppUtils.holdingSelectedPeople || AppUtils.holdingSelectedCompany) {
//     //   console.log('this needs to be ironed out and just use a the facade svc for any in memory storage requirements.')
//     //   this.selectedPeople = AppUtils.holdingSelectedPeople
//     //   this.companyDetails = AppUtils.holdingSelectedCompany
//     //   this.selectCompany(this.companyDetails)
//     //   this.removedPersonIds = AppUtils.holdingRemovedPeople
//     //   this.isCloned = AppUtils.holdingCloned
//     //   AppUtils.holdingSelectedPeople = null
//     //   AppUtils.holdingSelectedCompany = null
//     //   AppUtils.holdingRemovedPeople = null
//     //   AppUtils.holdingCloned = false
//     //   this.isTypePicked = true
//     // }
//     this.removedPersonIds = []
//     this.selectedPeople = []

//     if (this.isNewCompanyContact === true) {
//       this.showCompanyFinder = true
//     }

//     // 3 sets page label for view
//     this.setPageLabel()
//     // 4 toggles a boolean
//     this.isSubmitting = false
//     // 5 sets up forms
//     this.configureFormsForView()
//     // 8 gets contact group if there's a contactGroupId, else assumes we're making a new one.
//     // this.showDuplicateChecker = false
//     this.isSearchCompanyVisible = false
//     this.showSetMainPerson = false
//     this.setSalutation()
//     // what is this prop doing being set here?
//     this.contactGroupDetails.contactType = AppUtils.holdingContactType || ContactType.Individual

//     //   if (this.isNewCompanyContact && this.isExistingCompany) {
//     //     this.isTypePicked = true
//     //     this.contactGroupDetails.contactType = ContactType.CompanyContact
//     //     this.getCompanyDetails(this.existingCompanyId)
//     //   }
//     //   if (this.isNewCompanyContact) {
//     //     const newCompany = JSON.parse(localStorage.getItem('newCompany')) as Company
//     //     this.isTypePicked = true
//     //     this.contactGroupDetails.contactType = ContactType.CompanyContact
//     //     if (newCompany) {
//     //       this.companyDetails = newCompany
//     //     }
//     //   }
//     //   if (AppUtils.holdingContactType === ContactType.CompanyContact) {
//     //     this.isNewCompanyContact = true
//     //   }
//     //   AppUtils.holdingContactType = null
//     //   this.addSelectedPeople()
//     // }
//     this.shouldNewBtnShow()
//   }

//   shouldNewBtnShow() {
//     this.showAddNewBtn =
//       this.contactGroupDetails?.contactPeople.length < 8 &&
//       !this.contactGroupDetails?.referenceCount &&
//       !this.isMaxPeople
//   }

//   setDropdownLists() {
//     if (this.listInfo) {
//       this.warnings = this.listInfo.personWarningStatuses
//     }
//   }

//   private configureFormsForView() {
//     this.companyFinderForm = this.fb.group({
//       companyName: [''],
//       selectedCompany: ['', Validators.required]
//     })

//     // 6 sets up another form
//     this.contactGroupDetailsForm = this.fb.group({
//       salutation: [''],
//       addressee: [''],
//       comments: [''],
//       isRelocationAgent: false,
//       isSolicitor: false,
//       isInventoryClerk: false,
//       isEstateAgent: false,
//       isMortgageAdvisor: false,
//       contactType: ContactType.Individual
//     })
//   }

//   setPageLabel(clearLabel?: boolean) {
//     let label: string
//     const isPersonal = this.contactGroupDetails?.contactType === ContactType.Individual
//     const isCompany = this.contactGroupDetails?.contactType === ContactType.CompanyContact

//     if (isPersonal || this.isNewPersonalContact) {
//       label = 'Personal Contact Group'
//       this.groupType = 'personal'
//       // console.log('personal here...,', this.groupType)
//     }

//     if (isCompany || this.isNewCompanyContact) {
//       label = 'Company Contact Group'
//       this.groupType = 'company'
//       // console.log('company here...,', this.groupType)
//     }

//     if (clearLabel) {
//       label = null
//     }
//     this.headerService.setheaderLabel(label)
//   }

//   isCompanyContactGroup(isSelectedTypeCompany: boolean) {
//     this.contactGroupDetails = {} as ContactGroup
//     this.contactGroupDetails.contactPeople = []
//     if (isSelectedTypeCompany) {
//       this.contactGroupDetails.contactType = ContactType.CompanyContact
//       this.isNewCompanyContact = true
//       this.newContactGroupLabel = 'Company Contact Group'
//     } else {
//       this.contactGroupDetails.contactType = ContactType.Individual
//       this.newContactGroupLabel = 'Personal Contact Group'
//       this.showDuplicateChecker = true
//     }
//     if (this.personId) {
//       console.log('TODO')
//       // this._contactGroupsFacadeSvc.getContactGroupFirstPerson(this.personId, isSelectedTypeCompany)
//     }
//     this.isTypePicked = true
//   }

//   getNewlyAddedPerson() {
//     this.contactGroupService.newPerson$.pipe(takeUntil(this.destroy)).subscribe((person) => {
//       if (person) {
//         person.isNewPerson = true
//         this.showDuplicateChecker = false
//         // I have no idea why this condition exists! doesn't work with it, works without it. ¯\_(ツ)_/¯
//         if ((this.contactGroupDetails && this.contactGroupDetails.contactPeople.length) || this.isExistingCompany) {
//           this.contactGroupDetails?.contactPeople?.push(person)
//           this.storeContactPeople(this.contactGroupDetails.contactPeople)
//         } else {
//           const people: Person[] = []
//           people.push(person)
//           // console.log({ person }, 'new herer', { people })
//           this.storeContactPeople(people)
//         }
//       }
//     })
//   }

//   getNewlyAddedCompany() {
//     this.companyService.newCompanyChanges$.subscribe((company) =>
//       // localStorage.setItem('newCompany', JSON.stringify(company))
//       // assuming a new company has potentially just been created in the user flow. In which case grab those company details
//       //
//       this._contactGroupsFacadeSvc.storeNewCompany(company)
//     )
//   }

//   storeContactPeople(contactPeople: Person[]) {
//     console.log('adding person to local storage', contactPeople) // why add them to local storage?
//     // localStorage.setItem('contactPeople', JSON.stringify(contactPeople))
//     this._contactGroupsFacadeSvc.storeContactPeople(contactPeople)
//   }

//   getContactPeopleFromStorage() {
//     const data = localStorage.getItem('contactPeople')
//     let people = []
//     people = JSON.parse(data) as Person[]
//     return people
//   }

//   getContactGroupById(contactGroupId: number) {
//     const contactPeople = this.getContactPeopleFromStorage()
//     this.contactGroupService.getContactGroupById(contactGroupId, true).subscribe((data) => {
//       // console.log('contactGroupDetails: ', data)
//       this.contactGroupDetails = data
//       if (contactPeople?.length) {
//         this.pendingChanges = true
//         this.contactGroupDetails.contactPeople = [...contactPeople]
//         // console.log(
//         //   this.contactGroupDetails.contactPeople,
//         //   'new group from merged with stroage',
//         //   contactPeople,
//         //   'from storage'
//         // )
//       }
//       this.setImportantNotes()
//       this.initialContactGroupLength = this.contactGroupDetails.contactPeople.length
//       // console.log('contact details', this.contactGroupDetails)

//       this.populateFormDetails(this.contactGroupDetails)
//       this.setSalutation()
//       // this.addSelectedPeople();
//       if (this.isCloned) {
//         this.contactGroupDetails.referenceCount = 0
//         this.contactGroupDetails.contactGroupId = 0
//       }
//       this.isTypePicked = true

//       this.setPageLabel()
//     })
//   }

//   getContactGroupFirstPerson(personId: number, isSelectedTypeCompany?: boolean) {
//     const contactPeople = this.getContactPeopleFromStorage()
//     this.contactGroupService.getPerson(personId).subscribe((data) => {
//       data.isMainPerson = true
//       this.firstContactGroupPerson = data
//       if (this.contactGroupId === 0) {
//         if (this.contactGroupDetails) {
//           if (!isSelectedTypeCompany) {
//             this.contactGroupDetails.contactType = ContactType.Individual
//           }
//           if (contactPeople?.length) {
//             this.pendingChanges = true
//             this.contactGroupDetails.contactPeople = [...contactPeople]
//             console.log(
//               this.contactGroupDetails.contactPeople,
//               'new group from merged with stroage',
//               contactPeople,
//               'from storage'
//             )
//           } else {
//             this.contactGroupDetails.contactPeople = []
//             this.contactGroupDetails.contactPeople.push(this.firstContactGroupPerson)
//           }
//           this.showPersonWarning()
//           this.setSalutation()
//         }
//       }
//     })
//   }

//   getPersonDetails(personId: number) {
//     this.contactGroupService.getPerson(personId).subscribe((data) => {
//       data.isNewPerson = true
//       this.selectedPerson = data
//       this.collectSelectedPeople(data)
//     })
//   }

//   populateFormDetails(contactGroup: ContactGroup) {
//     if (this.contactGroupDetailsForm) {
//       this.contactGroupDetailsForm.reset()
//     }
//     if (contactGroup.companyName) {
//       this.companyFinderForm.get('selectedCompany').setValue(contactGroup.companyName)
//       this.getCompanyDetails(contactGroup.companyId)
//     }
//     // console.log('contactGroup: ', contactGroup)
//     this.contactGroupDetails = contactGroup
//     this.contactGroupDetailsForm.patchValue({
//       salutation: contactGroup.salutation,
//       addressee: contactGroup.addressee,
//       comments: contactGroup.comments,
//       isRelocationAgent: contactGroup.isRelocationAgent,
//       isSolicitor: contactGroup.isSolicitor,
//       isInventoryClerk: contactGroup.isInventoryClerk,
//       isEstateAgent: contactGroup.isEstateAgent,
//       isMortgageAdvisor: contactGroup.isMortgageAdvisor,
//       contactType: contactGroup.contactType
//     })
//   }

//   createNewPerson() {
//     this.isCreatingNewPerson = true
//     this.storeContactPeople(this.contactGroupDetails?.contactPeople)
//   }

//   navigateToNewPersonScreen(ev) {
//     console.log('navigateToNewPersonScreen. store contact people (why idk) in local storage. ev = ', ev)
//     this.createNewPerson()
//     this._router.navigate(['contact-centre', 'detail', 0, 'edit'], {
//       queryParams: {
//         newPerson: JSON.stringify(ev),
//         emailPhoneRequired: true
//       }
//     })
//   }

//   setMainPerson(id: number) {
//     // event.stopPropagation()
//     // event.preventDefault()
//     const contactPeople = this.contactGroupDetails.contactPeople
//     let index: number
//     this.contactGroupDetails.contactPeople.forEach((x: Person) => {
//       if (+x.personId === id) {
//         x.isMainPerson = true
//         index = contactPeople.indexOf(x)
//         contactPeople.unshift(contactPeople.splice(index, 1)[0])
//         this.contactGroupDetailsForm.markAsDirty()
//       } else {
//         x.isMainPerson = false
//       }
//     })
//   }

//   setImportantNotes() {
//     this.importantContactNotes = this.contactGroupDetails.contactNotes.filter(
//       (x) => x.isImportant && +x.contactGroupId === this.contactGroupId
//     )
//     this.importantPeopleNotes = this.contactGroupDetails.contactNotes.filter((x) => x.isImportant)
//     this.contactGroupDetails.contactPeople.forEach((x) => {
//       x.personNotes = this.importantPeopleNotes.filter((p) => p.personId === x.personId)
//     })
//   }

//   getPagedContactNotes() {
//     this.bottomReached = false
//     this.getNextContactNotesPage(this.page)
//   }

//   private getNextContactNotesPage(page) {
//     this.contactGroupService
//       .getContactGroupNotes(this.contactGroupId, this.pageSize, page, this.showOnlyMyNotes)
//       .subscribe((data) => {
//         if (data) {
//           this.contactNotes = _.concat(this.contactNotes, data)
//         }
//         if (data && !data.length) {
//           this.bottomReached = true
//         }
//       })
//   }

//   editSelectedCompany(event: any) {
//     this.isEditingSelectedCompany = true
//     this.contactGroupBackUp()
//     let companyName = event?.companyName
//     this._router.navigate(['/company-centre/detail', 0, 'edit'], {
//       queryParams: {
//         isNewCompany: true,
//         isEditingSelectedCompany: true,
//         companyName: companyName
//       }
//     })
//   }

//   editSelectedPerson(id: number) {
//     event.stopPropagation()
//     event.preventDefault()
//     this.isEditingSelectedPerson = true
//     this.contactGroupBackUp()
//     this._router.navigate(['../../edit'], {
//       queryParams: { groupPersonId: id, isEditingSelectedPerson: true },
//       relativeTo: this.route
//     })
//   }

//   contactGroupBackUp() {
//     if (this.firstContactGroupPerson) {
//       this.selectedPeople.push(this.firstContactGroupPerson)
//     }
//     AppUtils.holdingSelectedPeople = this.selectedPeople
//     AppUtils.holdingSelectedCompany = this.companyDetails
//     AppUtils.holdingRemovedPeople = this.removedPersonIds
//     AppUtils.holdingContactType = this.contactGroupDetails.contactType
//     AppUtils.firstContactPerson = this.firstContactGroupPerson
//     AppUtils.holdingCloned = this.isCloned
//   }

//   removePerson(id: number, isDialogVisible = false) {
//     event.preventDefault()
//     event.stopPropagation()
//     const isCompanyContact = this.contactGroupDetails.contactType === ContactType.CompanyContact
//     if (this.contactGroupDetails?.contactPeople?.length === 1 && !isCompanyContact) {
//       this.isLastPerson = true
//       return
//     }
//     let index: number
//     index = this.contactGroupDetails.contactPeople.findIndex((x) => x.personId === id)
//     const fullName =
//       this.contactGroupDetails.contactPeople[index] !== undefined
//         ? this.contactGroupDetails.contactPeople[index].firstName +
//           ' ' +
//           this.contactGroupDetails.contactPeople[index].lastName
//         : ''
//     if (isDialogVisible) {
//       this.confirmRemove(fullName).subscribe((res) => {
//         if (res) {
//           this.removeSelectedPeople(this.contactGroupDetails.contactPeople, index)
//           this.removedPersonIds.push(id)
//           this.pendingChanges = true
//         }
//       })
//     } else {
//       this.removeSelectedPeople(this.contactGroupDetails.contactPeople, index)
//       if (this.removedPersonIds.indexOf(id) < 0) {
//         this.removedPersonIds.push(id)
//       }
//     }
//   }

//   confirmRemove(fullName: string) {
//     const subject = new Subject<boolean>()
//     const data = {
//       title: 'Are you sure you want to remove ' + fullName + '?',
//       actions: ['No', 'Remove']
//     }
//     this.dialogRef = this.dialogService.open(ConfirmModalComponent, {
//       data,
//       styleClass: 'dialog dialog--hasFooter',
//       showHeader: false
//     })
//     this.dialogRef.onClose.subscribe((res) => {
//       if (res) {
//         subject.next(true)
//         subject.complete()
//       }
//     })
//     return subject.asObservable()
//   }

//   toggleSearchCompany() {
//     event.preventDefault()
//     this.isSearchCompanyVisible = !this.isSearchCompanyVisible
//     setTimeout(() => {
//       this.companyNameInput.nativeElement.focus()
//     })
//   }

//   selectCompany(company: Company) {
//     // console.log('selectCompany', { company })

//     this.foundCompanies = null
//     this.companyDetails = company
//     this.isCompanyAdded = true
//     if (company) {
//       this.companyFinderForm.get('selectedCompany').setValue(company.companyName)
//     }
//     this.selectedCompany = this.companyFinderForm.get('selectedCompany').value
//     this.isSearchCompanyVisible = false
//     this.showCompanyFinder = false
//     this.showSetMainPerson = false
//     setTimeout(() => {
//       if (this.selectedCompanyInput) {
//         this.selectedCompanyInput.nativeElement.scrollIntoView({
//           block: 'center'
//         })
//       }
//     })
//   }

//   getCompanyDetails(companyId: number) {
//     this.contactGroupService.getCompany(companyId).subscribe((data) => {
//       this.companyDetails = data
//       // console.log(this.companyDetails, 'company details')
//       this.isSearchCompanyVisible = false
//       this.showSetMainPerson = false
//     })
//   }

//   getSignerDetails(id: number) {
//     this.contactGroupService.getSignerbyId(id).subscribe((data) => {
//       if (data) {
//         this.contactGroupService.signerChanged(data)
//       }
//     })
//   }

//   getAddress(address: any) {
//     if (address) {
//       this.contactGroupDetails.companyAddress = address
//       this.isNewAddress = true
//     }
//   }

//   setShowMyNotesFlag(onlyMyNotes: boolean) {
//     this.showOnlyMyNotes = onlyMyNotes
//     this.contactNotes = []
//     this.page = 1
//     this.getPagedContactNotes()
//   }

//   getSelectedPerson(person: Person) {
//     console.log('getSelectedPerson: ', person)
//     this.contactGroupService
//       .getPerson(person.personId)
//       .pipe(take(1))
//       .subscribe((data) => {
//         console.log('subscription to contactGroupService.getPerson: data = ', data)
//         if (data) {
//           if (this.removedPersonIds.indexOf(data.personId) >= 0) {
//             this.removedPersonIds.splice(this.removedPersonIds.indexOf(data.personId), 1)
//           }
//           if (
//             data &&
//             data.personId !== 0 &&
//             !this.sharedService.checkDuplicateInContactGroup(this.contactGroupDetails, data.personId)
//           ) {
//             this.selectedPersonId = data.personId
//             this.collectSelectedPeople(data)
//           }
//           this.showDuplicateChecker = false
//           this.renderer.removeClass(document.body, 'no-scroll')
//           window.scrollTo(0, 0)
//           this.selectedPersonId = 0
//           this.contactGroupDetailsForm.markAsDirty()
//         }
//       })
//   }

//   collectSelectedPeople(person: Person) {
//     if (this.selectedPeople) {
//       this.selectedPeople.push(person)
//       this.pendingChanges = true
//       this.addSelectedPeople()
//     }
//   }

//   showPersonWarning() {
//     this.contactGroupDetails.contactPeople.forEach((x) => {
//       x.warning = this.sharedService.showWarning(x.warningStatusId | 1, this.warnings, x.warningStatusComment)
//     })
//   }

//   addSelectedPeople() {
//     if (this.selectedPeople.length) {
//       this.selectedPeople.forEach((x) => {
//         if (!this.sharedService.checkDuplicateInContactGroup(this.contactGroupDetails, x.personId)) {
//           this.contactGroupDetails.contactPeople?.push(x)
//           this.setSalutation()
//         }
//       })
//       if (this.removedPersonIds.length) {
//         this.removedPersonIds.forEach((x) => {
//           this.removePerson(x, false)
//         })
//       }
//     }
//     this.showPersonWarning()
//   }

//   removeSelectedPeople(people, index: number) {
//     people.splice(index, 1)
//     this.setSalutation()
//   }

//   getAddedPersonDetails(personEmitter: any) {
//     // console.log('getAddedPersonDetails: ', personEmitter)
//     if (personEmitter) {
//       personEmitter.person.isNewPerson = true
//       this.addedPerson = personEmitter.person
//       const people = this.contactGroupDetails.contactPeople
//       people?.push(personEmitter.person)
//       this.setSalutation()
//       this.saveContactGroup()
//     }
//   }

//   cloneContactGroup() {
//     // console.log('contact to clone', this.contactGroupDetails)
//     this.isCloned = true
//     if (this.isCloned) {
//       this.contactGroupDetails.contactGroupId = 0
//       this.contactGroupDetails.referenceCount = 0
//     }
//     this.contactGroupDetailsForm.markAsDirty()
//   }

//   public saveContactGroup() {
//     console.log('saveContactGroup contact details', this.contactGroupDetails?.contactPeople)
//     const validForm = this.contactGroupDetailsForm.valid

//     if (this.contactGroupDetailsForm.invalid) {
//       return
//     }
//     if (
//       this.contactGroupDetailsForm.dirty ||
//       this.companyFinderForm.dirty ||
//       this.isExistingCompany ||
//       this.isNewAddress
//     ) {
//       const contactPeople = this.contactGroupDetails.contactPeople.length
//       if (this.selectedPeople.length || contactPeople) {
//         const contactGroup = {
//           ...this.contactGroupDetails,
//           ...this.contactGroupDetailsForm.value
//         }
//         this.isSubmitting = true
//         this.showDuplicateChecker = false

//         if (contactGroup.contactGroupId) {
//           this.updateContactGroup(contactGroup)
//         } else {
//           this.addNewContactGroup(contactGroup)
//         }
//       }
//     }
//   }

//   private addNewContactGroup(contactGroup: ContactGroup) {
//     if (this.isNewCompanyContact) {
//       if (!this.contactGroupDetails) {
//         this.contactGroupDetails = {} as ContactGroup
//         this.contactGroupDetails.contactPeople = []
//       }
//       if (this.companyDetails) {
//         this.isCompanyAdded = true
//         contactGroup.companyId = this.companyDetails.companyId
//         contactGroup.companyName = this.companyDetails.companyName
//         contactGroup.contactType = ContactType.CompanyContact
//         if (!this.contactGroupDetails.contactPeople.length) {
//           this.contactGroupDetails.contactPeople.push(this.selectedPerson)
//         }
//         this.contactGroupService.addContactGroup(contactGroup).subscribe(
//           (res) => {
//             this.onSaveComplete(res.result)
//           },
//           (error: WedgeError) => {
//             this.isSubmitting = false
//           }
//         )
//       } else {
//         this.contactGroupDetails.contactPeople.push(this.selectedPerson)
//         this.isCompanyAdded = false
//         this.isSubmitting = false
//         this.contactGroupDetails.contactType = ContactType.CompanyContact
//       }
//     } else {
//       this.contactGroupService.addContactGroup(contactGroup).subscribe(
//         (res) => {
//           this.onSaveComplete(res.result)
//         },
//         (error: WedgeError) => {
//           this.isSubmitting = false
//         }
//       )
//     }
//   }

//   private updateContactGroup(contactGroup: ContactGroup) {
//     if (contactGroup.companyName) {
//       contactGroup.companyId = this.companyDetails.companyId
//       contactGroup.companyName = this.companyDetails.companyName
//     }
//     // console.log('contact to update', contactGroup)
//     this.contactGroupService.updateContactGroup(contactGroup).subscribe(
//       (res) => {
//         console.log({ res }, 'results from update')

//         this.onSaveComplete(res.result)
//       },
//       (error: WedgeError) => {
//         this.isSubmitting = false
//       }
//     )
//   }

//   onSaveComplete(contactGroup: ContactGroup): void {
//     // console.log('onSaveComplete: contactGroup ', contactGroup)
//     localStorage.removeItem('contactPeople')
//     localStorage.removeItem('newCompany')
//     this.pendingChanges = false
//     this.isSubmitting = false
//     this.messageService.add({
//       severity: 'success',
//       summary: 'Contact Group successfully saved',
//       closable: false
//     })
//     if (
//       this.backToOrigin ||
//       this.sharedService.addAdminContactBs.getValue() ||
//       this.sharedService.addLastOwnerBs.getValue()
//     ) {
//       if (this.isSigner) {
//         this.getSignerDetails(contactGroup.contactGroupId)
//       }
//       this.sharedService.addedContactBs.next(contactGroup)
//       this.sharedService.back()
//     }
//     if (!contactGroup.contactGroupId) {
//       this.sharedService.back()
//     } else {
//       this._router.navigate(['/contact-centre/detail/', 0, 'people', contactGroup.contactGroupId], {
//         replaceUrl: true
//       })
//       if (this.isExistingCompany && this.existingCompanyId) {
//         this._router.navigate(['/company-centre/detail', this.existingCompanyId])
//       }
//     }
//   }

//   setSalutation() {
//     const people = this.contactGroupDetails.contactPeople
//     let salutation = ''
//     let addressee = ''
//     let counter = 0
//     let seperator = ''
//     let type = ContactType.Individual
//     people.forEach((person) => {
//       seperator = counter === 0 ? '' : counter === people.length - 1 ? ' & ' : ' , '
//       addressee += seperator + person.addressee
//       salutation += seperator + person.salutation
//       counter++
//     })
//     if (this.contactGroupDetails.contactType === ContactType.CompanyContact) {
//       type = ContactType.CompanyContact
//     }

//     this.contactGroupDetailsForm.patchValue(
//       {
//         salutation: salutation,
//         addressee: addressee,
//         contactType: type,
//         comments: this.contactGroupDetails.comments
//       },
//       { onlySelf: false }
//     )
//     this.contactGroupDetailsForm.markAsDirty()
//   }

//   setInfoType(type: string, index: number) {
//     this.info = type
//     this.infoTypes.map((t) => (t.isCurrent = false))
//     this.infoTypes[index].isCurrent = true
//     // console.log('info type', this.info)
//   }

//   hideCanvas(event) {
//     this.showDuplicateChecker = event
//     this.personFinderForm.reset()
//     this.renderer.removeClass(document.body, 'no-scroll')
//   }

//   showHideMarkPrefs(event, i) {
//     event.preventDefault()
//     event.stopPropagation()
//     if (i >= 0) {
//       this.isCollapsed[i] = !this.isCollapsed[i]
//     } else {
//       this.isSelectedCollapsed = !this.isSelectedCollapsed
//     }
//   }

//   showHideOffCanvas(event) {
//     event.preventDefault()
//     event.stopPropagation()
//     this.showDuplicateChecker = !this.showDuplicateChecker
//     if (this.showDuplicateChecker) {
//       this.renderer.addClass(document.body, 'no-scroll')
//     } else {
//       this.renderer.removeClass(document.body, 'no-scroll')
//     }
//   }

//   resetCanvasFlag() {
//     this.showDuplicateChecker = false
//   }

//   toggleNewPersonVisibility(condition) {
//     this.isCreateNewPersonVisible = condition
//     console.log({ condition }, 'in people', this.isCreateNewPersonVisible)
//   }

//   addNote() {
//     console.log(this.dataNote, 'data note...')

//     this.sharedService.addNote(this.dataNote)
//   }

//   // Mark form as pristine to allow navigation away when no pending changes. Manual changes to detail section needs to be looked at. 24/02/2021
//   canDeactivate(): boolean {
//     if (!this.pendingChanges) {
//       this.contactGroupDetailsForm.markAsPristine()
//     }
//     if (
//       (this.contactGroupDetailsForm.dirty || this.companyFinderForm.dirty) &&
//       !this.isSubmitting &&
//       !this.isEditingSelectedCompany &&
//       !this.isCreatingNewPerson
//     ) {
//       return false
//     }

//     return true
//   }

//   cancel() {
//     localStorage.removeItem('newCompany')
//     this.sharedService.back()
//   }

//   queryForDuplicatePeople(person) {
//     if (person?.fullName) {
//       this.contactGroupService.getPotentialDuplicatePeople(person).subscribe((data) => {
//         this.potentialDuplicatePeople = data
//         this.newPerson = { ...data }
//       })
//     }
//   }

//   ngOnDestroy() {
//     this.setPageLabel(true)
//     this.destroy.next(true)
//     console.log('destroy contact groups people component now')
//   }
// }
