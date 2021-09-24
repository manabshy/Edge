import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ComplianceService } from '../compliance.service';

@Component({
  selector: 'app-compliance-checks-shell',
  templateUrl: './compliance-checks-shell.component.html'
})
export class ComplianceChecksShellComponent {

  @Input() contacts: any
  @Input() message: any
  @Input() checksAreValid: boolean
  @Input() checkType: string
  @Input() companyOrContact: string
  @Output() passAML: EventEmitter<any> = new EventEmitter
  
  smartSearchAddedDate = new Date() // TODO
  
  dialogs = {
    showContactDialog: false,
    showCompanyDialog: false
  }
  
  constructor(
    public complianceService: ComplianceService
    ) { }
  
  openDialog(dialog){
    console.log('open dialog: ', dialog)
    this.dialogs[dialog] = !this.dialogs[dialog]
  }
}
