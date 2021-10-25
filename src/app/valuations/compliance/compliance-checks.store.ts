import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { combineLatest, Observable, of } from 'rxjs'
import { ValuationService } from 'src/app/valuations/shared/valuation.service'
import { FileService } from 'src/app/core/services/file.service'
import { mergeMap, tap, filter, switchMap, take, first } from 'rxjs/operators'
import { PeopleService } from 'src/app/core/services/people.service'
import {
  setContactsForCompliance,
  buildPartialLoadState,
  workOutDataShapeForApi,
  addExistingPersonOrCompany
} from './compliance-checks.store-helpers'
import { buildComplianceChecksStatusMessages, checkAllPeopleHaveValidDocs } from './helpers/store-validation-helpers'
import { mergeFiles, removeDocFromDocumentsObject, addFiles, addDocsShell } from './helpers/store-documents-helpers'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { ComplianceChecksState, FileUpdateEvent, FileDeletionPayload } from './compliance-checks.interfaces'

const defaultState: ComplianceChecksState = {
  contactGroupId: null,
  companyOrContact: null,
  checksAreValid: null,
  compliancePassedDate: null,
  compliancePassedBy: '',
  checkType: '',
  people: [],
  valuationEventId: null,
  companyId: null,
  isFrozen: null
}

@Injectable()
export class ComplianceChecksStore extends ComponentStore<ComplianceChecksState> {
  // Observable slices of store state
  readonly people$: Observable<any> = this.select(({ people }) => people)
  readonly contactGroupId$: Observable<any> = this.select(({ contactGroupId }) => contactGroupId)
  readonly checkType$: Observable<any> = this.select(({ checkType }) => checkType)
  readonly checksAreValid$: Observable<any> = this.select(this.people$, this.checkType$, (people, checkType) =>
    checkAllPeopleHaveValidDocs(people, checkType)
  )
  readonly companyOrContact$: Observable<any> = this.select(({ companyOrContact }) => companyOrContact)
  readonly message$: Observable<any> = this.select(({ message }) => message)
  readonly compliancePassedBy$: Observable<any> = this.select(({ compliancePassedBy }) => compliancePassedBy).pipe()
  readonly compliancePassedDate$: Observable<any> = this.select(
    ({ compliancePassedDate }) => compliancePassedDate
  ).pipe()
  readonly valuationEventId$: Observable<any> = this.select(({ valuationEventId }) => valuationEventId).pipe()
  readonly companyId$: Observable<any> = this.select(({ companyId }) => companyId).pipe()
  readonly isFrozen$: Observable<any> = this.select(({ isFrozen }) => isFrozen).pipe()

  // Public observable streams

  /***
   * @function contactGroupDetails$
   * @description streams a given contactGroupIds data from the API
   */
  readonly contactGroupDetails$: Observable<any> = this.contactGroupId$.pipe(
    filter((val) => !!val),
    switchMap((contactGroupId) => {
      return this.contactGroupService.getContactGroupById(contactGroupId, true)
    })
  )

  /***
   * @function validationMessage$
   * @description streams a validation message for current state of companies/contacts in the store
   */
  readonly validationMessage$: Observable<any> = combineLatest([
    this.people$,
    this.checkType$,
    this.compliancePassedDate$,
    this.compliancePassedBy$
  ]).pipe(
    filter(([people]) => !!people.length),
    tap(([people, checkType, compliancePassedDate, compliancePassedBy]) => {
      const validationMessageData = buildComplianceChecksStatusMessages(
        people,
        checkType,
        compliancePassedDate,
        compliancePassedBy
      )
      this.patchState({
        checksAreValid: validationMessageData.valid,
        message: {
          type: validationMessageData.type,
          text: validationMessageData.text
        }
      })
    })
  )

  /***
   * @function peopleArrayShapedForApi$
   * @description takes people out of store data shape and preps them for saving to the API
   */
  public peopleArrayShapedForApi$: Observable<any> = combineLatest([
    this.people$,
    this.companyOrContact$,
    this.companyId$,
    this.contactGroupId$
  ]).pipe(
    mergeMap(([people, companyOrContact, companyId, contactGroupId]) => {
      return of(workOutDataShapeForApi(people, companyOrContact, companyId, contactGroupId))
    })
  )

  /***
   * @function pushContactsToValuationServiceForSave$
   * @description takes documents out of the store, shapes them for the API and puts them in the valuation service ready for picking up when user saves valuation
   */
  public pushContactsToValuationServiceForSave$: Observable<any> = this.peopleArrayShapedForApi$.pipe(
    tap((data) => {
      console.log('pushContactsToValuationServiceForSave RUNNING 🏃🏃🏃🏃')
      if (data.savePayload) {
        this.valuationSvc.updateCompanyDocuments(data.savePayload.companyDocuments)
        this.valuationSvc.updatePersonDocuments(data.savePayload.personDocuments) // pops personDocuments array into valuation service to get picked up if/when valuation is saved
      } else {
        this.valuationSvc.updatePersonDocuments(data.peopleToSave) // pops personDocuments array into valuation service to get picked up if/when valuation is saved
      }
    })
    // mergeMap(() => this.validationMessage$.pipe()),
  )

  /***
   * @function complianceChecksVm$
   * @description data streams to serve the view model for compliance checks components
   */
  public complianceChecksVm$: Observable<any> = this.select(
    this.people$,
    this.contactGroupId$,
    this.contactGroupDetails$,
    this.checkType$,
    this.checksAreValid$,
    this.companyOrContact$,
    this.message$,
    this.isFrozen$,
    (people, contactGroupId, contactGroupDetails, checkType, checksAreValid, companyOrContact, message, isFrozen) => ({
      people,
      contactGroupId,
      contactGroupDetails,
      checkType,
      checksAreValid,
      companyOrContact,
      message,
      isFrozen
    })
  )

  // Store updaters. Creates immutable changes to store objects. Observable streams will update accordingly

  readonly loadContactsToStore = this.updater((state, people: any[] | null) => ({
    ...state,
    people: people || []
  }))

  readonly mergeUserDocsIntoStore = this.updater((state, data: any) => ({
    ...state,
    people: state.people.map((person) => (person.id === data.person.id ? mergeFiles(data, person) : person))
  }))

  readonly removeUserDocsFromStore = this.updater((state, data: any) => ({
    ...state,
    people: state.people.map((person) => (person.id === data.person.id ? removeDocFromDocumentsObject(data) : person))
  }))

  readonly removeAmlCheckTimestampFromUser = this.updater((state, id: number) => ({
    ...state,
    people: state.people.map((person) => (person.id === id ? { ...person, personDateAmlCompleted: null } : person))
  }))

  readonly toggleUserIsUBO = this.updater((state, id: number) => ({
    ...state,
    people: state.people.map((person) =>
      person.id === id
        ? {
            ...person,
            isUBO: !person.isUBO,
            uboAdded: person.isUBO ? null : new Date()
          }
        : person
    )
  }))

  readonly addAmlCheckTimestampToUsers = this.updater((state) => ({
    ...state,
    people: state.people.map((person) => {
      return { ...person, personDateAmlCompleted: new Date() }
    })
  }))

  readonly addFilesToUser = this.updater((state, params: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.id === params.data.person.id
        ? addFiles({ ev: params.data.ev, files: params.tmpFiles.files }, person)
        : person
    )
  }))

  readonly loadExistingPersonOrCompany = this.updater((state, personToAdd: any) => ({
    ...state,
    people: [...state.people, addExistingPersonOrCompany(personToAdd)]
  }))

  readonly addCompanyOrContactToValuation = this.updater((state, thingToAdd: any) => ({
    ...state,
    people: [...state.people, { ...thingToAdd, documents: addDocsShell() }]
  }))

  readonly removeFromValuation = this.updater((state, idToRemove: number) => ({
    ...state,
    people: state.people.filter((p) => p.id != idToRemove)
  }))

  constructor(
    private valuationSvc: ValuationService,
    private readonly fileService: FileService,
    private peopleService: PeopleService,
    private contactGroupService: ContactGroupsService
  ) {
    super(defaultState)
    this.loadStore()
  }

  /***
   * @function loadStore
   * @description loads the store when a valuation is loaded into view
   */
  loadStore = () => {
    combineLatest([this.valuationSvc.contactGroup$, this.valuationSvc.valuation$])
      .pipe(
        filter(([contactGroupData, valuation]) => !!valuation && !!contactGroupData),
        tap(([contactGroupData, valuationData]) => {
          this.patchState(buildPartialLoadState(contactGroupData, valuationData))
        }),
        mergeMap(([contactGroupData, valuation]) => {
          if (contactGroupData.companyId) {
            return this.peopleService.getCompanyPeopleDocs(contactGroupData.contactGroupId, valuation.valuationEventId)
          } else if (valuation && valuation.propertyOwner) {
            return this.peopleService.getPeopleDocs(valuation.propertyOwner.contactGroupId, valuation.valuationEventId)
          }
        }),
        mergeMap((data) => {
          let peopleData
          if (data.companyDocuments) {
            peopleData = data.companyDocuments.concat(data.personDocuments)
            return of(this.patchState({ people: setContactsForCompliance(peopleData) }))
          } else {
            return of(this.patchState({ people: setContactsForCompliance(data) }))
          }
        }),
        mergeMap(() => this.validationMessage$),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function passComplianceChecks
   * @description this function can only run if checks criteria has been met see this.checksAreValid$
   * it loops all people and stamps their personDateAmlCompleted property saving to API. Displays a message to user that AML checks have passed.
   */
  public passComplianceChecks() {
    let valuationEventIdClosure
    combineLatest([this.checksAreValid$, this.valuationEventId$])
      .pipe(
        filter(([checksAreValid]) => checksAreValid),
        mergeMap(([checksAreValid, valuationEventId]: [any, number]) => {
          valuationEventIdClosure = valuationEventId
          this.addAmlCheckTimestampToUsers()
          return this.peopleArrayShapedForApi$
        }),
        mergeMap((userDataForApi) => {
          if (userDataForApi.peopleToSave) {
            return this.peopleService.setPeopleDocs(
              userDataForApi.peopleToSave,
              userDataForApi.contactGroupId,
              valuationEventIdClosure
            )
          } else {
            return this.peopleService.setCompanyPeopleDocs(
              userDataForApi.savePayload,
              userDataForApi.contactGroupId,
              valuationEventIdClosure
            )
          }
        }),
        mergeMap(() => {
          return this.valuationSvc.setComplianceChecksPassedState(valuationEventIdClosure, {
            customPassedDate: new Date(),
            isPassed: true
          })
        }),
        tap((res) => {
          return this.patchState({
            compliancePassedBy: res.compliancePassedByFullName,
            compliancePassedDate: res.compliancePassedDate,
            isFrozen: true
          })
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function addFilesToPerson
   * @param data:
   * @description calls API to save files to temp storage. Updates this store with those docs and pushes changes to valuation in valuationService. User will have to save valuation to persist files.
   */
  public addFilesToPerson = (data: FileUpdateEvent) => {
    if (!data.ev.tmpFiles) return

    const formData = new FormData()
    data.ev.tmpFiles.forEach((x) => {
      formData.append('files', x, x.name)
    })

    return this.fileService
      .saveFileTemp(formData)
      .pipe(
        mergeMap((tmpFiles) => {
          this.addFilesToUser({ tmpFiles, data }) // adds files to store
          return this.pushContactsToValuationServiceForSave$
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function deleteFileFromPerson
   * @param data:
   * @description deletes a compliance doc from a person in the store. User will have to save valuation in order for changes to persist to API
   */
  public deleteFileFromPerson = (data: FileDeletionPayload) => {
    this.removeUserDocsFromStore(data)
    this.pushContactsToValuationServiceForSave$
      .pipe(
        tap(() => {
          return this.patchState({
            checksAreValid: false
            // compliancePassedDate: null,
            // compliancePassedBy: null,
          })
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function addContact
   * @param data:
   * @description adds an existing contact to the valuation. grabs their docs & data from API and puts in the store
   */
  public addContact = (data: any) => {
    this.peopleService
      .getPersonDocs(data.id)
      .pipe(
        switchMap((person) => {
          console.log('Existing person = ', person)
          this.loadExistingPersonOrCompany(person)
          return this.pushContactsToValuationServiceForSave$
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function addCompany
   * @param data:
   * @description adds an existing company to the valuation. grabs their docs & data from API and puts in the store
   */
  public addCompany = (data: any) => {
    this.peopleService
      .getCompanyDocs(data.companyId)
      .pipe(
        switchMap((company) => {
          this.loadExistingPersonOrCompany(company)
          return this.pushContactsToValuationServiceForSave$
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function toggleIsUBO
   * @param data:
   * @description toggles the isUBO flag against a company/contact by setting the necesary timestamps in the store for that person/company
   */
  public toggleIsUBO = (data: any) => {
    this.toggleUserIsUBO(data.id)
    this.pushContactsToValuationServiceForSave$.pipe(take(1)).subscribe()
  }

  /***
   * @function removeContact
   * @param data:
   * @description removes contact/company from the store and updates the valuation in valuation service. User will need to save valuation to persist the deletion
   */
  public removeContact = (data: any) => {
    this.removeFromValuation(data.id)
    this.pushContactsToValuationServiceForSave$
      .pipe(
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function saveContact
   * @param data:
   * @description
   */
  public saveContact = (data: any) => {
    console.log('saveContact: ', data)
  }

  /***
   * @function onRefreshDocuments
   * @param data: ?? todo
   * @description calls API to remove docs associated with the valuation. Updates store with docs returned from API call.
   */
  public onRefreshDocuments = (data: any) => {
    console.log('onRefreshDocuments: ', data)
    combineLatest([this.contactGroupId$, this.valuationEventId$, this.companyOrContact$])
      .pipe(
        mergeMap(([contactGroupId, valuationEventId, companyOrContact]: [number, number, string]) => {
          if (companyOrContact === 'company') {
            return this.peopleService.deleteCompanyDocs(contactGroupId, valuationEventId)
          } else {
            return this.peopleService.deletePeopleDocs(contactGroupId, valuationEventId)
          }
        }),
        mergeMap((data) => {
          let peopleForStore
          if (data.companyId) {
            peopleForStore = data.companyDocuments.concat(data.personDocuments)
          } else {
            peopleForStore = data.peopleToSave
          }
          const people = peopleForStore.map((p) => {
            return { ...p, personDateAmlCompleted: null }
          })
          this.patchState({
            people: setContactsForCompliance(people),
            isFrozen: false
          })
          return this.validationMessage$
        }),
        take(1)
      )
      .subscribe()
  }
}
