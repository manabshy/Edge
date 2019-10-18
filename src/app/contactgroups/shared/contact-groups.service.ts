import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import {
  ContactGroupAutoCompleteResult, ContactGroupAutoCompleteData,
  PersonContactData, ContactGroupData, ContactGroup, BasicContactGroup,
  BasicContactGroupData, CompanyAutoCompleteResult, CompanyContactGroupAutoCompleteData as CompanyAutoCompleteData,
  Company, CompanyData, SignerAutoCompleteData, Signer, PersonSummaryFiguresData,
  PersonSummaryFigures, SignerData, PotentialDuplicateResult, PeopleAutoCompleteData2,
  ContactNote, ContactNoteData} from './contact-group';
import { map, tap } from 'rxjs/operators';
import { Person, BasicPerson } from 'src/app/core/models/person';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsService {
  personNotes: ContactNote[];
  contactGroupNotes: ContactNote[];
  private contactInfoAction$ = new Subject<BasicContactGroup[] | null>();
  private personNotesSubject = new Subject<ContactNote[] | null>();
  private contactGroupNotesSubject = new Subject<ContactNote | null>();
  private notesSubject = new Subject<ContactNote | null>();
  private contactGroupAutocompleteSubject = new Subject<ContactGroupAutoCompleteResult[] | null>();
  private pageChangeSubject = new Subject<number | null>();
  private personNotePageChangeSubject = new Subject<number | null>();
  private contactNotePageChangeSubject = new Subject<number | null>();
  noteChanges$ = this.notesSubject.asObservable();
  contactInfoForNotes$ = this.contactInfoAction$.asObservable();
  personNotesChanges$ = this.personNotesSubject.asObservable();
  contactGroupNotesChanges$ = this.contactGroupNotesSubject.asObservable();
  contactGroupAutocomplete$ = this.contactGroupAutocompleteSubject.asObservable();
  pageChanges$ = this.pageChangeSubject.asObservable();
  personNotePageChanges$ = this.personNotePageChangeSubject.asObservable();
  contactNotePageChanges$ = this.contactNotePageChangeSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAutocompleteContactGroups(searchTerm: any, pageSize?: number, page?: number): Observable<ContactGroupAutoCompleteResult[]> {
    if (!page || +page === 0) {
      page = 1;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        searchTerm: searchTerm,
        pageSize: pageSize.toString(),
        page: page.toString()
      }
    });
    const url = `${AppConstants.baseContactGroupUrl}/search`;
    return this.http.get<ContactGroupAutoCompleteData>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  getPeopleSuggestions(searchTerm: string): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}/suggestions?SearchTerm=${searchTerm}`;
    return this.http.get<any>(url)
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }
  getAutocompleteSigners(searchTerm: string): Observable<Signer[]> {
    const url = `${AppConstants.baseContactGroupUrl}/autocomplete?SearchTerm=${searchTerm}`;
    return this.http.get<SignerAutoCompleteData>(url)
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }

  getSignerbyId(contactGroupId: number): Observable<Signer> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/contactNames`;
    return this.http.get<SignerData>(url).pipe(map(response => response.result));
  }

  getContactGroupbyId(contactGroupId: number, includeOnlyImportantNotes?: boolean): Observable<ContactGroup> {
    if (!includeOnlyImportantNotes) { includeOnlyImportantNotes = false; }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        includeOnlyImportantNotes: includeOnlyImportantNotes.toString()
      }
    });
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}`;
    return this.http.get<ContactGroupData>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => this.contactGroupNotes = data.contactNotes),
        tap(data => console.log('contact group details here...', JSON.stringify(data)))
      );
  }

  getContactPerson(contactGroupId: number, personId: number): Observable<Person> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/person/${personId}`;
    return this.http.get<PersonContactData>(url).pipe(map(response => response.result));
  }

  getPerson(personId: number, includeOnlyImportantNotes?: boolean): Observable<Person> {
    if (!includeOnlyImportantNotes) {
      includeOnlyImportantNotes = false;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        includeOnlyImportantNotes: includeOnlyImportantNotes.toString()
      }
    });
    const url = `${AppConstants.basePersonUrl}/${personId}`;
    return this.http.get<PersonContactData>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => this.personNotes = data.personNotes),
        tap(data => console.log('person details here...', JSON.stringify(data)))
      );
  }

  getPersonContactGroups(personId: number): Observable<BasicContactGroup[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/contactGroups`;
    return this.http.get<BasicContactGroupData>(url).pipe(map(response => response.result));
  }

  getPersonInfo(personId: number): Observable<PersonSummaryFigures> {
    const url = `${AppConstants.basePersonUrl}/${personId}/info`;
    return this.http.get<PersonSummaryFiguresData>(url).pipe(map(response => response.result));
  }

  getPotentialDuplicatePeople(person: BasicPerson): Observable<PotentialDuplicateResult> {
    const options = new HttpParams()
      .set('fullName', person.fullName || '')
      .set('phoneNumber', person.phoneNumber || '')
      .set('emailAddress', person.emailAddress || '');
    const url = `${AppConstants.basePersonUrl}/duplicates`;
    return this.http.get<PeopleAutoCompleteData2>(url, { params: options }).pipe(
      map(response => response.result),
      tap(data => console.log('results for duplicates', data))
    );
  }

  addPerson(person: Person): Observable<Person | any> {
    const url = `${AppConstants.basePersonUrl}`;
    return this.http.post<PersonContactData>(url, person).pipe(
      map(response => response.result),
      tap(data => console.log('updated person details here...', JSON.stringify(data))));
  }

  updatePerson(person: Person): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${person.personId}`;
    return this.http.put(url, person).pipe(
      map(response => response),
      tap(data => console.log('updated person details here...', JSON.stringify(data))));
  }

  addContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}`;
    return this.http.post(url, contactGroup).pipe(
      map(response => response),
      tap(data => console.log('updated contact details here...', JSON.stringify(data))));
  }

  updateContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroup.contactGroupId}`;
    return this.http.put(url, contactGroup).pipe(
      map(response => response),
      tap(data => console.log('updated contact details here...', JSON.stringify(data))));
  }

  getAutocompleteCompany(company: any): Observable<CompanyAutoCompleteResult[]> {
    let options;
    options = new HttpParams()
      .set('searchTerm', company.companyName || '');
    const url = `${AppConstants.baseCompanyUrl}/search`;
    return this.http.get<CompanyAutoCompleteData>(url, { params: options }).pipe(
      map(response => response.result),
      tap(data => console.log('company list here here...', JSON.stringify(data)))
    );
  }

  getCompany(companyId: number): Observable<Company | any> {
    const url = `${AppConstants.baseCompanyUrl}/${companyId}`;
    return this.http.get<CompanyData>(url).pipe(
      map(response => response.result),
      tap(data => console.log('company details here...', JSON.stringify(data))));
  }

  addCompanyContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseCompanyUrl}`;
    return this.http.post(url, contactGroup).pipe(
      map(response => response),
      tap(data => console.log('updated company contact details here...', JSON.stringify(data))));
  }

  getPersonNotes(personId: number, pageSize?: number, page?: number): Observable<ContactNote[]> {
    if (!page || +page === 0) { page = 1; }
    if (pageSize == null) { pageSize = 10; }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        pageSize: pageSize.toString(),
        page: page.toString()
      }
    });
    const url = `${AppConstants.basePersonUrl}/${personId}/notes`;
    return this.http.get<ContactNoteData>(url, { params: options }).pipe(
      map(response => response.result),
      tap(data => this.personNotes = data)
      // tap(data => console.log('person notes here...', this.personNotes )),
      // tap(data => console.log('notes here...', JSON.stringify(data)))
    );
  }

  getContactGroupNotes(contactGroupId: number, pageSize?: number, page?: number): Observable<ContactNote[]> {
    if (!page || +page === 0) { page = 1; }
    if (pageSize == null) { pageSize = 10; }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        pageSize: pageSize.toString(),
        page: page.toString()
      }
    });
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/notes`;
    return this.http.get<ContactNoteData>(url, { params: options }).pipe(
      map(response => response.result),
      tap(data => this.contactGroupNotes = data)
      // tap(data => console.log('group notes here...', JSON.stringify(data)))
    );
  }

  addPersonNote(personNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.basePersonUrl}/${personNote.personId}/notes`;
    return this.http.post<ContactNoteData>(url, personNote).pipe(
      map(response => response.result),
      tap(data => console.log('added  person note here...', JSON.stringify(data))));
  }

  addContactGroupNote(contactGroupNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupNote.contactGroupId}/notes`;
    return this.http.post<ContactNoteData>(url, contactGroupNote).pipe(
      map(response => response.result),
      tap(data => console.log('added  contactgroup note here...', JSON.stringify(data))));
  }

  updatePersonNote(personNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.basePersonUrl}/${personNote.personId}/notes/${personNote.id}`;
    return this.http.put<ContactNoteData>(url, personNote).pipe(
      map(response => response.result),
      tap(data => console.log('updated note  person note here...', JSON.stringify(data))));
  }

  updateContactGroupNote(contactGroupNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupNote.contactGroupId}/notes/${contactGroupNote.id}`;
    return this.http.put<ContactNoteData>(url, contactGroupNote)
      .pipe(
        map(response => response.result),
        tap(data => console.log('updated contactgroup note here...', JSON.stringify(data))));
  }

  contactInfoChanged(info: BasicContactGroup[]) {
    this.contactInfoAction$.next(info);
  }

  personNotePageNumberChanged(result: number) {
    this.personNotePageChangeSubject.next(result);
  }
  contactNotePageNumberChanged(result: number) {
    this.contactNotePageChangeSubject.next(result);
  }
  pageNumberChanged(result: number) {
    this.pageChangeSubject.next(result);
  }

  contactGroupAutocompleteChanged(result: ContactGroupAutoCompleteResult[]) {
    this.contactGroupAutocompleteSubject.next(result);
  }

  personNotesChanged(notes: ContactNote[]) {
    this.personNotesSubject.next(notes);
  }

  notesChanged(note: ContactNote) {
    switch (true) {
      case !!note.personId:
        this.notesSubject.next(note);
        break;
      case !!note.contactGroupId:
        this.notesSubject.next(note);
    }
  }

}

