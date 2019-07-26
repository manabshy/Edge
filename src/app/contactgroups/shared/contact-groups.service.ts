import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ContactGroupAutoCompleteResult, ContactGroupAutoCompleteData,
         PersonContactData, ContactGroupData, ContactGroup, BasicContactGroup,
         BasicContactGroupData, PeopleAutoCompleteResult, PeopleAutoCompleteData,
         CompanyAutoCompleteResult, CompanyContactGroupAutoCompleteData as CompanyAutoCompleteData,
         Company, CompanyData, SignerAutoCompleteData, Signer, PersonSummaryFiguresData,
         PersonSummaryFigures, SignerData, PotentialDuplicateResult, PeopleAutoCompleteData2, PersonNoteData, PersonNote, ContactGroupsNoteData, ContactGroupsNote } from './contact-group';
import { map, tap } from 'rxjs/operators';
import { Person, BasicPerson } from 'src/app/core/models/person';

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsService {
personNotes: PersonNote[];
contactGroupNotes: ContactGroupsNote[];
private personNotesSubject = new Subject<PersonNote | null>();
private contactGroupNotesSubject = new Subject<ContactGroupsNote | null>();
personNotesChanges$ = this.personNotesSubject.asObservable();
contactGroupNotesChanges$ = this.contactGroupNotesSubject.asObservable();

  constructor(private http: HttpClient) { }

  // get all the people that belong to a contact group
  getAutocompleteContactGroups(searchTerm: any): Observable<ContactGroupAutoCompleteResult[] > {
    const options = new HttpParams().set('searchTerm', searchTerm);
    const url = `${AppConstants.baseContactGroupUrl}/search`;
    // const url = `${AppConstants.baseContactGroupUrl}/search?SearchTerm=${searchTerm}`;
    return this.http.get<ContactGroupAutoCompleteData>(url, {params: options})
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

  getContactGroupbyId(contactGroupId: number): Observable<ContactGroup> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}`;
    return this.http.get<ContactGroupData>(url).pipe(map(response => response.result));
  }

  getContactPerson(contactGroupId: number, personId: number): Observable<Person> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/person/${personId}`;
    return this.http.get<PersonContactData>(url).pipe(map(response => response.result));
  }

  getPerson( personId: number): Observable<Person> {
    const url = `${AppConstants.basePersonUrl}/${personId}`;
    return this.http.get<PersonContactData>(url).pipe(map(response => response.result));
  }

  getPersonContactGroups( personId: number): Observable<BasicContactGroup[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/contactGroups`;
    return this.http.get<BasicContactGroupData>(url).pipe(map(response => response.result));
  }

  getPersonInfo( personId: number): Observable<PersonSummaryFigures> {
    const url = `${AppConstants.basePersonUrl}/${personId}/info`;
    return this.http.get<PersonSummaryFiguresData>(url).pipe(map(response => response.result));
  }

  getPotentialDuplicatePeople(person: BasicPerson): Observable<PotentialDuplicateResult> {
    const options = new HttpParams()
                    .set('fullName', person.fullName  || '')
                    .set('phoneNumber', person.phoneNumber  || '')
                    .set('emailAddress', person.emailAddress  || '') ;
    const url = `${AppConstants.basePersonUrl}/duplicates`;
    return this.http.get<PeopleAutoCompleteData2>(url, {params: options}).pipe(
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
  //   if (company && company.companyName.length >= 3) {
  //      options = new HttpParams()
  //                     .set('searchTerm', company.companyName  || '') ;
  //  }
   options = new HttpParams()
                      .set('searchTerm', company.companyName  || '') ;
    const url = `${AppConstants.baseCompanyUrl}/search`;
    return this.http.get<CompanyAutoCompleteData>(url, {params: options}).pipe(
      map(response => response.result),
      tap(data => console.log('company list here here...', JSON.stringify(data)))
      );
  }

  getCompany( companyId: number): Observable<Company | any> {
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

  getPersonNotes(personId: number): Observable<PersonNote[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/personNotes`;
    return this.http.get<PersonNoteData>(url).pipe(
      map(response => response.result),
      tap(data => this.personNotes = data),
      tap(data => console.log('notes here...', JSON.stringify(data))));
  }

  getContactGroupNotes(contactGroupId: number): Observable<ContactGroupsNote[]> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/contactNotes`;
    return this.http.get<ContactGroupsNoteData>(url).pipe(
      map(response => response.result),
      tap(data => this.contactGroupNotes = data),
      tap(data => console.log('group notes here...', JSON.stringify(data))));
  }

  addPersonNote(personNote: PersonNote): Observable< PersonNote|any> {
    const url = `${AppConstants.basePersonUrl}/${personNote.personId}/personNotes`;
    return this.http.post<PersonNoteData>(url, personNote).pipe(
      map(response => response.result),
      tap(data => console.log('added  person note here...', JSON.stringify(data))));
  }

  addContactGroupNote(contactGroupNote: ContactGroupsNote): Observable<ContactGroupsNote | any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupNote.contactGroupId}/contactNotes`;
    return this.http.post<ContactGroupsNoteData>(url, contactGroupNote).pipe(
      map(response => response.result),
      tap(data => console.log('added  contactgroup note here...', JSON.stringify(data))));
  }

  personNotesChanged(personNote: PersonNote) {
    if (personNote.isPinned) {
      this.personNotes.unshift(personNote);
    } else {
      this.personNotes.push(personNote);
    }
    this.sortByPinnedAndDate(this.personNotes);
    this.personNotesSubject.next(personNote);
  }

  contactGroupNotesChanged(contactGroupNote: ContactGroupsNote) {
    if (contactGroupNote.isPinned) {
      this.contactGroupNotes.unshift(contactGroupNote);
    } else {
      this.contactGroupNotes.push(contactGroupNote);
    }
    this.sortByPinnedAndDate(this.contactGroupNotes);
    this.contactGroupNotesSubject.next(contactGroupNote);
  }

  sortByPinnedAndDate(notes) {
    if(notes){
      notes.sort((a,b)=> {
        if(a.isPinned === b.isPinned) {
          return a.createDate > b.createDate;
        }
        return a.isPinned !== b.isPinned;
      })
      notes.reverse();
    }
  }
}

