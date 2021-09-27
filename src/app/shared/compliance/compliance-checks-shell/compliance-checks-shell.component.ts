import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplianceChecksStore } from '../compliance-checks.store';

/***
 * @description The outermost component for compliance checks. Uses compliance checks store for all server/service/biz logic interactions
 */
@Component({
  selector: 'app-compliance-checks-shell',
  template: `
    <app-pure-compliance-checks-shell
      [people]="people$ | async"
      [checkType]="checkType"
      [message]="message"
      [checksAreValid]="complianceChecksAreValid"
      [companyOrContact]="companyOrContact"
      (fileWasUploaded)="onFileUploaded($event)"
      (fileWasDeleted)="onFileDeleted($event)"
      (passComplianceChecks)="onPassComplianceChecks($event)">
    </app-pure-compliance-checks-shell>`,
  providers: [ComplianceChecksStore]
})
export class ComplianceChecksShellComponent implements OnInit {

  people$: Observable<any>
  companyOrContact: string = 'contact' // TODO
  complianceChecksAreValid: boolean = true // TODO
  checkType: string = 'AML' // TODO
  message: any = {
    type:'success',
    text:['AML Completed', 'SmartSearch added: 7th Sep 2020 (11:45)']
  } // TODO

  constructor(
    private readonly _complianceChecksStore: ComplianceChecksStore,
    ) { 
      this.people$ = this._complianceChecksStore.contacts$
    }
  
    ngOnInit(){
    }

    onFileUploaded(ev) {
      console.log('onFileUploaded: ', ev)      
      this._complianceChecksStore.saveFilesTemp(ev)
    }

    onFileDeleted(ev) {
      console.log('onFileDeleted: ', ev)
      this._complianceChecksStore.deleteFiles()
    }
    
    onPassComplianceChecks(ev) :void {
      console.log('onPassComplianceChecks: ', ev)
      this._complianceChecksStore.passComplianceChecks(ev)
    }

}
