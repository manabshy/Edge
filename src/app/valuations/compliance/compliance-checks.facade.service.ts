// compliance-checks.facade.service.ts
/**
 * @function ComplianceChecksFacadeService
 * @description service providing functions to facilitate compliance checks for personal and company owned valuations
 */
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter, take } from 'rxjs/operators'
import { PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'
import { ValuationFacadeService } from '../shared/valuation-facade.service'


@Injectable({
  providedIn: 'root'
})
export class ComplianceChecksFacadeService {
  private _contactSearchResults: BehaviorSubject<PotentialDuplicateResult> = new BehaviorSubject(null)

  constructor(private _valuationFacadeSvc: ValuationFacadeService) {}

  public valuation$: Observable<any> = this._valuationFacadeSvc.valuationData$

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
  public unfreezeCompanyDocsForValuation(contactGroupId: number, valuationEventId: number) {
    return this._valuationFacadeSvc.unfreezeCompanyDocsForValuation(contactGroupId, valuationEventId)
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
  public unfreezePeopleDocsForValuation(contactGroupId: number, valuationEventId: number) {
    return this._valuationFacadeSvc.unfreezePeopleDocsForValuation(contactGroupId, valuationEventId)
  }

  // Passing compliance tests ✔️
  public passComplianceChecksForValution(entitiesToPass) {
    if (entitiesToPass.entitiesToSave) {
      return this._valuationFacadeSvc.freezePeopleDocsForValuation(
        entitiesToPass.entitiesToSave,
        entitiesToPass.contactGroupId
      )
    } else {
      return this._valuationFacadeSvc.freezeCompanyDocsForValuation(
        entitiesToPass.savePayload,
        entitiesToPass.contactGroupId
      )
    }
  }

  // Generic save temp file 💾
  public saveFileTemp(tmpFiles) {
    return this._valuationFacadeSvc.saveFileTemp(tmpFiles)
  }
}
