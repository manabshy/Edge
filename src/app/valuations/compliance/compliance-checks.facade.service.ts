import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { filter, take } from 'rxjs/operators'
import { CompanyService } from 'src/app/company/shared/company.service'
import { PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'

@Injectable({
  providedIn: 'root'
})
export class ComplianceChecksFacadeService {
  constructor(
    private _contactGroupsService: ContactGroupsService,
    private _router: Router,
    private _companyService: CompanyService
  ) {}

  private _contactSearchResults: BehaviorSubject<PotentialDuplicateResult> = new BehaviorSubject(null)
  public contactSearchResults$: Observable<PotentialDuplicateResult> = this._contactSearchResults.asObservable()

  public newCompanyAdded$: Observable<any> = this._companyService.newCompanyChanges$.pipe(
    filter((company) => !!company),
    take(1)
  )
  public newPersonAdded$: Observable<any> = this._contactGroupsService.newPerson$.pipe(
    filter((contact) => !!contact),
    take(1)
  )

  public onQueryDuplicates(person) {
    this._contactGroupsService.getPotentialDuplicatePeople(person).subscribe((data) => {
      this._contactSearchResults.next(data)
    })
  }

  public onCreateNewPerson(newPerson) {
    this._router.navigate(['/contact-centre/detail/0/edit'], {
      queryParams: {
        showDuplicateChecker: false,
        backToOrigin: true,
        isNewPersonalContact: true,
        newPerson: JSON.stringify(newPerson),
        emailPhoneRequired: false
      }
    })
  }
}
