import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-pure-compliance-checks-shell',
  templateUrl: './pure-compliance-checks-shell.component.html',
})
export class PureComplianceChecksShellComponent {

  @Input() people: any[]
  @Input() message: any
  @Input() checksAreValid: boolean
  @Input() checkType: string // AML || KYC
  @Input() companyOrContact: string // company || contact
  @Input() contactGroupDetails: any
  @Output() passComplianceChecks: EventEmitter<any> = new EventEmitter
  @Output() fileWasUploaded: EventEmitter<any> = new EventEmitter
  @Output() fileWasDeleted: EventEmitter<any> = new EventEmitter
  
  smartSearchAddedDate = new Date() // TODO
  
  dialogs = {
    showContactDialog: false,
    showCompanyDialog: false
  }
  
  openDialog(dialog){
    console.log('open dialog: ', dialog)
    this.dialogs[dialog] = !this.dialogs[dialog]
  }

  searchTerm: string = '';
  
  getAddedPersonDetails($event) {
    console.log('getAddedPersonDetails')
  }

  getSelectedPerson($event){
    console.log('createNewPerson')
  }
  
  createNewPerson(){
    console.log('createNewPerson')
  }

}
