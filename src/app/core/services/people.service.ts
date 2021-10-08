import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../shared/app-constants';
import { map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { PersonInstruction, PersonSearch, PersonOffer, PersonLettingsManagement, PersonHomeHelper, PersonProperty, Person } from '../../shared/models/person';
import { Valuation } from 'src/app/valuations/shared/valuation';

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

  getInstructions(personId: number, hidePrevious: boolean): Observable<PersonInstruction[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/instructions?activeOnly=${hidePrevious}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }
  getValuations(personId: number, hidePrevious: boolean): Observable<Valuation[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/valuations?activeOnly=${hidePrevious}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getSearches(personId: number, hidePrevious: boolean): Observable<PersonSearch[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/searches?activeOnly=${hidePrevious}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getOffers(personId: number, hidePrevious: boolean): Observable<PersonOffer[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/offers?activeOnly=${hidePrevious}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getLettingsManagements(personId: number, hidePrevious?: boolean): Observable<PersonLettingsManagement[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/lettingsManagements?activeOnly=${hidePrevious}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getHomeHelpers(personId: number, hidePrevious?: boolean): Observable<PersonHomeHelper[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/homeHelpers?activeOnly=${hidePrevious}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getLeads(personId: number, hidePrevious?: boolean): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${personId}/leads?activeOnly=${hidePrevious}`;
    return this.http.get<any>(url).pipe(
      map(response => response.result),
      tap(data => {
        if (data) {
          console.log('person leads:', data);
        }
      }));
  }

  performGdprRemoval(person: Person): Observable<Person | any> {
    const url = `${AppConstants.basePersonUrl}/${person.personId}/gdpr`;
    return this.http.put<any>(url, person).pipe(map(response => response.result));
  }

  getCompanyPeopleDocs(contactGroupId: number): Observable<any> {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${contactGroupId}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.result),
    );
  }
  
  setCompanyPeopleDocs(people, contactGroupId: number): Observable<any> {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${contactGroupId}`;
    return this.http.post<any>(url, people).pipe(
      map((response) => response.result),
    );
  }

  getPeopleDocs(contactGroupId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${contactGroupId}`;
    return this.http.get<any>(url).pipe(
      map((response) => response.result),
    );
  }

  setPeopleDocs(people, contactGroupId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${contactGroupId}`
    return this.http.post<any>(url, people).pipe(
      map((response) => response.result)
    )
  }
}
