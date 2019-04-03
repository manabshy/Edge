import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsService {

  constructor(private http: HttpClient) { }

  // get all the people that belong to a contact group
  getAutocompleteContactGroups(searchTerm: string): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}/search?${searchTerm}`;
    return this.http.get<any>(url);
  }
}
