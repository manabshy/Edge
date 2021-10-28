import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AppConstants } from '../shared/app-constants'
import { map, mergeMap, switchMap, tap } from 'rxjs/operators'
import {
  PersonInstruction,
  PersonSearch,
  PersonOffer,
  PersonLettingsManagement,
  PersonHomeHelper,
  PersonProperty,
  Person
} from '../../shared/models/person'
import { Valuation } from 'src/app/valuations/shared/valuation'

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  constructor(private http: HttpClient) {}

  getPeopleSuggestions(searchTerm: string): Observable<any[]> {
    const url = `${AppConstants.basePersonUrl}/suggestions?SearchTerm=${searchTerm}`
    return this.http
      .get<any>(url, {
        headers: { ignoreLoadingBar: '' }
      })
      .pipe(
        map((response) => response.result),
        tap((data) => console.log(JSON.stringify(data)))
      )
  }
  getProperties(personId: number): Observable<PersonProperty[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/properties`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  getInstructions(personId: number, hidePrevious: boolean): Observable<PersonInstruction[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/instructions?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }
  getValuations(personId: number, hidePrevious: boolean): Observable<Valuation[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/valuations?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  getSearches(personId: number, hidePrevious: boolean): Observable<PersonSearch[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/searches?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  getOffers(personId: number, hidePrevious: boolean): Observable<PersonOffer[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/offers?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  getLettingsManagements(personId: number, hidePrevious?: boolean): Observable<PersonLettingsManagement[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/lettingsManagements?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  getHomeHelpers(personId: number, hidePrevious?: boolean): Observable<PersonHomeHelper[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/homeHelpers?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  getLeads(personId: number, hidePrevious?: boolean): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${personId}/leads?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data) {
          console.log('person leads:', data)
        }
      })
    )
  }

  performGdprRemoval(person: Person): Observable<Person | any> {
    const url = `${AppConstants.basePersonUrl}/${person.personId}/gdpr`
    return this.http.put<any>(url, person).pipe(map((response) => response.result))
  }

  /***
   * @function getCompanyDocs
   * @param {number} companyId - ID of the company to fetch docs for
   * @description fetches all documents for a company
   */
  getCompanyDocs(companyId: number) {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${companyId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function getCompanyPeopleDocs
   * @param {number} contactGroupId - ID of the contact group to fetch docs for
   * @param {number} valuationEventId - ID of the valuation
   * @description fetches all documents for a company linked to a specific valuation
   * @returns {Observable} array of compliance documents
   */
  getCompanyPeopleDocs(contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function setCompanyPeopleDocs
   * @param {number} contactGroupId - ID of the contact group to set docs for
   * @param {number} valuationEventId - ID of the valuation
   * @description sets documents for a company linked to a specific valuation
   */
  setCompanyPeopleDocs(people, contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.post<any>(url, people).pipe(map((response) => response.result))
  }

  /***
   * @function deleteCompanyDocs
   * @param {number} contactGroupId - ID of the contact group to set docs for
   * @param {number} valuationEventId - ID of the valuation
   * @description deletes documents linked to a company for a specific valuation
   */
  deleteCompanyDocs(contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.delete<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function getAllPersonDocs
   * @param {number} personId - ID of the person to get docs for
   * @description gets ALL documents for a specific person
   */
  getAllPersonDocs(personId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${personId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function getPeopleDocsForValuation
   * @param {number} contactGroupId - ID of the contact group to get docs for
   * @param {number} valuationEventId - ID of the valuation
   * @description gets documents for a specific person attributed to a valution
   * @returns {Observable[]}
   */
  getPeopleDocsForValuation(contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  setPeopleDocsForValuation(people, contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.post<any>(url, people).pipe(map((response) => response.result))
  }

  deletePeopleDocsForValuation(contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.delete<any>(url).pipe(map((response) => response.result))
  }
}
