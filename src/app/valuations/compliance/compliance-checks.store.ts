import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { ValuationService } from 'src/app/valuations/shared/valuation.service'
import { FileService } from 'src/app/core/services/file.service'
import { mergeMap, tap, filter, switchMap, take, first } from 'rxjs/operators'
import { PeopleService } from 'src/app/core/services/people.service'
import {
  setContactsForCompliance,
  buildPartialLoadState,
  workOutDataShapeForApi,
  addExistingEntity
} from './compliance-checks.store-helpers'
import { buildComplianceChecksStatusMessages, checkAllEntitiesHaveValidDocs } from './helpers/store-validation-helpers'
import { mergeFiles, removeDocFromDocumentsObject, addFiles, addDocsShell } from './helpers/store-documents-helpers'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { ComplianceChecksState, FileUpdateEvent, FileDeletionPayload } from './compliance-checks.interfaces'
import { Company } from 'src/app/contact-groups/shared/contact-group'

const defaultState: ComplianceChecksState = {
  contactGroupId: null,
  companyOrContact: null,
  checksAreValid: null,
  compliancePassedDate: null,
  compliancePassedBy: '',
  checkType: '',
  entities: [],
  valuationEventId: null,
  companyId: null,
  isFrozen: null
}

@Injectable()
export class ComplianceChecksStore extends ComponentStore<ComplianceChecksState> {
  readonly _newCompanyStream: BehaviorSubject<Company | null> = new BehaviorSubject(null)
  readonly newCompanyStream$: Observable<any> = this._newCompanyStream.asObservable()

  // Observable slices of store state
  readonly entities$: Observable<any> = this.select(({ entities }) => entities)
  readonly contactGroupId$: Observable<any> = this.select(({ contactGroupId }) => contactGroupId)
  readonly checkType$: Observable<any> = this.select(({ checkType }) => checkType)
  readonly checksAreValid$: Observable<any> = this.select(this.entities$, this.checkType$, (entities, checkType) =>
    checkAllEntitiesHaveValidDocs(entities, checkType)
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
    this.entities$,
    this.checkType$,
    this.compliancePassedDate$,
    this.compliancePassedBy$
  ]).pipe(
    filter(([entities]) => !!entities.length),
    tap(([entities, checkType, compliancePassedDate, compliancePassedBy]) => {
      const validationMessageData = buildComplianceChecksStatusMessages(
        entities,
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
   * @function entitiesArrayShapedForApi$
   * @description takes entities out of store data shape and preps them for saving to the API
   */
  private entitiesArrayShapedForApi$: Observable<any> = combineLatest([
    this.entities$,
    this.companyOrContact$,
    this.companyId$,
    this.contactGroupId$
  ]).pipe(
    mergeMap(([entities, companyOrContact, companyId, contactGroupId]) => {
      return of(workOutDataShapeForApi(entities, companyOrContact, companyId, contactGroupId))
    })
  )

  /***
   * @function pushContactsToValuationServiceForSave$
   * @description takes documents out of the store, shapes them for the API and puts them in the valuation service ready for picking up when user saves valuation
   */
  private pushContactsToValuationServiceForSave$: Observable<any> = this.entitiesArrayShapedForApi$.pipe(
    tap((data) => {
      console.log('pushContactsToValuationServiceForSave RUNNING 🏃🏃🏃🏃')
      if (data.savePayload) {
        this.valuationSvc.updateCompanyDocuments(data.savePayload.companyDocuments)
        this.valuationSvc.updatePersonDocuments(data.savePayload.personDocuments) // pops personDocuments array into valuation service to get picked up if/when valuation is saved
      } else {
        this.valuationSvc.updatePersonDocuments(data.entitiesToSave) // pops personDocuments array into valuation service to get picked up if/when valuation is saved
      }
    })
    // mergeMap(() => this.validationMessage$.pipe()),
  )

  /***
   * @function complianceChecksVm$
   * @description data streams to serve the view model for compliance checks components
   */
  public complianceChecksVm$: Observable<any> = this.select(
    this.entities$,
    this.contactGroupId$,
    this.contactGroupDetails$,
    this.checkType$,
    this.checksAreValid$,
    this.companyOrContact$,
    this.message$,
    this.isFrozen$,
    (
      entities,
      contactGroupId,
      contactGroupDetails,
      checkType,
      checksAreValid,
      companyOrContact,
      message,
      isFrozen
    ) => ({
      entities,
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

  readonly loadContactsToStore = this.updater((state, entities: any[] | null) => ({
    ...state,
    entities: entities || []
  }))

  readonly mergeUserDocsIntoStore = this.updater((state, data: any) => ({
    ...state,
    entities: state.entities.map((entity) => (entity.id === data.entity.id ? mergeFiles(data, entity) : entity))
  }))

  readonly removeDocFromStore = this.updater((state, data: any) => ({
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === data.entity.id ? removeDocFromDocumentsObject(data) : entity
    )
  }))

  readonly removeAmlCheckTimestampFromUser = this.updater((state, id: number) => ({
    ...state,
    entities: state.entities.map((entity) => (entity.id === id ? { ...entity, personDateAmlCompleted: null } : entity))
  }))

  readonly toggleUserIsUBO = this.updater((state, id: number) => ({
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === id
        ? {
            ...entity,
            isUBO: !entity.isUBO,
            uboAdded: entity.isUBO ? null : new Date()
          }
        : entity
    )
  }))

  readonly updateEntity = this.updater((state, entity: any) => ({
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === entity.id
        ? {
            ...entity,
            name: entity.name,
            address: entity.address,
            position: entity.position
          }
        : entity
    )
  }))

  readonly addAmlCheckTimestampToUsers = this.updater((state) => ({
    ...state,
    entities: state.entities.map((entity) => {
      return { ...entity, personDateAmlCompleted: new Date() }
    })
  }))

  readonly addFilesToUser = this.updater((state, params: any) => ({
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === params.data.entity.id
        ? addFiles({ ev: params.data.ev, files: params.tmpFiles.files }, entity)
        : entity
    )
  }))

  readonly loadExistingEntity = this.updater((state, entityToAdd: any) => ({
    ...state,
    entities: [...state.entities, addExistingEntity(state, entityToAdd)]
  }))

  readonly addEntityToValuation = this.updater((state, entityToAdd: any) => ({
    ...state,
    entities: [...state.entities, { ...entityToAdd, documents: addDocsShell() }]
  }))

  readonly removeFromValuation = this.updater((state, idToRemove: number) => ({
    ...state,
    entities: state.entities.filter((p) => p.id != idToRemove)
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
        take(1),
        tap(([contactGroupData, valuationData]) => {
          console.log('patching store state: ')
          this.patchState(buildPartialLoadState(contactGroupData.companyId, valuationData))
        }),
        mergeMap(([contactGroupData, valuation]) => {
          if (contactGroupData.companyId) {
            return combineLatest([
              this.peopleService.getCompanyPeopleDocs(contactGroupData.contactGroupId, valuation.valuationEventId),
              this.compliancePassedDate$,
              this.newCompanyStream$
            ])
          } else if (valuation && valuation.propertyOwner) {
            return combineLatest([
              this.peopleService.getPeopleDocsForValuation(
                valuation.propertyOwner.contactGroupId,
                valuation.valuationEventId
              ),
              this.compliancePassedDate$
            ])
          }
        }),
        mergeMap(([data, passedDate, entityToAdd]) => {
          console.log('entityToAdd: ', entityToAdd)
          let entitiesData
          if (data.companyDocuments) {
            entitiesData = data.companyDocuments.concat(data.personDocuments)
            if (entityToAdd) entitiesData.push(entityToAdd)
            console.log('entititesData: ', entitiesData)
            return of(this.patchState({ entities: setContactsForCompliance(entitiesData, passedDate) }))
          } else {
            return of(this.patchState({ entities: setContactsForCompliance(data, passedDate) }))
          }
        }),
        mergeMap(() => this.validationMessage$),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function onPassComplianceChecks
   * @description this function can only run if checks criteria has been met see this.checksAreValid$
   * it loops all entities and stamps their personDateAmlCompleted property saving to API. Displays a message to user that AML checks have passed.
   */
  public onPassComplianceChecks() {
    let valuationEventIdClosure
    combineLatest([this.checksAreValid$, this.valuationEventId$])
      .pipe(
        filter(([checksAreValid]) => checksAreValid),
        mergeMap(([checksAreValid, valuationEventId]: [any, number]) => {
          valuationEventIdClosure = valuationEventId
          this.addAmlCheckTimestampToUsers()
          return this.entitiesArrayShapedForApi$
        }),
        mergeMap((userDataForApi) => {
          if (userDataForApi.entitiesToSave) {
            return this.peopleService.setPeopleDocsForValuation(
              userDataForApi.entitiesToSave,
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
   * @function onFileUploaded
   * @param {Object} data - files object
   * @description calls API to save files to temp storage. Updates this store with those docs and pushes changes to valuation in valuationService. User will have to save valuation to persist files.
   */
  public onFileUploaded = (data: FileUpdateEvent) => {
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
   * @function onDeleteFileFromEntity
   * @param {Object} data -
   * @description deletes a compliance doc from a entity in the store. User will have to save valuation in order for changes to persist to API
   */
  public readonly onDeleteFileFromEntity = (data: FileDeletionPayload) => {
    this.removeDocFromStore(data)
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
   * @function onAddContact
   * @param {Object} data - the contact to add to the store
   * @description adds an existing contact to the valuation. grabs their docs & data from API and puts in the store
   */
  public onAddContact = (data: any) => {
    this.peopleService
      .getAllPersonDocs(data.id)
      .pipe(
        switchMap((entity) => {
          console.log('Existing entity = ', entity)
          this.loadExistingEntity(entity)
          return this.pushContactsToValuationServiceForSave$
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function onAddNewCompany
   * @param {Object} data - the NEW company to add to the store
   * @description adds a new company to the valuation. Since this is called before the valuation loads it's set as a BehaviorSubject so the load function can grab it on demand
   */
  public onAddNewCompany = (data: any) => {
    console.log('onAddNewCompany.next(', data)
    if (data) {
      this._newCompanyStream.next({ ...data, name: data.companyName, id: data.companyId, documents: [] })
    }
  }
  /***
   * @function onAddCompany
   * @param {Object} data - the company to add to the store
   * @description adds an existing company to the valuation. grabs their docs & data from API and puts in the store
   */
  public onAddCompany = (data: any) => {
    console.log('onAddCompany adding company to store: ', data)
    this.peopleService
      .getCompanyDocs(data.companyId)
      .pipe(
        switchMap((company) => {
          this.loadExistingEntity(company)
          return this.pushContactsToValuationServiceForSave$
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function onRemoveEntity
   * @param {Object} data:
   * @description removes contact/company from the store and updates the valuation in valuation service. User will need to save valuation to persist the deletion
   */
  public onRemoveEntity = (data: any) => {
    this.removeFromValuation(data.id)
    this.pushContactsToValuationServiceForSave$
      .pipe(
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe()
  }

  /***
   * @function onUpdateEntity
   * @param {Object} data - entity or company in the store
   * @description
   */
  public onUpdateEntity = (data: any) => {
    console.log('onSaveContact: ', data)
    this.updateEntity(data)
    this.pushContactsToValuationServiceForSave$.pipe(take(1)).subscribe()
  }

  /***
   * @function onToggleIsUBO
   * @param data:
   * @description toggles the isUBO flag against a company/contact by setting the necesary timestamps in the store for that entity/company
   */
  public onToggleIsUBO = (data: any) => {
    this.toggleUserIsUBO(data.id)
    this.pushContactsToValuationServiceForSave$.pipe(take(1)).subscribe()
  }

  /***
   * @function onRefreshDocuments
   * @description calls API to remove docs associated with the valuation. Updates store with docs returned from API call.
   */
  public onRefreshDocuments = () => {
    combineLatest([this.contactGroupId$, this.valuationEventId$, this.companyOrContact$])
      .pipe(
        mergeMap(([contactGroupId, valuationEventId, companyOrContact]: [number, number, string]) => {
          if (companyOrContact === 'company') {
            return combineLatest([
              this.peopleService.deleteCompanyDocs(contactGroupId, valuationEventId),
              this.compliancePassedDate$
            ])
          } else {
            return combineLatest([
              this.peopleService.deletePeopleDocsForValuation(contactGroupId, valuationEventId),
              this.compliancePassedDate$
            ])
          }
        }),
        mergeMap(([data, passedDate]) => {
          let entitiesForStore
          if (data.companyId) {
            entitiesForStore = data.companyDocuments.concat(data.personDocuments)
          } else {
            entitiesForStore = data.entitiesToSave
          }
          const entities = entitiesForStore.map((p) => {
            return { ...p, personDateAmlCompleted: null }
          })
          this.patchState({
            entities: setContactsForCompliance(entities, passedDate),
            isFrozen: false
          })
          return this.validationMessage$
        }),
        take(1)
      )
      .subscribe()
  }
}
