import { Injectable } from '@angular/core'
import { HttpClient, HttpParams } from '@angular/common/http'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { AppConstants } from 'src/app/core/shared/app-constants'
import {
  ContactGroupAutoCompleteResult,
  ContactGroupAutoCompleteData,
  PersonContactData,
  ContactGroupData,
  ContactGroup,
  BasicContactGroup,
  BasicContactGroupData,
  CompanyAutoCompleteResult,
  CompanyContactGroupAutoCompleteData as CompanyAutoCompleteData,
  Company,
  CompanyData,
  SignerAutoCompleteData,
  Signer,
  PersonSummaryFiguresData,
  PersonSummaryFigures,
  SignerData,
  PotentialDuplicateResult,
  PeopleAutoCompleteData2,
  ContactNote,
  ContactNoteData,
  ContactType
} from './contact-group.interfaces'
import { map, switchMap, tap, shareReplay } from 'rxjs/operators'
import { Person, BasicPerson } from 'src/app/shared/models/person'
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper'
import { buildMatchedPeople } from './contact-groups.service-helpers'

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsService {
  personNotes: ContactNote[]
  contactGroupNotes: ContactNote[]
  private contactInfoAction$ = new Subject<BasicContactGroup[] | null>()
  private personNotesSubject = new Subject<ContactNote[] | null>()
  private contactGroupNotesSubject = new Subject<ContactNote | null>()
  private notesSubject = new Subject<ContactNote | null>()
  private contactGroupAutocompleteSubject = new Subject<ContactGroupAutoCompleteResult[] | null>()
  private signerSubject = new Subject<Signer | null>()
  private pageChangeSubject = new Subject<number | null>()
  private personNotePageChangeSubject = new Subject<number | null>()
  private contactNotePageChangeSubject = new Subject<number | null>()
  private newPersonSubject = new BehaviorSubject<Person | null>(null)
  noteChanges$ = this.notesSubject.asObservable()
  contactInfoForNotes$ = this.contactInfoAction$.asObservable()
  personNotesChanges$ = this.personNotesSubject.asObservable()
  contactGroupNotesChanges$ = this.contactGroupNotesSubject.asObservable()
  contactGroupAutocomplete$ = this.contactGroupAutocompleteSubject.asObservable()
  pageChanges$ = this.pageChangeSubject.asObservable()
  personNotePageChanges$ = this.personNotePageChangeSubject.asObservable()
  contactNotePageChanges$ = this.contactNotePageChangeSubject.asObservable()
  signer$ = this.signerSubject.asObservable()
  newPerson$ = this.newPersonSubject.asObservable()

  constructor(private http: HttpClient) {}

  getAutocompleteContactGroups(
    searchTerm: any,
    pageSize?: number,
    page?: number
  ): Observable<ContactGroupAutoCompleteResult[]> {
    if (!page || +page === 0) {
      page = 1
    }
    if (pageSize == null) {
      pageSize = 10
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        searchTerm: searchTerm,
        pageSize: pageSize.toString(),
        page: page.toString()
      }
    })
    const url = `${AppConstants.baseContactGroupUrl}/search`
    return this.http.get<ContactGroupAutoCompleteData>(url, { params: options }).pipe(
      map((response) => response.result)
      // tap((data) => console.log(JSON.stringify(data)))
    )
  }

  getCompanySuggestions(searchTerm: string): Observable<any[]> {
    const url = `${AppConstants.baseCompanyUrl}/suggestions?SearchTerm=${searchTerm}`
    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: '' }
      })
      .pipe(
        map((response) => response.result)
        // tap((data) => console.log(JSON.stringify(data)))
      )
  }

  getAutocompleteSigners(searchTerm: string): Observable<Signer[]> {
    const url = `${AppConstants.baseContactGroupUrl}/autocomplete?SearchTerm=${searchTerm}`
    return this.http.get<SignerAutoCompleteData>(url).pipe(
      map((response) => {
        if (response.result) {
          response.result.forEach((x) => {
            x.contactNames = x.companyName ? `${x.companyName} (${x.contactNames})` : x.contactNames
          })
        }
        return response.result
      })
      // tap((data) => console.log(JSON.stringify(data)))
    )
  }

  getApplicants(searchTerm: string): Observable<Signer[]> {
    const url = `${AppConstants.baseApplicantUrl}/search?SearchTerm=${searchTerm}`
    return this.http.get<any>(url).pipe(
      map((response) => response.result)
      // tap((data) => console.log(JSON.stringify(data)))
    )
  }

  getApplicantSuggestions(searchTerm: string, sales: boolean): Observable<any[]> {
    const url = `${AppConstants.baseApplicantUrl}/suggestions?SearchTerm=${searchTerm}&sales=${sales}`
    return this.http.get<any>(url).pipe(
      map((response) => response.result)
      // tap((data) => console.log(JSON.stringify(data)))
    )
  }

  getSignerbyId(contactGroupId: number): Observable<Signer> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/contactNames`
    return this.http.get<SignerData>(url).pipe(map((response) => response.result))
  }

  public getContactGroupById(contactGroupId: number, includeOnlyImportantNotes?: boolean): Observable<ContactGroup> {
    if (!includeOnlyImportantNotes) {
      includeOnlyImportantNotes = false
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        includeOnlyImportantNotes: includeOnlyImportantNotes.toString()
      }
    })
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}`
    return this.http.get<ContactGroupData>(url, { params: options }).pipe(
      map((response) => {
        return {
          ...response.result,
          addressee:
            response.result?.contactType == ContactType.CompanyContact
              ? response.result?.companyName + '(' + response.result?.addressee + ')'
              : response.result?.addressee
        }
      }),
      tap((data) => (this.contactGroupNotes = data.contactNotes)),
      shareReplay()
      // tap(data => console.log('contact group details here...', JSON.stringify(data)))
    )
  }

  getContactPerson(contactGroupId: number, personId: number): Observable<Person> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/person/${personId}`
    return this.http.get<PersonContactData>(url).pipe(map((response) => response.result))
  }

  getPerson(personId: number, includeReferrals = true, includeOnlyImportantNotes?: boolean): Observable<Person> {
    if (!includeOnlyImportantNotes) {
      includeOnlyImportantNotes = false
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        includeOnlyImportantNotes: includeOnlyImportantNotes.toString(),
        includeReferrals: includeReferrals.toString()
      }
    })
    const url = `${AppConstants.basePersonUrl}/${personId}`
    return this.http.get<PersonContactData>(url, { params: options }).pipe(
      map((response) => response.result),
      tap((data) => (this.personNotes = data.personNotes))
      // tap((data) => console.log('person details here...', JSON.stringify(data)))
    )
  }

  getPersonContactGroups(personId: number): Observable<BasicContactGroup[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/contactGroups`
    return this.http.get<BasicContactGroupData>(url).pipe(map((response) => response.result))
  }

  getPersonInfo(personId: number): Observable<PersonSummaryFigures> {
    const url = `${AppConstants.basePersonUrl}/${personId}/info`
    return this.http.get<PersonSummaryFiguresData>(url).pipe(map((response) => response.result))
  }

  getPotentialDuplicatePeople(person: BasicPerson): Observable<PotentialDuplicateResult> {
    const options = new HttpParams()
      .set('fullName', person.fullName || '')
      .set('phoneNumber', person.phoneNumber || '')
      .set('emailAddress', person.emailAddress || '')
    const url = `${AppConstants.basePersonUrl}/duplicates`
    return this.http.get<PeopleAutoCompleteData2>(url, { params: options }).pipe(
      map((response) => buildMatchedPeople(person, response.result))
      // tap((data) => console.log('results for duplicates', data))
    )
  }

  addPerson(person: Person): Observable<Person | any> {
    const url = `${AppConstants.basePersonUrl}`
    return this.http.post<PersonContactData>(url, person).pipe(
      map((response) => response.result)
      // tap((data) => console.log('added person details here...', JSON.stringify(data)))
    )
  }

  updatePerson(person: Person): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${person.personId}`
    return this.http.put(url, person).pipe(
      map((response) => response)
      // tap((data) => console.log('updated person details here...', JSON.stringify(data)))
    )
  }
  createPersonReferral(person: Person, referralCompanyId: number): Observable<any> {
    const url = encodeURI(`${AppConstants.basePersonUrl}/${person?.personId}/referralCompany/${referralCompanyId}`)
    return this.http.put(url, person).pipe(
      map((response) => response)
      // tap((data) => console.log('referral created', JSON.stringify(data)))
    )
  }

  addContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}`
    return this.http.post(url, contactGroup).pipe(
      map((response) => response),
      tap((data) => {
        // console.log('updated contact details here...', JSON.stringify(data))
      })
    )
  }

  updateContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroup.contactGroupId}`
    return this.http.put(url, contactGroup).pipe(
      map((response) => response),
      tap((data) => {
        // console.log('updated contact details here...', JSON.stringify(data))
      })
    )
  }

  getAutocompleteCompany(companyName: any, pageSize?: number, page?: number): Observable<CompanyAutoCompleteResult[]> {
    if (!page || +page === 0) {
      page = 1
    }
    if (pageSize == null) {
      pageSize = 10
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        searchTerm: companyName,
        pageSize: pageSize.toString(),
        page: page.toString()
      }
    })
    const url = `${AppConstants.baseCompanyUrl}/search`
    return this.http.get<CompanyAutoCompleteData>(url, { params: options }).pipe(
      map((response) => response.result)
      // tap((data) => console.log('company list here here...', JSON.stringify(data)))
    )
  }

  getCompany(companyId: number, includeCompanyContacts?: boolean): Observable<Company | any> {
    if (!includeCompanyContacts) {
      includeCompanyContacts = false
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        includeCompanyContacts: includeCompanyContacts.toString()
      }
    })
    const url = `${AppConstants.baseCompanyUrl}/${companyId}`
    return this.http.get<CompanyData>(url, { params: options }).pipe(
      map((response) => response.result)
      // tap((data) => console.log('company details here...', JSON.stringify(data)))
    )
  }

  addCompanyContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseCompanyUrl}`
    return this.http.post(url, contactGroup).pipe(
      map((response) => response)
      // tap((data) => console.log('added company contact details here...', JSON.stringify(data)))
    )
  }

  getPersonNotes(
    personId: number,
    pageSize?: number,
    page?: number,
    myNotesOnly = false,
    filterOptions?: any[]
  ): Observable<ContactNote[]> {
    if (!page || +page === 0) {
      page = 1
    }
    if (pageSize == null) {
      pageSize = 10
    }

    let roles: string[] = []
    let types: string[] = []
    if (filterOptions && filterOptions.length > 0) {
      filterOptions.forEach((x) => {
        if (+x <= 4) {
          types.push(x)
        } else {
          roles.push(this.findRoleEnumValue(x))
        }
      })
    }

    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        pageSize: pageSize.toString(),
        page: page.toString(),
        myNotesOnly: myNotesOnly.toString(),
        roles: roles.join(','), // public enum JobTypeEnum { Other = 0, ClientServices = 1, Manager = 2, Negotiator = 3 }
        types: types.join(',') // Note = 0, Email = 1, Sms = 2, Property = 3, ContactGroup = 4
      }
    })
    const url = `${AppConstants.basePersonUrl}/${personId}/notes`
    return this.http.get<ContactNoteData>(url, { params: options }).pipe(
      map((response) => response.result),
      tap((data) => (this.personNotes = data))
    )
  }

  findRoleEnumValue(value: string): string {
    // public enum JobTypeEnum { Other = 0, ClientServices = 1, Manager = 2, Negotiator = 3 }
    let filterEnum = [
      { id: '0', value: 'Person' },
      { id: '1', value: 'Email' },
      { id: '2', value: 'SMS' },
      { id: '3', value: 'Property' },
      { id: '4', value: 'Contact Groups' },
      { id: '5', value: 'Negotiator' },
      { id: '6', value: 'Manager/Broker' },
      { id: '7', value: 'ClientServices' },
      { id: '8', value: 'Other' }
    ]
    switch (value) {
      case '8':
        return '0'
      case '7':
        return '1'
      case '6':
        return '2'
      case '5':
        return '3'
      default:
        return ''
    }
  }

  getContactGroupNotes(
    contactGroupId: number,
    pageSize?: number,
    page?: number,
    myNotesOnly = false
  ): Observable<ContactNote[]> {
    if (!page || +page === 0) {
      page = 1
    }
    if (pageSize == null) {
      pageSize = 10
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        pageSize: pageSize.toString(),
        page: page.toString(),
        myNotesOnly: myNotesOnly.toString()
      }
    })
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/notes`
    return this.http.get<ContactNoteData>(url, { params: options }).pipe(
      map((response) => response.result),
      tap((data) => (this.contactGroupNotes = data))
      // tap(data => console.log('group notes here...', JSON.stringify(data)))
    )
  }

  // TODO: This method is no longer in use. Please delete
  addPersonNote(personNote: ContactNote): Observable<ContactNote | any> {
    if (personNote) {
      if (personNote.isImportant == null) {
        personNote.isImportant = false
      }
      if (personNote.isPinned == null) {
        personNote.isPinned = false
      }
    }
    const url = `${AppConstants.basePersonUrl}/${personNote.personId}/notes`
    return this.http.post<ContactNoteData>(url, personNote).pipe(
      map((response) => response.result)
      // tap((data) => console.log('added  person note here...', JSON.stringify(data)))
    )
  }

  addContactGroupNote(contactGroupNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupNote.contactGroupId}/notes`
    return this.http.post<ContactNoteData>(url, contactGroupNote).pipe(
      map((response) => response.result)
      // tap((data) => console.log('added  contact-group note here...', JSON.stringify(data)))
    )
  }

  updatePersonNote(personNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.basePersonUrl}/${personNote.personId}/notes/${personNote.id}`
    return this.http.put<ContactNoteData>(url, personNote).pipe(
      map((response) => response.result)
      // tap((data) => console.log('updated note  person note here...', JSON.stringify(data)))
    )
  }

  updateContactGroupNote(contactGroupNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupNote.contactGroupId}/notes/${contactGroupNote.id}`
    return this.http.put<ContactNoteData>(url, contactGroupNote).pipe(
      map((response) => response.result)
      // tap((data) => console.log('updated contact-group note here...', JSON.stringify(data)))
    )
  }

  contactInfoChanged(info: BasicContactGroup[]) {
    this.contactInfoAction$.next(info)
  }

  personNotePageNumberChanged(result: number) {
    this.personNotePageChangeSubject.next(result)
  }
  contactNotePageNumberChanged(result: number) {
    this.contactNotePageChangeSubject.next(result)
  }
  pageNumberChanged(result: number) {
    this.pageChangeSubject.next(result)
  }

  signerChanged(signer: Signer) {
    this.signerSubject.next(signer)
  }
  contactGroupAutocompleteChanged(result: ContactGroupAutoCompleteResult[]) {
    this.contactGroupAutocompleteSubject.next(result)
  }

  personNotesChanged(notes: ContactNote[]) {
    this.personNotesSubject.next(notes)
  }

  notesChanged(note: ContactNote) {
    switch (true) {
      case !!note.personId:
        this.notesSubject.next(note)
        break
      case !!note.contactGroupId:
        this.notesSubject.next(note)
    }
  }

  getAddedPerson(person) {
    // console.log('******************** >> getAddedPerson: ', person)
    this.newPersonSubject.next(person)
  }

  removeAddedPerson() {
    this.newPersonSubject.next(null)
  }
}
