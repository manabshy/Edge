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
  @Input() isFrozen: boolean

  @Output() passComplianceChecks: EventEmitter<any> = new EventEmitter
  @Output() fileWasUploaded: EventEmitter<any> = new EventEmitter
  @Output() fileWasDeleted: EventEmitter<any> = new EventEmitter
  @Output() toggleIsUBO: EventEmitter<any> = new EventEmitter
  @Output() saveContact: EventEmitter<any> = new EventEmitter
  @Output() removeContact: EventEmitter<any> = new EventEmitter
  @Output() addCompany: EventEmitter<any> = new EventEmitter
  @Output() refreshDocuments: EventEmitter<any> = new EventEmitter
  
  smartSearchAddedDate = new Date() // TODO
  
  dialogs = {
    showContactDialog: false,
    showCompanyDialog: false,
    showRefreshDocumentstDialog: false
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

  getCompanyName(ev) {
    console.log('getCompanyName: ', ev)
  }

  selectCompany(ev) {
    console.log('selectCompany: ', ev)
    console.log('Add this company to the valuation TODO')
    this.addCompany.emit(ev)
  }

  setManualEntryFlag() {
    console.log('setManualEntryFlag')
  }

}
