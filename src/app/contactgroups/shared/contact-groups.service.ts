import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ContactGroupAutoCompleteResult, ContactGroupAutoCompleteData } from './contact-group';
import { map, tap } from 'rxjs/operators';

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
  getContactGroupbyId(contactGroupId: number): Observable<ContactGroupAutoCompleteResult[]> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}`;
    return this.http.get<ContactGroupAutoCompleteData>(url).pipe(map(response => response.result));
  }
}
