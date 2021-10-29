import { Injectable, Injector } from '@angular/core'
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

  public contactSearchResults$: Observable<PotentialDuplicateResult> = this._contactSearchResults.asObservable()

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
}
