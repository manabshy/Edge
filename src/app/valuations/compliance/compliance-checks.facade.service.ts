// compliance-checks.facade.service.ts
/**
 * @function ComplianceChecksFacadeService
 * @description service providing functions to facilitate compliance checks for personal and company owned valuations
 */
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'
import { filter, tap, take } from 'rxjs/operators'
import { PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'
import { ValuationFacadeService } from '../shared/valuation-facade.service'

@Injectable({
  providedIn: 'root'
})
export class ComplianceChecksFacadeService {
  private _contactSearchResults: BehaviorSubject<PotentialDuplicateResult> = new BehaviorSubject(null)

  constructor(private _valuationFacadeSvc: ValuationFacadeService) {}

  public valuation$: Observable<any> = this._valuationFacadeSvc.valuationData$

  // WIP
  // figure out if there's a power of attorney as the admin contact for the valuation.
  // if so, then fetch their docs etc from documents endpoint
  // return stream of data for that person
  public loadAdditionalContactsCheck(valuationData, entityToAdd) {
    console.log('loadAdditionalContactsCheck: ', valuationData, entityToAdd)
    if (!!valuationData.adminContact && valuationData.isPowerOfAttorney) {
      console.log('fetch documents for ', valuationData.adminContact.contactGroupId)
      return this._valuationFacadeSvc
        .getPeopleDocsForValuation(valuationData.adminContact.contactGroupId, valuationData.valuationEventId)
        .toPromise()
          .then((data) => {
            console.log('add this person in ', data)
            return { valuationData, entityToAdd, adminContact: data[0] }
          })
          
    } else {
      return of({ valuationData, entityToAdd, adminContact: null })
    }
  }

  // CONTACT SEARCHES / ADDING
  public contactSearchResults$: Observable<PotentialDuplicateResult> = this._contactSearchResults.asObservable()
  public contactGroup$: Observable<any> = this._valuationFacadeSvc.contactGroup$.pipe()
  public getContactGroupById = (contactGroupId) => {
    return this._valuationFacadeSvc.getContactGroupById(contactGroupId)
  }
  public newCompanyAdded$: Observable<any> = this._valuationFacadeSvc.newCompanyChanges$.pipe(
    filter((company) => !!company),
    take(1)
  )
  public newPersonAdded$: Observable<any> = this._valuationFacadeSvc.newPerson$.pipe(
    filter((contact) => !!contact),
    take(1)
  )
  public onQueryDuplicates(person) {
    this._valuationFacadeSvc.getPotentialDuplicatePeople(person).subscribe((data) => {
      this._contactSearchResults.next(data)
    })
  }
  public onCreateNewPerson(newPerson) {
    this._valuationFacadeSvc.navigateToNewPersonScreen(newPerson)
  }

  // Company compliance checks documents management functions 📚
  public getAllDocsForCompany(companyId: number) {
    return this._valuationFacadeSvc.getAllDocsForCompany(companyId)
  }
  public getCompanyDocsForValuation(contactGroupId, valuationEventId) {
    return this._valuationFacadeSvc.getCompanyDocsForValuation(contactGroupId, valuationEventId)
  }
  public updateCompanyAndPersonDocuments(savePayload) {
    return this._valuationFacadeSvc.updateCompanyAndPersonDocuments(savePayload)
  }

  // Personal compliance checks documents management functions 📚
  public getAllPersonDocs(personId) {
    return this._valuationFacadeSvc.getAllPersonDocs(personId)
  }
  public getPeopleDocsForValuation(contactGroupId, valuationEventId) {
    return this._valuationFacadeSvc.getPeopleDocsForValuation(contactGroupId, valuationEventId)
  }
  public updatePersonDocuments(personDocuments) {
    return this._valuationFacadeSvc.updatePersonDocuments(personDocuments)
  }

  // Passing compliance tests ✔️
  public passComplianceChecksForValution(entitiesToPass) {
    return this._valuationFacadeSvc.passComplianceChecksForValution(entitiesToPass)
  }

  // Refreshing / Unfreezing a valuation
  public unfreezeCompanyDocsForValuation(contactGroupId: number, valuationEventId: number) {
    return this._valuationFacadeSvc.unfreezeCompanyDocsForValuation(contactGroupId, valuationEventId)
  }
  public unfreezePeopleDocsForValuation(contactGroupId: number, valuationEventId: number) {
    return this._valuationFacadeSvc.unfreezePeopleDocsForValuation(contactGroupId, valuationEventId)
  }

  // Generic save temp file 💾
  public saveFileTemp(tmpFiles) {
    return this._valuationFacadeSvc.saveFileTemp(tmpFiles)
  }
}
