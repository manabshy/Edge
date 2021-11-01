// people.service.ts
/***
 * @module PeopleService
 * @description provides http endpoints that interact with people
 */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AppConstants } from '../shared/app-constants'
import { map, tap } from 'rxjs/operators'
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

  /***
   * @function getPeopleSuggestions
   * @param {string} searchTerm - term to get suggestions for
   * @description performs a search on people in the API that might potentially be who the user is looking for
   * @returns an array of people
   */
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

  /***
   * @function getProperties
   * @param {number} personId - person to fetch properties for
   * @description fetches all properties for a given person in the database
   * @returns an array of properties pertaining to that person
   */
  getProperties(personId: number): Observable<PersonProperty[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/properties`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @description getInstructions
   * @param {number} personId - person to get instructions for
   * @param {boolean} hidePrevious - TODO
   * @description gets instructions for a person
   * @returns an array of instructions
   */
  getInstructions(personId: number, hidePrevious: boolean): Observable<PersonInstruction[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/instructions?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @description getInstructions
   * @param {number} personId - person to get instructions for
   * @param {boolean} hidePrevious - TODO
   * @description gets instructions for a person
   * @returns an array of instructions
   */
  getValuations(personId: number, hidePrevious: boolean): Observable<Valuation[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/valuations?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @description getSearches
   * @param {number} personId - person to get searches for
   * @param {boolean} hidePrevious - TODO
   * @description gets searches for a person
   * @returns an array of searches
   */
  getSearches(personId: number, hidePrevious: boolean): Observable<PersonSearch[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/searches?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @description getOffers
   * @param {number} personId - person to get searches for
   * @param {boolean} hidePrevious - TODO
   * @description gets offers for a person
   * @returns an array of offers
   */
  getOffers(personId: number, hidePrevious: boolean): Observable<PersonOffer[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/offers?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @description getLettingsManagements
   * @param {number} personId - person to get searches for
   * @param {boolean} hidePrevious - TODO
   * @description gets lettingsManagements for a person
   * @returns an array of lettingsManagements
   */
  getLettingsManagements(personId: number, hidePrevious?: boolean): Observable<PersonLettingsManagement[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/lettingsManagements?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @description getHomeHelpers
   * @param {number} personId - person to get searches for
   * @param {boolean} hidePrevious - TODO
   * @description gets getHomeHelpers for a person
   * @returns an array of getHomeHelpers
   */
  getHomeHelpers(personId: number, hidePrevious?: boolean): Observable<PersonHomeHelper[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/homeHelpers?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @description getLeads
   * @param {number} personId - person to get searches for
   * @param {boolean} hidePrevious - TODO
   * @description gets getLeads for a person
   * @returns an array of getLeads
   */
  getLeads(personId: number, hidePrevious?: boolean): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${personId}/leads?activeOnly=${hidePrevious}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function performGdprRemoval
   * @param {object} person - person to perform GDPR removal on
   * @description performs a GDPR removal on a person
   * @returns TODO (nothing?)
   */
  performGdprRemoval(person: Person): Observable<Person | any> {
    const url = `${AppConstants.basePersonUrl}/${person.personId}/gdpr`
    return this.http.put<any>(url, person).pipe(map((response) => response.result))
  }

  /***
   * @function getAllPersonDocs
   * @param {number} personId - ID of the person to get docs for
   * @description gets ALL documents for a specific person
   * @returns TODO (nothing?)
   */
  public getAllPersonDocs(personId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${personId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function getPeopleDocsForValuation
   * @param {number} contactGroupId - ID of the contact group to get docs for
   * @param {number} valuationEventId - ID of the valuation
   * @description gets documents for a specific person attributed to a valution
   * @returns {Observable[]} array of frozen docs for the valuation
   */
  getPeopleDocsForValuation(contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function freezePeopleDocsForValuation
   * @param {any[]} people - Array of people to freeze docs for
   * @param {number} contactGroupId - ID of the contact group to freeze docs for
   * @param {number} valuationEventId - ID of the valuation
   * @description 🥶 freezes all documents for all people and associated companies in a specific contactGroup attributed to a valution
   * @returns {Observable[]}
   */
  freezePeopleDocsForValuation(people, contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.post<any>(url, people).pipe(map((response) => response.result))
  }

  /***
   * @function unfreezePeopleDocsForValuation
   * @param {number} contactGroupId - ID of the contact group to get docs for
   * @param {number} valuationEventId - ID of the valuation
   * @description 😎 unfreezes documents for all people and associated companies from a specific contact group attributed to a valution
   * @returns {Observable[]}
   */
  unfreezePeopleDocsForValuation(contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.basePersonDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.delete<any>(url).pipe(map((response) => response.result))
  }
}
