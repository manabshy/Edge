import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { ComplianceChecksStore } from './compliance-checks.store'
import { ComplianceChecksState } from './compliance-checks.interfaces'
import { ComplianceChecksFacadeService } from './compliance-checks.facade.service'
import { PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'

/***
 * @description The outermost component for Company & Contact compliance checks. Uses compliance checks store for all server/service/biz logic interactions
 */
@Component({
  selector: 'app-compliance-checks-shell',
  template: `
    <div *ngIf="vm$ | async as vm">
      <app-pure-compliance-checks-shell
        [people]="vm.people"
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
        (onAddContact)="store.onAddContact($event)"
        (onAddCompany)="store.onAddCompany($event)"
        (onRefreshDocuments)="store.onRefreshDocuments()"
        (onQueryDuplicates)="facadeSvc.onQueryDuplicates($event)"
        (onNavigatePage)="facadeSvc.onNavigatePage($event)"
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
  }
}
