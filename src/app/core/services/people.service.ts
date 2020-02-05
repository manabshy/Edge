import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../shared/app-constants';
import { map, tap } from 'rxjs/operators';
import { PersonInstruction, PersonSearch, PersonOffer, PersonLettingsManagement, PersonHomeHelper, PersonProperty } from '../../shared/models/person';
import { Valuation } from 'src/app/shared/models/valuation';

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

  getInstructions(personId: number, isClosedIncluded: boolean): Observable<PersonInstruction[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/instructions?activeOnly=${!isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getSearches(personId: number, isClosedIncluded: boolean): Observable<PersonSearch[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/searches?activeOnly=${!isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getOffers(personId: number, isClosedIncluded: boolean): Observable<PersonOffer[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/offers?activeOnly=${!isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getValuations(personId: number, isClosedIncluded?: boolean): Observable<Valuation[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/valuations?activeOnly=${!isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }
  getLettingsManagements(personId: number, isClosedIncluded: boolean): Observable<PersonLettingsManagement[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/lettingsManagements?activeOnly=${!isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getHomeHelpers(personId: number, isClosedIncluded: boolean): Observable<PersonHomeHelper[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/homeHelpers?activeOnly=${!isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getLeads(personId: number, isClosedIncluded: boolean): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${personId}/leads?activeOnly=${!isClosedIncluded}`;
    return this.http.get<any>(url).pipe(
      map(response => response.result),
      tap(data => {
        if (data) {
          console.log('person leads:', data);
        }
      }));
  }

}
