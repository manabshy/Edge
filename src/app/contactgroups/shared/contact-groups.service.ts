import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ContactGroupAutoCompleteResult, ContactGroupAutoCompleteData,
         PersonContactData, ContactGroupData, ContactGroup, BasicContactGroup, BasicContactGroupData } from './contact-group';
import { map, tap } from 'rxjs/operators';
import { Person } from 'src/app/core/models/person';

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsService {
  constructor(private http: HttpClient) { }

  // get all the people that belong to a contact group
  getAutocompleteContactGroups(searchTerm: string): Observable<ContactGroupAutoCompleteResult[]> {
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
  updatePerson(person: Person): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${person.personId}`;
    return this.http.put(url, person).pipe(
      map(response => response),
      tap(data => console.log(JSON.stringify(data)))
      );
  }
}
