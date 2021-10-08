import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { ComplianceChecksStore } from './compliance-checks.store'
import { ComplianceChecksState } from './compliance-checks.interfaces'

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
        [companyOrContact]="vm.companyOrContact"
        (fileWasUploaded)="onFileUploaded($event)"
        (fileWasDeleted)="onFileDeleted($event)"
        (passComplianceChecks)="onPassComplianceChecks()"
        (toggleIsUBO)="onToggleIsUBO($event)"
        (removeContact)="onRemoveContact($event)"
        (saveContact)="onSaveContact($event)"
        (addContact)="onAddContact($event)"
        (addCompany)="onAddCompany($event)">
      </app-pure-compliance-checks-shell>
    </div>`,
  providers: [ComplianceChecksStore]
})
export class ComplianceChecksShellComponent {

  vm$: Observable<ComplianceChecksState>

  constructor(
    private readonly _complianceChecksStore: ComplianceChecksStore,
  ) {
    this.vm$ = this._complianceChecksStore.complianceChecksVm$
  }

  onPassComplianceChecks(): void {
    this._complianceChecksStore.passComplianceChecks()
  }

  onFileUploaded(ev): void {
    this._complianceChecksStore.addFilesToPerson(ev)
  }

  onFileDeleted(ev): void {
    this._complianceChecksStore.deleteFileFromPerson(ev)
  }
  
  onAddContact(ev): void {
    this._complianceChecksStore.addContact(ev)
  }
  
  onAddCompany(ev): void {
    this._complianceChecksStore.addCompany(ev)
  }

  onToggleIsUBO(ev): void {
    this._complianceChecksStore.toggleIsUBO(ev)
  }
  
  onSaveContact(ev) :void {
    this._complianceChecksStore.saveContact(ev)
  }

  onRemoveContact(ev) :void {
    this._complianceChecksStore.removeContact(ev)
  }
}
