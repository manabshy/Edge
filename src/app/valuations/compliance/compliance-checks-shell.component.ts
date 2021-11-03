import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'
import { ComplianceChecksStore } from './compliance-checks.store'
import { ComplianceChecksState } from './compliance-checks.interfaces'
import { ComplianceChecksFacadeService } from './compliance-checks.facade.service'
import { PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'

/***
 * @description The outermost component for Company & Contact compliance checks inside the valuation edit page. Uses compliance checks store for all server/service/biz logic interactions
 */
@Component({
  selector: 'app-compliance-checks-shell',
  template: `
    <div *ngIf="vm$ | async as vm">
      <app-pure-compliance-checks-shell
        [entities]="vm.entities"
        [checkType]="vm.checkType"
        [message]="vm.message"
        [checksAreValid]="vm.checksAreValid"
        [isFrozen]="vm.isFrozen"
        [companyOrContact]="vm.companyOrContact"
        [contactGroupDetails]="vm.contactGroupDetails"
        [potentialDuplicatePeople]="contactSearchResults$ | async"
        (onFileWasUploaded)="store.onFileUploaded($event)"
        (onFileWasDeleted)="store.onDeleteFileFromEntity($event)"
        (onPassComplianceChecks)="store.onPassComplianceChecks()"
        (onToggleIsUBO)="store.onToggleIsUBO($event)"
        (onRemoveEntity)="store.onRemoveEntity($event)"
        (onUpdateEntity)="store.onUpdateEntity($event)"
        (onAddExistingContact)="store.onAddExistingContact($event)"
        (onAddExistingCompany)="store.onAddExistingCompany($event)"
        (onRefreshDocuments)="store.onRefreshDocuments()"
        (onQueryDuplicates)="facadeSvc.onQueryDuplicates($event)"
        (onCreateNewPerson)="facadeSvc.onCreateNewPerson($event)"
      ></app-pure-compliance-checks-shell>
    </div>
  `,
  providers: [ComplianceChecksStore]
})
export class ComplianceChecksShellComponent {
  vm$: Observable<ComplianceChecksState>
  contactSearchResults$: Observable<PotentialDuplicateResult>

  constructor(public readonly store: ComplianceChecksStore, public readonly facadeSvc: ComplianceChecksFacadeService) {
    this.vm$ = this.store.complianceChecksVm$
    this.contactSearchResults$ = this.facadeSvc.contactSearchResults$

    this.facadeSvc.newCompanyAdded$
      .pipe(
        take(1),
        map((company) => {
          this.store.onAddNewCompany(company)
        })
      )
      .subscribe()

    this.facadeSvc.newPersonAdded$
      .pipe(
        take(1),
        map((contact) => {
          this.store.onAddNewContact(contact)
        })
      )
      .subscribe()
  }
}
