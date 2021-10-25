import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-pure-compliance-checks-shell',
  templateUrl: './pure-compliance-checks-shell.component.html'
})
export class PureComplianceChecksShellComponent {
  @Input() people: any[]
  @Input() message: any
  @Input() checksAreValid: boolean
  @Input() checkType: string // AML || KYC
  @Input() companyOrContact: string // company || contact
  @Input() contactGroupDetails: any
  @Input() isFrozen: boolean

  @Output() passComplianceChecks: EventEmitter<any> = new EventEmitter()
  @Output() fileWasUploaded: EventEmitter<any> = new EventEmitter()
  @Output() fileWasDeleted: EventEmitter<any> = new EventEmitter()
  @Output() toggleIsUBO: EventEmitter<any> = new EventEmitter()
  @Output() saveContact: EventEmitter<any> = new EventEmitter()
  @Output() removeContact: EventEmitter<any> = new EventEmitter()
  @Output() addCompany: EventEmitter<any> = new EventEmitter()
  @Output() addContact: EventEmitter<any> = new EventEmitter()
  @Output() refreshDocuments: EventEmitter<any> = new EventEmitter()

  smartSearchAddedDate = new Date() // TODO

  dialogs = {
    showContactDialog: false,
    showCompanyDialog: false,
    showRefreshDocumentstDialog: false
  }

  openDialog(dialog) {
    if (dialog === 'showContactDialog') {
      console.log('showContactDialog running hard coded contact add')
      //       66910 1 NULL Andrew
      // 66911 1 Jean-Marc
      // 66912 1 Julian
      // 66913 1 James
      // 66914 1 David
      // 66915 1 Clive
      // 66916 1 NULL Tom
      // 66917 2 Kate
      // 66918 3 Rebecca
      // 66919 2 Pauline
      // 66920 3 NULL Emma
      // 66921 1 Michael
      // 66922 2 Jennifer
      // 66923 1 Deri
      // 66924 2 Joanna
      // 66925 2 Dawn
      // 66926 1 Dave
      // 66927 1 Mark
      // 66928 2 Kirsten
      // 66929 1 Alan
      const fakeContact = {
        id: 87561,
        personId: 87561,
        position: 'CEO',
        address: 'Top of the Stairs',
        name: 'Riaaz'
      }
      this.addContact.emit(fakeContact)
    } else {
      this.dialogs[dialog] = !this.dialogs[dialog]
    }
  }

  searchTerm: string = ''

  getAddedPersonDetails($event) {
    console.log('getAddedPersonDetails')
  }

  getSelectedPerson($event) {
    console.log('createNewPerson')
  }

  createNewPerson() {
    console.log('createNewPerson')
  }

  getCompanyName(ev) {
    console.log('getCompanyName: ', ev)
  }

  selectCompany(ev) {
    this.addCompany.emit(ev)
  }

  setManualEntryFlag() {
    console.log('setManualEntryFlag')
  }

  getSelectedContactGroup(ev) {
    console.log('getSelectedContactGroup: ', ev)
    this.addContact.emit(ev)
  }
}
