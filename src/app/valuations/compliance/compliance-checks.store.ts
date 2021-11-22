// compliance-checks.store.ts
/**
 * This is the doc comment for compliance-checks.store.ts
 *
 * @module ComplianceChecksStore
 * @description an NGRX component store that manages compliance checks state for a valuation. Store life cycle is attached to the app-compliance-checks-shell component
 */
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { mergeMap, tap, filter, switchMap, take, map } from 'rxjs/operators'
import { buildStoreState, buildEntitiesArray } from './compliance-checks.store-helpers'
import { ComplianceChecksFacadeService } from './compliance-checks.facade.service'
import { buildComplianceChecksStatusMessages, checkAllEntitiesHaveValidDocs } from './helpers/store-validation-helpers'
import {
  workOutDataShapeForApi,
  mergeFiles,
  removeDocFromDocumentsObject,
  addFiles,
  mapDocumentsForView
} from './helpers/store-documents-helpers'
import { ComplianceChecksState, FileUpdateEvent, FileDeletionPayload } from './compliance-checks.interfaces'
import { Company } from 'src/app/contact-groups/shared/contact-group'
import { Person } from 'src/app/shared/models/person'

const defaultState: ComplianceChecksState = {
  valuationEventId: null,
  contactGroupId: null,
  companyId: null,
  companyOrContact: '',
  checkType: '',
  isFrozen: null,
  compliancePassedDate: null,
  compliancePassedBy: '',
  entities: [],
  checksAreValid: null
}

@Injectable()
export class ComplianceChecksStore extends ComponentStore<ComplianceChecksState> {
  // Observable slices of store state
  readonly entities$: Observable<any> = this.select(({ entities }) => entities)
  readonly contactGroupId$: Observable<any> = this.select(({ contactGroupId }) => contactGroupId)
  readonly checkType$: Observable<any> = this.select(({ checkType }) => checkType)
  readonly checksAreValid$: Observable<boolean> = this.select(this.entities$, this.checkType$, (entities, checkType) =>
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
  readonly _newEntityStream: BehaviorSubject<Company | Person | null> = new BehaviorSubject(null)
  readonly newEntityStream$: Observable<Company | Person | null> = this._newEntityStream.asObservable()

  // Public observable streams

  /***
   * @function contactGroupDetails$
   * @description streams a given contactGroupIds data from the API
   */
  readonly contactGroupDetails$: Observable<any> = this.contactGroupId$.pipe(
    filter((val) => !!val),
    map((contactGroupId) => {
      return this._complianceChecksFacadeSvc.getContactGroupById(contactGroupId)
    })
  )

  /***
   * @function validationMessage$
   * @description streams a validation message for current state of companies/contacts in the store to the colour-coded message box in the UI
   */
  readonly validationMessage$: Observable<any> = combineLatest([
    this.entities$,
    this.checkType$,
    this.compliancePassedDate$,
    this.compliancePassedBy$
  ]).pipe(
    filter(([entities]) => !!entities.length),
    tap(([entities, checkType, compliancePassedDate, compliancePassedBy]) => {
      // console.log('validationMessageData: ', compliancePassedDate, compliancePassedBy)
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
    filter((data) => data),
    mergeMap((data: any): any => {
      // console.log('pushContactsToValuationServiceForSave RUNNING 🏃🏃🏃🏃', data)
      if (data.savePayload) {
        return this._complianceChecksFacadeSvc.updateCompanyAndPersonDocuments(data.savePayload)
      } else {
        return this._complianceChecksFacadeSvc.updatePersonDocuments(data.entitiesToSave) // pops personDocuments array into valuation service to get picked up if/when valuation is saved
      }
    })
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

  // Store updaters that push data out of the store. Observable streams will update accordingly

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

  readonly updateEntity = this.updater((state, entityToUpdate: any) => ({
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === entityToUpdate.id
        ? {
            ...entity,
            name: entityToUpdate.name,
            address: entityToUpdate.address,
            position: entityToUpdate.position
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

  readonly addFilesToEntity = this.updater((state, params: any) => ({
    ...state,
    entities: state.entities.map((entity) =>
      entity.id === params.data.entity.id
        ? addFiles({ ev: params.data.ev, files: params.tmpFiles.files }, entity)
        : entity
    )
  }))

  readonly loadExistingEntity = this.updater((state, entityToAdd: any) => ({
    ...state,
    entities: state.entities.find((e) => e.id === entityToAdd.id)
      ? state.entities
      : [
          ...state.entities,
          {
            ...entityToAdd,
            associatedCompanyId: state.companyId,
            isMain: state.companyId === entityToAdd.id,
            documents: mapDocumentsForView(entityToAdd.documents)
          }
        ]
  }))

  readonly removeFromValuation = this.updater((state, idToRemove: number) => ({
    ...state,
    entities: state.entities.filter((p) => p.id != idToRemove)
  }))

  constructor(private _complianceChecksFacadeSvc: ComplianceChecksFacadeService) {
    super(defaultState)
    // this.loadStore()
  }

  /***
   * @function loadStore
   * @description builds compliance checks store state for the valuation in view
   */
  loadStore = (): void => {
    console.log('loading compliance checks store ')
    combineLatest([
      this._complianceChecksFacadeSvc.contactGroup$,
      this._complianceChecksFacadeSvc.valuation$,
      this.newEntityStream$
    ])
      .pipe(
        filter(([contactGroupData, valuationData]) => !!contactGroupData && !!valuationData),
        take(1),
        mergeMap(([contactGroupData, valuationData, entityToAdd]: [any, any, any]) => {
          this.patchState(buildStoreState(contactGroupData, valuationData, entityToAdd))
          return this.validationMessage$
        }),
        mergeMap(() => this.pushContactsToValuationServiceForSave$)
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err)
      )
  }

  /***
   * @function onPassComplianceChecks
   * @description this function can only run if checks criteria has been met see this.checksAreValid$
   * it loops all entities and stamps their personDateAmlCompleted property saving to API. Displays a message to user that AML checks have passed.
   */
  public onPassComplianceChecks(): void {
    combineLatest([this.entitiesArrayShapedForApi$, this.checksAreValid$])
      .pipe(
        filter(([userDataForApi, checksAreValid]: [any, boolean]) => userDataForApi && checksAreValid),
        take(1),
        mergeMap(([userDataForApi, checksAreValid]: [any, boolean]) => {
          console.log('passComplianceChecksForValution running....')
          return this._complianceChecksFacadeSvc.passComplianceChecksForValution(userDataForApi)
        }),
        mergeMap((res: any) => {
          console.log('onPassComplianceChecks our server says...', res)
          this.addAmlCheckTimestampToUsers()
          this.patchState({
            compliancePassedBy: res.compliancePassedByFullName,
            compliancePassedDate: res.compliancePassedDate,
            isFrozen: true
          })
          return this.validationMessage$.pipe()
        })
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err)
      )
  }

  /***
   * @function onRefreshDocuments
   * @description calls API to unfreeze a valuation. This deletes docs associated with the valuation and updates with docs returned from API call.
   */
  public onRefreshDocuments = (): void => {
    combineLatest([this.contactGroupId$, this.valuationEventId$, this.companyOrContact$])
      .pipe(
        mergeMap(([contactGroupId, valuationEventId, companyOrContact]: [number, number, string]) => {
          if (companyOrContact === 'company') {
            return combineLatest([
              this._complianceChecksFacadeSvc.unfreezeCompanyDocsForValuation(contactGroupId, valuationEventId),
              this.compliancePassedDate$
            ])
          } else {
            return combineLatest([
              this._complianceChecksFacadeSvc.unfreezePeopleDocsForValuation(contactGroupId, valuationEventId),
              this.compliancePassedDate$
            ])
          }
        }),
        mergeMap(([data, passedDate]: [any, Date]) => {
          let entitiesForStore
          if (data.companyId) {
            entitiesForStore = data.companyDocuments.concat(data.personDocuments)
          } else {
            entitiesForStore = data
          }
          const entities = entitiesForStore.map((p) => {
            return { ...p, personDateAmlCompleted: null }
          })
          this.patchState({
            entities: buildEntitiesArray(entities, passedDate),
            isFrozen: false
          })
          return this.validationMessage$
        }),
        take(1)
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err)
      )
  }

  /***
   * @function onFileUploaded
   * @param {Object} data - files object
   * @description calls API to save files to temp storage. Updates this store with those docs and pushes changes to valuationData in _valuationFacadeSvc. User will have to save valuation to persist files.
   */
  public onFileUploaded = (data: FileUpdateEvent): void => {
    if (!data.ev.tmpFiles) return

    this._complianceChecksFacadeSvc
      .saveFileTemp(data.ev.tmpFiles)
      .pipe(
        mergeMap((tmpFiles) => {
          console.log('files after temp save: ', tmpFiles)
          this.addFilesToEntity({ tmpFiles, data }) // adds files to store
          return this.pushContactsToValuationServiceForSave$
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err)
      )
  }

  /***
   * @function onDeleteFileFromEntity
   * @param {Object} data -
   * @description deletes a compliance doc from a entity in the store. User will have to save valuation in order for changes to persist to API
   */
  public readonly onDeleteFileFromEntity = (data: FileDeletionPayload): void => {
    this.removeDocFromStore(data)
    this.pushContactsToValuationServiceForSave$
      .pipe(
        map(() => {
          return this.patchState({
            checksAreValid: false
            // compliancePassedDate: null,
            // compliancePassedBy: null,
          })
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err)
      )
  }

  /***
   * @function onAddNewContact
   * @param {Object} entity - the NEW contact to add to the store
   * @description adds a NEW contact to the valuation. Since this is called before the valuation loads it's set as a BehaviorSubject so the load function can grab it on demand
   */
  public onAddNewContact = (entity: any): void => {
    console.log('onAddNewContact', entity)
    this._newEntityStream.next({
      ...entity,
      isNew: true,
      id: entity.personId,
      documents: [],
      name: `${entity.addressee}`,
      address:
        entity.address && entity.address.addressLines && entity.address.postCode
          ? `${entity.address.addressLines}, ${entity.address.postCode}`
          : ''
    })
  
  }

  /***
   * @function onAddExistingContact
   * @param {Object} entity - the contact to add to the store
   * @description adds an EXISTING contact to the valuation. grabs their docs & data from API and puts in the store
   */
  public onAddExistingContact = (entity: any): void => {
    this._complianceChecksFacadeSvc
      .getAllPersonDocs(entity.id)
      .pipe(
        switchMap((entityDataFromApi) => {
          this.loadExistingEntity(entityDataFromApi)
          return this.pushContactsToValuationServiceForSave$
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err)
      )
  }

  /***
   * @function onAddNewCompany
   * @param {Object} entity - the NEW company to add to the store
   * @description adds a NEW company to the valuation. Since this is called before the valuation loads it's set as a BehaviorSubject so the load function can grab it on demand
   */
  public onAddNewCompany = (entity: any): void => {
    console.log('onAddNewCompany.next(', entity)
    this._newEntityStream.next({
      ...entity,
      isNew: true,
      name: entity.companyName,
      id: entity.companyId,
      documents: [],
      address:
        entity.companyAddress && entity.companyAddress.addressLines && entity.companyAddress.postCode
          ? `${entity.companyAddress.addressLines}, ${entity.companyAddress.postCode}`
          : ''
    })
    // this.pushContactsToValuationServiceForSave$.pipe(take(1)).subscribe(
    //   (res) => console.log(res),
    //   (err) => console.error(err)
    // )
  }

  /***
   * @function onAddExistingCompany
   * @param {Object} entity - the NEW company to add to the store
   * @description adds an EXISTING company to the valuation. grabs their docs & data from API and puts in the store
   */
  public onAddExistingCompany = (entity: any): void => {
    console.log('onAddExistingCompany adding company to store: ', entity)
    this._complianceChecksFacadeSvc
      .getAllDocsForCompany(entity.id)
      .pipe(
        switchMap((entityDataFromApi) => {
          console.log('onAddExistingCompany result from server: ', entityDataFromApi)
          this.loadExistingEntity(entityDataFromApi)
          return this.pushContactsToValuationServiceForSave$
        }),
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err)
      )
  }

  /***
   * @function onRemoveEntity
   * @param {Object} entity:
   * @description removes contact/company from the store and updates the valuation in valuation service. User will need to save valuation to persist the deletion
   */
  public onRemoveEntity = (entity: any): void => {
    this.removeFromValuation(entity.id)
    this.pushContactsToValuationServiceForSave$
      .pipe(
        mergeMap(() => this.validationMessage$.pipe()),
        take(1)
      )
      .subscribe(
        (res) => console.log(res),
        (err) => console.error(err)
      )
  }

  /***
   * @function onUpdateEntity
   * @param {Object} entity - entity or company in the store
   * @description updates an existing entity in the store. Pushed changes to valuation service ready for save.
   */
  public onUpdateEntity = (entity: any): void => {
    // console.log('onUpdateEntity: ', entity)
    this.updateEntity(entity)
    this.pushContactsToValuationServiceForSave$.pipe(take(1)).subscribe(
      (res) => console.log(res),
      (err) => console.error(err)
    )
  }

  /***
   * @function onToggleIsUBO
   * @param entity: person/contact in the store
   * @description toggles the isUBO flag against a company/contact by setting the necesary timestamps in the store for that entity
   */
  public onToggleIsUBO = (entity: any): void => {
    this.toggleUserIsUBO(entity.id)
    this.pushContactsToValuationServiceForSave$.pipe(take(1)).subscribe(
      (res) => console.log(res),
      (err) => console.error(err)
    )
  }

  readonly isPowerOfAttorneyChanges$ = this._complianceChecksFacadeSvc.isPowerOfAttorneyChanged$
    .pipe(
      filter((data) => data.action),
      mergeMap((data): any => {
        console.log('inside isPowerAttorneyObservable$: ', data)
        switch (data.action) {
          case 'add':
            data.admin.isAdmin = true
            this.loadExistingEntity(data.admin)
            break
          case 'remove':
            this.removeFromValuation(data.id)
            break
        }
        return this.pushContactsToValuationServiceForSave$
      }),
      mergeMap(() => this.validationMessage$.pipe())
    )
    .subscribe(
      (data) => {
        console.log('isPowerOfAttorneyChanges: ', data)
      },
      (err) => {
        console.error('isPowerOfAttorneyChanges err: ', err)
      }
    )
}
