import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ContactGroupAutoCompleteResult, ContactGroupAutoCompleteData,
         PersonContactData, ContactGroupData, ContactGroup, BasicContactGroup,
          BasicContactGroupData, PeopleAutoCompleteResult, PeopleAutoCompleteData } from './contact-group';
import { map, tap, catchError } from 'rxjs/operators';
import { Person, BasicPerson } from 'src/app/core/models/person';
import { WedgeError } from 'src/app/core/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsService {

  constructor(private http: HttpClient) { }

  // get all the people that belong to a contact group
  getAutocompleteContactGroups(searchTerm: string): Observable<ContactGroupAutoCompleteResult[]> {
    // const options =  {params: new HttpParams().set('searchTerm', term)};
    // const url = `${AppConstants.baseContactGroupUrl}/search`;
    const url = `${AppConstants.baseContactGroupUrl}/search?SearchTerm=${searchTerm}`;
    return this.http.get<ContactGroupAutoCompleteData>(url)
    .pipe(
         map(response => response.result),
         tap(data => console.log(JSON.stringify(data)))
      );
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
  getAutocompletePeople(person: BasicPerson): Observable<PeopleAutoCompleteResult[]> {
    const options = new HttpParams()
                    .set('firstName', person.firstName  || '')
                    .set('lastName', person.lastName  || '')
                    .set('phoneNumber', person.phoneNumber  || '')
                    .set('emailAddress', person.emailAddress  || '') ;
    const url = `${AppConstants.basePersonUrl}/search`;
    return this.http.get<PeopleAutoCompleteData>(url, {params: options}).pipe(
      map(response => response.result),
      tap(data => console.log('found people...', data)),
      // catchError(this.handleError)
      );
  }
  addPerson(person: Person): Observable<Person | any> {
    const url = `${AppConstants.basePersonUrl}`;
    return this.http.post<PersonContactData>(url, person).pipe(
      map(response => response.result),
      tap(data => console.log('updated person details here...', JSON.stringify(data))),
      catchError(this.handleError)
      );
  }
  updatePerson(person: Person): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${person.personId}`;
    return this.http.put(url, person).pipe(
      map(response => response),
      tap(data => console.log('updated person details here...', JSON.stringify(data))),
      catchError(this.handleError)
      );
  }
  updateContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroup.contactGroupId}`;
    return this.http.put(url, contactGroup).pipe(
      map(response => response),
      tap(data => console.log('updated contact details here...', JSON.stringify(data))),
      catchError(err => this.handleError(err))
      );
  }

  private handleError(err: HttpErrorResponse): Observable<WedgeError> {
    const wedgeError = new WedgeError();
    if (err.error instanceof ErrorEvent) {
      wedgeError.displayMessage = `An error occurred: ${err.error.message}`;
    } else {
      wedgeError.errorCode = err.status;
      wedgeError.message = err.message;
      wedgeError.displayMessage = 'An error occurred retrieving data';
    }
    console.error(wedgeError);
    return throwError(wedgeError);
  }
}

