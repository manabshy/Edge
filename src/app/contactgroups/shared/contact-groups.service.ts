import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ContactGroupAutoCompleteResult, ContactGroupAutoCompleteData,
         PersonContactData, ContactGroupData, ContactGroup, BasicContactGroup,
         BasicContactGroupData, CompanyAutoCompleteResult, CompanyContactGroupAutoCompleteData as CompanyAutoCompleteData,
         Company, CompanyData, SignerAutoCompleteData, Signer, PersonSummaryFiguresData,
         PersonSummaryFigures, SignerData, PotentialDuplicateResult, PeopleAutoCompleteData2,  ContactNote, ContactNoteData } from './contact-group';
import { map, tap } from 'rxjs/operators';
import { Person, BasicPerson } from 'src/app/core/models/person';

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsService {
personNotes: ContactNote[];
contactGroupNotes: ContactNote[];
private contactInfoAction$ = new Subject<BasicContactGroup[] | null >();
private personNotesSubject = new Subject<ContactNote | null>();
private contactGroupNotesSubject = new Subject<ContactNote | null>();
private notesSubject = new Subject<ContactNote | null>();
noteChanges$ = this.notesSubject.asObservable();
contactInfoForNotes$ = this.contactInfoAction$.asObservable();
personNotesChanges$ = this.personNotesSubject.asObservable();
contactGroupNotesChanges$ = this.contactGroupNotesSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAutocompleteContactGroups(searchTerm: any): Observable<ContactGroupAutoCompleteResult[]> {
    let url = `${AppConstants.baseContactGroupUrl}/search?SearchTerm=${searchTerm}`;
    url = url.replace(/\+/gi, '%2B');
    return this.http.get<ContactGroupAutoCompleteData>(url)
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
    return this.http.get<ContactGroupData>(url)
      .pipe(
        map(response => response.result),
        tap(data => this.contactGroupNotes = data.contactNotes),
        tap(data => console.log('contact notes here...', this.contactGroupNotes )),
        tap(data => console.log('contact group details here...', JSON.stringify(data)))
      );
  }

  getContactPerson(contactGroupId: number, personId: number): Observable<Person> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/person/${personId}`;
    return this.http.get<PersonContactData>(url).pipe(map(response => response.result));
  }

  getPerson(personId: number): Observable<Person> {
    const url = `${AppConstants.basePersonUrl}/${personId}`;
    return this.http.get<PersonContactData>(url)
      .pipe(
        map(response => response.result),
        tap(data => this.personNotes = data.personNotes),
        tap(data => console.log('person notes here...', this.personNotes )),
        tap(data => console.log('person details here...', JSON.stringify(data)))
      );
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

  getPersonNotes(personId: number): Observable<ContactNote[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/personNotes`;
    return this.http.get<ContactNoteData>(url).pipe(
      map(response => response.result),
      tap(data => this.personNotes = data),
      tap(data => console.log('person notes here...', this.personNotes )),
      tap(data => console.log('notes here...', JSON.stringify(data))));
  }

  getContactGroupNotes(contactGroupId: number): Observable<ContactNote[]> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/contactNotes`;
    return this.http.get<ContactNoteData>(url).pipe(
      map(response => response.result),
      tap(data => this.contactGroupNotes = data),
      tap(data => console.log('group notes here...', JSON.stringify(data))));
  }

  addPersonNote(personNote: ContactNote): Observable< ContactNote|any> {
    const url = `${AppConstants.basePersonUrl}/${personNote.personId}/personNotes`;
    return this.http.post<ContactNoteData>(url, personNote).pipe(
      map(response => response.result),
      tap(data => console.log('added  person note here...', JSON.stringify(data))));
  }

  addContactGroupNote(contactGroupNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupNote.contactGroupId}/contactNotes`;
    return this.http.post<ContactNoteData>(url, contactGroupNote).pipe(
      map(response => response.result),
      tap(data => console.log('added  contactgroup note here...', JSON.stringify(data))));
  }

  updatePersonNote(personNote: ContactNote): Observable< ContactNote|any> {
    const url = `${AppConstants.basePersonUrl}/${personNote.personId}/personNotes/${personNote.id}`;
    return this.http.put<ContactNoteData>(url, personNote).pipe(
      map(response => response.result),
      tap(data => console.log('updated note  person note here...', JSON.stringify(data))));
  }

  updateContactGroupNote(contactGroupNote: ContactNote): Observable<ContactNote | any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupNote.contactGroupId}/contactNotes/${contactGroupNote.id}`;
    return this.http.put<ContactNoteData>(url, contactGroupNote)
    .pipe(
      map(response => response.result),
      tap(data => console.log('updated contactgroup note here...', JSON.stringify(data))));
  }

  contactInfoChanged(info: BasicContactGroup[]){
    this.contactInfoAction$.next(info);
  }

  // personNotesChanged(note: ContactNote) {
  //   let index;
  //   this.personNotes ? index = this.personNotes.findIndex(x => x.id === note.id) : index = -1;
  //   if (index !== -1) {
  //     this.personNotes[index] = note;
  //   } else {
  //    note.personId ? this.personNotes.push(note) : this.contactGroupNotes.push(note);
  //   }
  //   this.sortByPinnedAndDate(this.personNotes);
  //   this.personNotesSubject.next(note);
  // }
  notesChanged(note: ContactNote) {
    switch(true){
      case !!note.personId:
        console.log('personal notes in switch', this.personNotes);
        this.notesSubject.next(note);
        break;
      case !!note.contactGroupId:
        console.log('contact notes in switch', this.contactGroupNotes);
          this.notesSubject.next(note);
    }
  }

  contactGroupNotesChanged(note: ContactNote) {
    let index;
    this.contactGroupNotes ? index = this.contactGroupNotes.findIndex(x => x.id === note.id) : index = -1;
    if (index !== -1) {
      this.contactGroupNotes[index] = note;
    } else {
      note.contactGroupId ? this.contactGroupNotes.push(note) : this.personNotes.push(note);
    }
    this.sortByPinnedAndDate(this.contactGroupNotes);
    this.contactGroupNotesSubject.next(note);
  }

  sortByPinnedAndDate(notes) {
    if (notes) {
      console.log('note for pinning', notes);
      notes.sort((a, b) => {
        const dateA = new Date(a.createDate);
        const dateB = new Date(b.createDate);
        if (a.isPinned !== b.isPinned) {
          return b.isPinned - a.isPinned;
        } else {
          if (dateA < dateB) { return 1; }
          if (dateA > dateB) { return -1; }
        }
        return 0;
      });
    }
  }
}

