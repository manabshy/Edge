import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../shared/app-constants';
import { map, tap } from 'rxjs/operators';
import { PersonInstruction, PersonSearch, PersonOffer, PersonLettingsManagement, PersonHomeManagement } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }

  getInstructions(personId: number): Observable<PersonInstruction> {
    const url = `${AppConstants.basePersonUrl}/${personId}/instructions`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getSearches(personId: number): Observable<PersonSearch[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/searches`;
    return this.http.get<any>(url).pipe(map(response => response.result), tap(data=>console.log('searches', data)));
  }

  getOffers(personId: number): Observable<PersonOffer> {
    const url = `${AppConstants.basePersonUrl}/${personId}/offers`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getLettingsManagements(personId: number): Observable<PersonLettingsManagement> {
    const url = `${AppConstants.basePersonUrl}/${personId}/lettingsManagements`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getHomeManagements(personId: number): Observable<PersonHomeManagement> {
    const url = `${AppConstants.basePersonUrl}/${personId}/homeManagements`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }
}
