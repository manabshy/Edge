import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../shared/app-constants';
import { map, tap } from 'rxjs/operators';
import { PersonInstruction, PersonSearch, PersonOffer, PersonLettingsManagement, PersonHomeHelper, PersonProperty } from '../../shared/models/person';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }

  getPeopleSuggestions(searchTerm: string): Observable<any[]> {
    const url = `${AppConstants.basePersonUrl}/suggestions?SearchTerm=${searchTerm}`;
    return this.http.get<any>(url, {
      headers: { ignoreLoadingBar: '' }
    })
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }
  getProperties(personId: number): Observable<PersonProperty[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/properties`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getInstructions(personId: number): Observable<PersonInstruction[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/instructions`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getSearches(personId: number): Observable<PersonSearch[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/searches`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getOffers(personId: number): Observable<PersonOffer[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/offers`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getLettingsManagements(personId: number): Observable<PersonLettingsManagement[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/lettingsManagements`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getHomeHelpers(personId: number): Observable<PersonHomeHelper[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/homeHelpers`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getLeads(personId: number): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${personId}/leads`;
    return this.http.get<any>(url).pipe(
      map(response => response.result),
      tap(data => {
        if (data) {
          console.log('person leads:', data);
        }
      }));
  }

}
