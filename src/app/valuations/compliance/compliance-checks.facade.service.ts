import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { CompanyService } from 'src/app/company/shared/company.service'
import { PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'

@Injectable({
  providedIn: 'root'
})
export class ComplianceChecksFacadeService {
  constructor(
    private _contactGroupService: ContactGroupsService,
    private _router: Router,
    private _companyService: CompanyService
  ) {}

  private _contactSearchResults: BehaviorSubject<PotentialDuplicateResult> = new BehaviorSubject(null)
  public contactSearchResults$: Observable<PotentialDuplicateResult> = this._contactSearchResults.asObservable()

  public newCompanyAdded$: Observable<any> = this._companyService.newCompanyChanges$

  public onQueryDuplicates(person) {
    this._contactGroupService.getPotentialDuplicatePeople(person).subscribe((data) => {
      this._contactSearchResults.next(data)
    })
  }
}
