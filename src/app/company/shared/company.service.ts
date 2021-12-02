import { Injectable } from '@angular/core'
import { Company } from 'src/app/contact-groups/shared/contact-group'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { AppConstants } from 'src/app/core/shared/app-constants'
import { map, tap } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companyPageChangeSubject = new Subject<number | null>()
  private newCompanySubject = new BehaviorSubject<Company | null>(null)
  companyPageChanges$ = this.companyPageChangeSubject.asObservable()
  newCompanyChanges$ = this.newCompanySubject.asObservable()

  newCompanyContactGroupIsSavedBs = new BehaviorSubject(false)

  constructor(private http: HttpClient) {}

  /***
   * @function companyPageChanged
   * @param {number} newPage - next page to request from API
   * @description TODO
   */
  public companyPageChanged(newPage: number) {
    this.companyPageChangeSubject.next(newPage)
  }

  /***
   * @function companyChanged
   * @param {object} company - TODO
   * @description TODO
   */
  public companyChanged(company) {
    this.newCompanySubject.next(company)
  }

  /***
   * @function addCompany
   * @param {object} company - company to add via API
   * @description adds a new company via the API
   */
  public addCompany(company: Company): Observable<any> {
    const url = `${AppConstants.baseCompanyUrl}`
    return this.http.post(url, company).pipe(
      map((response) => response),
      tap((data) => console.log('added company details here...', JSON.stringify(data)))
    )
  }

  /***
   * @function updateCompany
   * @param {object} company - company to update
   * @description updates a company via the API
   */
  public updateCompany(company: Company): Observable<any> {
    const url = `${AppConstants.baseCompanyUrl}/${company.companyId}`
    return this.http.put(url, company).pipe(
      map((response) => response),
      tap((data) => console.log('updated company details here...', JSON.stringify(data)))
    )
  }

  /***
   * @function getAllDocsForCompany
   * @param {number} companyId - ID of the company to fetch docs for
   * @description fetches all documents for a companyId
   */
  getAllDocsForCompany(companyId: number) {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${companyId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function getCompanyDocsForValuation
   * @param {number} contactGroupId - ID of the contact group to fetch docs for
   * @param {number} valuationEventId - ID of the valuation
   * @description fetches all documents for a company linked to a specific valuation
   * @returns {Observable} array of compliance documents
   */
  getCompanyDocsForValuation(contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.get<any>(url).pipe(map((response) => response.result))
  }

  /***
   * @function freezeCompanyDocsForValuation
   * @param {number} contactGroupId - ID of the contact group to set docs for
   * @param {number} valuationEventId - ID of the valuation documents are attached to
   * @description freezes documents for a company linked to a specific valuation
   */
  freezeCompanyDocsForValuation(people, contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.post<any>(url, people).pipe(map((response) => response.result))
  }

  /***
   * @function deleteCompanyDocsForValuation
   * @param {number} contactGroupId - ID of the contact group to set docs for
   * @param {number} valuationEventId - ID of the valuation docs are attached to
   * @description deletes documents linked to a company for a specific valuation
   */
  deleteCompanyDocsForValuation(contactGroupId: number, valuationEventId: number): Observable<any> {
    const url = `${AppConstants.baseCompanyDocumentUrl}/${contactGroupId}/${valuationEventId}`
    return this.http.delete<any>(url).pipe(map((response) => response.result))
  }
}
