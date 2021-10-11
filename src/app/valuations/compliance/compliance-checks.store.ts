import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { combineLatest, Observable, of } from 'rxjs'
import { ValuationService } from 'src/app/valuations/shared/valuation.service'
import { FileService } from 'src/app/core/services/file.service'
import { mergeMap, tap, filter, switchMap, take, first } from 'rxjs/operators'
import { PeopleService } from 'src/app/core/services/people.service'
import { Person } from '../../shared/models/person'
import {
  mapDocsForAPI,
  setContactsForCompliance,
  mergeFiles,
  removeDocFromDocumentsObject,
  checkAllPeopleHaveValidDocs,
  addFiles,
  buildPartialLoadState,
  buildComplianceChecksStatusMessages,
  personValidForAML,
  personValidForKYC,
  workOutDataShapeForApi,
  addDocsShell,
} from './compliance-checks.store-helpers'
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
}

@Injectable()
export class ComplianceChecksStore extends ComponentStore<ComplianceChecksState> {
  // Public observable streams
  readonly people$: Observable<any> = this.select(({ people }) => people)
  readonly contactGroupId$: Observable<any> = this.select(({ contactGroupId }) => contactGroupId)
  readonly checkType$: Observable<any> = this.select(({ checkType }) => checkType)
  readonly checksAreValid$: Observable<any> = this.select(this.people$, this.checkType$, (people, checkType) =>
    checkAllPeopleHaveValidDocs(people, checkType),
  )
  readonly companyOrContact$: Observable<any> = this.select(({ companyOrContact }) => companyOrContact)
  readonly message$: Observable<any> = this.select(({ message }) => message)
  readonly contactGroupDetails$: Observable<any> = this.contactGroupId$.pipe(
    filter((val) => !!val),
    switchMap((contactGroupId) => {
      return this.contactGroupService.getContactGroupById(contactGroupId, true)
    }),
  )
  readonly compliancePassedBy$: Observable<any> = this.select(({ compliancePassedBy }) => compliancePassedBy).pipe()

  readonly compliancePassedDate$: Observable<any> = this.select(
    ({ compliancePassedDate }) => compliancePassedDate,
  ).pipe()

  readonly valuationEventId$: Observable<any> = this.select(({ valuationEventId }) => valuationEventId).pipe()
  readonly companyId$: Observable<any> = this.select(({ companyId }) => companyId).pipe()

  readonly validationMessage$: Observable<any> = combineLatest([
    this.people$,
    this.checkType$,
    this.compliancePassedDate$,
    this.compliancePassedBy$,
  ]).pipe(
    filter(([people]) => !!people.length),
    tap(([people, checkType, compliancePassedDate, compliancePassedBy]) => {
      const validationMessageData = buildComplianceChecksStatusMessages(
        people,
        checkType,
        compliancePassedDate,
        compliancePassedBy,
      )
      this.patchState({
        checksAreValid: validationMessageData.valid,
        message: {
          type: validationMessageData.type,
          text: validationMessageData.text,
        },
      })
    }),
  )

  public peopleArrayShapedForApi$: Observable<any> = combineLatest([
    this.people$,
    this.companyOrContact$,
    this.companyId$,
    this.contactGroupId$,
  ]).pipe(
    mergeMap(([people, companyOrContact, companyId, contactGroupId]) => {
      return of(workOutDataShapeForApi(people, companyOrContact, companyId, contactGroupId))
    }),
  )

  public complianceChecksVm$: Observable<any> = this.select(
    this.people$,
    this.contactGroupId$,
    this.contactGroupDetails$,
    this.checkType$,
    this.checksAreValid$,
    this.companyOrContact$,
    this.message$,
    (people, contactGroupId, contactGroupDetails, checkType, checksAreValid, companyOrContact, message) => ({
      people,
      contactGroupId,
      contactGroupDetails,
      checkType,
      checksAreValid,
      companyOrContact,
      message,
    }),
  )

  // Store updaters. Creates immutable changes to store objects. Observable streams will update accordingly

  readonly loadDataToStore = this.updater((state, data: any[] | null) => ({
    ...state,
    data: data || [],
  }))

  readonly loadContactsToStore = this.updater((state, people: any[] | null) => ({
    ...state,
    people: people || [],
  }))

  readonly mergeUserDocsIntoStore = this.updater((state, data: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.personId === data.person.personId ? mergeFiles(data, person) : person,
    ),
  }))

  readonly removeUserDocsFromStore = this.updater((state, data: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.personId === data.person.personId ? removeDocFromDocumentsObject(data) : person,
    ),
  }))

  readonly removeAmlCheckTimestampFromUser = this.updater((state, personId: string) => ({
    ...state,
    people: state.people.map((person) =>
      person.personId === personId ? { ...person, personDateAmlcompleted: null } : person,
    ),
  }))

  readonly addAmlCheckTimestampToUsers = this.updater((state) => ({
    ...state,
    people: state.people.map((person) => {
      return { ...person, personDateAmlcompleted: new Date() }
    }),
  }))

  readonly addFilesToUser = this.updater((state, params: any) => ({
    ...state,
    people: state.people.map((person) =>
      person.originalId === params.data.person.originalId
        ? addFiles({ ev: params.data.ev, files: params.tmpFiles.files }, person)
        : person,
    ),
  }))

  readonly addCompanyToValuation = this.updater((state, companyToAdd: any) => ({
    ...state,
    people: [...state.people, { ...companyToAdd, documents: addDocsShell() }],
  }))

  constructor(
    private valuationSvc: ValuationService,
    private readonly fileService: FileService,
    private peopleService: PeopleService,
    private contactGroupService: ContactGroupsService,
  ) {
    super(defaultState)
    this.loadStore()
  }

  loadStore = () => {
    combineLatest([this.valuationSvc.contactGroup$, this.valuationSvc.valuation$])
      .pipe(
        filter(([contactGroupData, valuation]) => !!valuation && !!contactGroupData),
        take(1),
        tap(([contactGroupData, valuationData]) =>
          this.patchState(buildPartialLoadState(contactGroupData, valuationData)),
        ),
        mergeMap(([contactGroupData, valuation]) => {
          if (contactGroupData.companyId) {
            return this.peopleService.getCompanyPeopleDocs(contactGroupData.contactGroupId)
          } else if (valuation && valuation.propertyOwner) {
            return this.peopleService.getPeopleDocs(valuation.propertyOwner.contactGroupId)
          }
        }),
        tap((data) => {
          let peopleData
          if (data.companyDocuments) {
            peopleData = data.companyDocuments.concat(data.personDocuments)
            return of(this.patchState({ people: setContactsForCompliance(peopleData) }))
          } else {
            return of(this.patchState({ people: setContactsForCompliance(data) }))
          }
        }),
        mergeMap(() => this.validationMessage$.pipe(take(1))),
      )
      .subscribe(
        (res) => {
          console.log('store loaded: ', res)
        },
        (err) => {
          console.error('error!: ', err)
        },
      )
  }

  /***
   * @description this function can only run if checks criteria has been met see this.checksAreValid$
   * it loops all people and stamps their personDateAmlcompleted property saving to API. Displays a message to user that AML checks have passed.
   */
  public passComplianceChecks() {
    this.complianceChecksVm$
      .pipe(
        take(1),
        filter((vm) => !!vm.checksAreValid),
        switchMap((vm: any) => {
          // console.log('passComplianceChecks', vm)
          this.addAmlCheckTimestampToUsers()
          return this.peopleArrayShapedForApi$
        }),
        mergeMap((userDataForApi) => {
          if (userDataForApi.peopleToSave) {
            return this.peopleService.setPeopleDocs(userDataForApi.peopleToSave, userDataForApi.contactGroupId)
          } else {
            return this.peopleService.setCompanyPeopleDocs(userDataForApi.savePayload, userDataForApi.contactGroupId)
          }
        }),
        mergeMap(() => this.valuationEventId$),
        // take(1),
        mergeMap((valuationEventId) => {
          return this.valuationSvc.setComplianceChecksPassedState(valuationEventId, {
            customPassedDate: new Date(),
            isPassed: true,
          })
        }),
        tap((res) => {
          return this.patchState({
            compliancePassedBy: res.compliancePassedByFullName,
            compliancePassedDate: res.compliancePassedDate,
          })
        }),
        // mergeMap(() => this.validationMessage$.pipe(take(1))),
      )
      .subscribe(
        (res) => {
          console.log('AML checks passed ')
        },
        (err) => {
          console.error('err: ', err)
        },
      )
  }

  /***
   * @description saves file(s) to API. Updates local model with new file(s)
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
        filter((tmpFiles) => !!tmpFiles.files.length),
        mergeMap((tmpFiles) => {
          this.addFilesToUser({ tmpFiles, data })
          return this.peopleArrayShapedForApi$
        }),
        mergeMap((userDataForApi) => {
          if (userDataForApi.peopleToSave) {
            return this.peopleService.setPeopleDocs(userDataForApi.peopleToSave, userDataForApi.contactGroupId)
          } else {
            return this.peopleService.setCompanyPeopleDocs(userDataForApi.savePayload, userDataForApi.contactGroupId)
          }
        }),
        tap((data) => {
          if (data.companyDocuments) {
            let peopleData = data.companyDocuments.concat(data.personDocuments)
            return this.patchState({ people: setContactsForCompliance(peopleData) })
          } else {
            return this.patchState({ people: setContactsForCompliance(data) })
          }
        }),
        take(1),
      )
      .subscribe(
        (res) => {
          console.log('Doc added to person', res)
        },
        (err) => console.error(err),
      )
  }

  /***
   * @function deleteFileFromPerson
   * @param data:
   * @description deletes a compliance doc from a person
   */
  public deleteFileFromPerson = (data: FileDeletionPayload) => {
    this.removeUserDocsFromStore(data)

    combineLatest([this.contactGroupId$, this.people$, this.checkType$])
      .pipe(
        take(1),
        mergeMap(([contactGroupId, people, checkType]) => {
          const peopleToSave = people.map((person) => {
            if (person.personId === data.person.personId) {
              const validDocs =
                checkType === 'AML' ? personValidForAML(person.documents) : personValidForKYC(person.documents)
              if (!validDocs) {
                this.removeAmlCheckTimestampFromUser(person.personId) // updates store values
              }
              return {
                personId: person.personId,
                name: person.name,
                address: person.address,
                documents: mapDocsForAPI(person.documents),
                isMain: person.isMain,
                position: person.position,
                isPassed: false,
              }
            } else {
              return {
                personId: person.personId,
                name: person.name,
                address: person.address,
                documents: mapDocsForAPI(person.documents),
                isMain: person.isMain,
                position: person.position,
                personDateAmlcompleted: person.personDateAmlcompleted,
              }
            }
          })
          // TODO split and send to relevant endpoints company/contact
          return this.peopleService.setPeopleDocs(peopleToSave, contactGroupId)
        }),
        switchMap(() => this.valuationEventId$),
        mergeMap((valuationEventId) => {
          return this.valuationSvc.setComplianceChecksPassedState(valuationEventId, {
            customPassedDate: new Date(),
            personDateAmlcompleted: null,
          })
        }),
        take(1),
        tap(() => {
          return this.patchState({
            checksAreValid: false,
            compliancePassedDate: null,
            compliancePassedBy: null,
          })
        }),
        mergeMap(() => this.validationMessage$.pipe()),
      )
      .subscribe(
        (res) => {
          console.log('Doc deleted')
        },
        (err) => console.error('Err!: ', err),
      )
  }

  public addContact = (data: any) => {
    console.log('TODO: addContact: ', data)
  }

  public addCompany = (data: any) => {
    console.log('TODO: addCompany: ', data)
    of(
      this.addCompanyToValuation({
        id: data.companyId,
        companyId: data.companyId,
        name: data.companyName,
        address: data.companyAddress?.addressLines,
      }),
    )
      .pipe(
        mergeMap(() => {
          return this.peopleArrayShapedForApi$
        }),
        mergeMap((userDataForApi) => {
          if (userDataForApi.peopleToSave) {
            return this.peopleService.setPeopleDocs(userDataForApi.peopleToSave, userDataForApi.contactGroupId)
          } else {
            // this.addAssociatedCompanyId(userDataForApi.savePayload)
            return this.peopleService.setCompanyPeopleDocs(userDataForApi.savePayload, userDataForApi.contactGroupId)
          }
        }),
      )
      .subscribe(
        () => {},
        (err) => {
          console.error('addCompanyErr! ', err)
        },
      )
  }

  public toggleIsUBO = (data: Person) => {
    console.log('TODO: toggleIsUBO: ', data)
  }

  public removeContact = (data: any) => {
    console.log('TODO: removeContact: ', data)
  }

  public saveContact = (data: any) => {
    console.log('saveContact: ', data)
  }
}
