// compliance-checks.facade.service.ts
/**
 * @function ComplianceChecksFacadeService
 * @description service providing functions to facilitate compliance checks for personal and company owned valuations
 */
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter, tap, take } from 'rxjs/operators'
import { PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'
import { ValuationFacadeService } from '../shared/valuation-facade.service'

@Injectable({
  providedIn: 'root'
})
export class ComplianceChecksFacadeService {
  private _contactSearchResults: BehaviorSubject<PotentialDuplicateResult> = new BehaviorSubject(null)

  constructor(private _valuationFacadeSvc: ValuationFacadeService) {  }

  public valuation$: Observable<any> = this._valuationFacadeSvc.valuationData$.pipe()
  public contactGroup$: Observable<any> = this._valuationFacadeSvc.contactGroup$.pipe()
  public isPowerOfAttorneyChanged$: Observable<any> = this._valuationFacadeSvc.isPowerOfAttorneyChanged$
  public lastKnownOwnerChanged$: Observable<any> = this._valuationFacadeSvc.lastKnownOwnerChanged$

  // CONTACT SEARCHES / ADDING
  public contactSearchResults$: Observable<PotentialDuplicateResult> = this._contactSearchResults.asObservable()

  public getContactGroupById = (contactGroupId) => {
    return this._valuationFacadeSvc.getContactGroupById(contactGroupId)
  }
  public newCompanyAdded$: Observable<any> = this._valuationFacadeSvc.newCompanyChanges$.pipe(
    filter((company) => !!company && company.addNewEntityToComplianceChecks),
    take(1),
    tap((data) => console.log('adding new company to compliance checks: ', data))
  )
  public newPersonAdded$: Observable<any> = this._valuationFacadeSvc.newPersonAdded$.pipe(
    filter((person) => !!person && person.addNewEntityToComplianceChecks),
    take(1),
    tap((data) => console.log('adding new person to compliance checks: ', data))
  )
  public onQueryDuplicates(person) {
    this._valuationFacadeSvc.getPotentialDuplicatePeople(person).subscribe((data) => {
      this._contactSearchResults.next(data)
    })
  }
  public onCreateNewPerson(newPerson) {
    this._valuationFacadeSvc.navigateToNewPersonScreen(newPerson)
  }
  public onCreateNewCompany(newCompany) {
    this._valuationFacadeSvc.navigateToNewCompanyScreen(newCompany)
  }

  // Company compliance checks documents management functions 📚
  public getAllDocsForCompany(companyId: number) {
    return this._valuationFacadeSvc.getAllDocsForCompany(companyId)
  }
  public getCompanyDocsForValuation(contactGroupId, valuationEventId) {
    return this._valuationFacadeSvc.getCompanyDocsForValuation(contactGroupId, valuationEventId)
  }
  public updateCompanyAndPersonDocuments(savePayload) {
    return this._valuationFacadeSvc.updateLocalValuation({
      companyDocuments: savePayload.companyDocuments,
      personDocuments: savePayload.personDocuments
    })
  }

  // Personal compliance checks documents management functions 📚
  public getAllPersonDocs(personId) {
    return this._valuationFacadeSvc.getAllPersonDocs(personId)
  }
  public getPeopleDocsForValuation(contactGroupId, valuationEventId) {
    return this._valuationFacadeSvc.getPeopleDocsForValuation(contactGroupId, valuationEventId)
  }
  public updatePersonDocuments(personDocuments) {
    return this._valuationFacadeSvc.updateLocalValuation({personDocuments})
  }

  public getAllPersonDocsForContactGroup(contactPeople: any[]) {
    console.log('loop ', contactPeople, ' and fetch their compliance documents')
    return this.getAllPersonDocs(contactPeople[0].personId)
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
