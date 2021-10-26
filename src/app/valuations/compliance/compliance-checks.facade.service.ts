import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { BehaviorSubject, Observable } from 'rxjs'
import { PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'

@Injectable({
  providedIn: 'root'
})
export class ComplianceChecksFacadeService {
  constructor(private contactGroupService: ContactGroupsService, private router: Router) {}

  private _contactSearchResults: BehaviorSubject<PotentialDuplicateResult> = new BehaviorSubject(null)
  public contactSearchResults$: Observable<PotentialDuplicateResult> = this._contactSearchResults.asObservable()

  public onQueryDuplicates(person) {
    // console.log('onQueryDuplicates running ', person)
    this.contactGroupService.getPotentialDuplicatePeople(person).subscribe((data) => {
      // console.log('contactSearchByName results: ', data)
      this._contactSearchResults.next(data)
    })
  }
}
