import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { combineLatest, Observable, of } from 'rxjs'
import { ValuationService } from 'src/app/valuations/shared/valuation.service'
import { FileService } from 'src/app/core/services/file.service'
import { mergeMap, tap, filter, switchMap, take, map, flatMap } from 'rxjs/operators'
import { DOCUMENT_TYPE } from './components/document-info/document-info.component'
import { PeopleService } from 'src/app/core/services/people.service'
import { Person } from '../../shared/models/person'
import {
  mapDocsForAPI,
  setContactsForCompliance,
  mergeFiles,
  removeDocFromDocumentsObject,
  checkAllPeopleHaveValidDocs,
  addFiles,
  identifyAmlOrKyc,
  buildComplianceChecksStatusMessages,
} from './compliance-checks.store-helpers'
import moment from 'moment'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { StorageMap } from '@ngx-pwa/local-storage'

export interface ComplianceChecksState {
  checksAreValid: Boolean
  checkType: String // 'AML' || 'KYC'
  contactGroupId: Number
  companyOrContact?: String // 'company' || 'contact'
  message?: {
    type: String // 'warn' || 'info' || 'error'
    text: Array<string>
  }
  people: Array<ComplianceChecksPeople>
}

export interface ComplianceChecksPeople {
  personId: String
  name: String
  address?: String
  position?: String
  documents: Array<any>
  isMain: Boolean
  isUBO?: Boolean
  personDateAmlcompleted?: Date
  complianceChecksRunBy?: String
}

export interface ComplianceDocTypes {
  idDoc: ComplianceDocs
  proofOfAddressDoc: ComplianceDocs
  reportDocs: ComplianceDocs
  additionalDocs: ComplianceDocs
}

export interface ComplianceDocs {
  label: String
  documentType: DOCUMENT_TYPE
  files: Array<any>
}

export interface FileUpdateEvent {
  ev: {
    tmpFiles: Array<any>
    documentType?: DOCUMENT_TYPE
    idValidationDateExpiry?: Date
  }
  person?: Person
}

export interface FileUpdate {
  tmpFiles: Array<any>
}

export interface FileDeletionPayload {
  ev: {
    id: Number
    documentType: DOCUMENT_TYPE
  }
  person: Person
}

const defaultState: ComplianceChecksState = {
  contactGroupId: null,
  companyOrContact: null,
  checksAreValid: null,
  checkType: '',
  people: [],
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
  readonly currentUser$: Observable<any> = this.storage.get('currentUser').pipe()
  readonly companyOrContact$: Observable<any> = this.select(({ companyOrContact }) => companyOrContact)
  readonly message$: Observable<any> = this.select(({ message }) => message)
  readonly checksReadyToRun$: Observable<any> = this.checksAreValid$.pipe(
    filter((val) => !!val),
    map((val) => {
      console.log('val: ', val)
      this.patchState({
        message: {
          type: 'info',
          text: ['Necessary documents present to run compliance checks'],
        },
      })
    }),
  )

  readonly contactGroupDetails$: Observable<any> = this.contactGroupId$.pipe(
    filter((val) => !!val),
    switchMap((contactGroupId) => {
      return this.contactGroupService.getContactGroupById(contactGroupId, true)
    }),
  )

  readonly validationMessage$: Observable<any> = combineLatest([this.people$, this.checkType$]).pipe(
    filter(([people]) => !!people.length),
    tap(([people, checkType]) => {
      const validationMessageData = buildComplianceChecksStatusMessages(people, checkType)
      this.patchState({
        checksAreValid: validationMessageData.valid,
        message: {
          type: validationMessageData.type,
          text: validationMessageData.text,
        },
      })
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

  constructor(
    private valuationSvc: ValuationService,
    private readonly fileService: FileService,
    private peopleService: PeopleService,
    private contactGroupService: ContactGroupsService,
    private storage: StorageMap,
  ) {
    super(defaultState)
    console.log('Compliance checks store under construction')
    this.loadStore()
  }

  loadStore = () => {
    combineLatest([this.valuationSvc.contactGroup$, this.valuationSvc.valuation$])
      .pipe(
        filter(([contactGroupData, valuation]) => contactGroupData && !!contactGroupData.contactGroupId && !!valuation),
        take(1),
        tap(([contactGroupData, valuation]) => {
          this.patchState({
            contactGroupId: contactGroupData.contactGroupId,
            checkType: identifyAmlOrKyc(valuation),
            companyOrContact: contactGroupData.companyId ? 'company' : 'contact',
          })
        }),
        mergeMap(([contactGroupData]) => {
          console.log('contactGroupData: ', contactGroupData)
          if(contactGroupData.companyId){
            return this.peopleService.getCompanyPeopleDocs(contactGroupData.contactGroupId)
          } else {
            return this.peopleService.getPeopleDocs(contactGroupData.contactGroupId)
          }
        }),
        mergeMap((data) => {
          console.log('data: ', data)
          return of(this.patchState({ people: setContactsForCompliance(data) }))
        }),
        mergeMap(() => this.validationMessage$),
      )
      .subscribe(
        () => {},
        (err) => {
          console.error('error!: ', err)
        },
      )
  }

  /***
   * @description this function can only run if checks criteria has been met see this.checksAreValid$
   * it loops all people and stamps their personDateAmlcompleted property saving to API. Displays a message to user that AML checks have passed.
   */
  public passComplianceChecks(data) {
    this.complianceChecksVm$
      .pipe(
        take(1),
        switchMap((vm: any) => {
          const peopleForSave = vm.people.map((person) => {
            return {
              ...person,
              documents: mapDocsForAPI(person.documents),
              personDateAmlcompleted: new Date(),
              complianceChecksRunBy: this.currentUser$.pipe(take(1)),
            }
          })
          console.log('peopleForSave: ', peopleForSave)
          return this.peopleService.setPeopleDocs(peopleForSave, vm.contactGroupId)
        }),
      )
      .subscribe(
        (res) => {
          // move to above out of subscribe like others
          this.patchState({
            message: {
              type: 'success',
              text: [
                'AML Completed',
                '' +
                  moment(res.personDateAmlcompleted).format('Do MMM YYYY (HH:mm)') +
                  ' by ' +
                  res.complianceChecksRunBy,
              ],
            },
          })
          return this.patchState({ checksAreValid: true })
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

    return combineLatest([this.fileService.saveFileTemp(formData), this.contactGroupId$, this.people$.pipe(take(1))])
      .pipe(
        filter(([tmpFiles]) => !!tmpFiles.files.length),
        switchMap(([tmpFiles, contactGroupId, people]) => {
          const personToAddFilesTo = people.filter((person) => person.personId === data.person.personId)
          const mergedDocsForPerson = addFiles({ ev: data.ev, files: tmpFiles.files }, personToAddFilesTo[0])
          const personForSave = [
            {
              ...personToAddFilesTo[0],
              documents: mapDocsForAPI(mergedDocsForPerson.documents),
            },
          ]
          return this.peopleService.setPeopleDocs(personForSave, contactGroupId)
        }),
        tap((person) => {
          return this.mergeUserDocsIntoStore({
            ...data,
            tmpFiles: person.documents,
          }) // merges complete file into relevant person
        }),
        mergeMap(() => this.validationMessage$),
      )
      .subscribe(
        () => {},
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

    combineLatest([this.contactGroupId$, this.people$])
      .pipe(
        take(1),
        mergeMap(([contactGroupId, people]) => {
          const person = people.filter((person) => person.personId === data.person.personId)
          const personForSave = [
            {
              ...person[0],
              documents: mapDocsForAPI(person[0].documents),
              personDateAmlcompleted: null,
            },
          ]
          return this.peopleService.setPeopleDocs(personForSave, contactGroupId)
        }),
        tap((person) => {
          return this.removeAmlCheckTimestampFromUser(person.personId)
        }),
        mergeMap(() => this.validationMessage$),
      )
      .subscribe(
        (res) => {
          console.log('delete doc subscribe: ', res)
        },
        (err) => console.error('Err!: ', err)
      )
  }

  public addContact = (data: any) => {
    console.log('TODO: addContact: ', data)
  }

  public addCompany = (data: any) => {
    console.log('TODO: addCompany: ', data)
  }

  public toggleIsUBO = (data: Person) => {
    console.log('TODO: toggleIsUBO: ', data)
  }

  public removeContact = (data: any) => {
    console.log('TODO: removeContact: ', data)
  }

  public saveContact = (data: any) => {
    console.log('saveContact: ' , data)
  }
}
