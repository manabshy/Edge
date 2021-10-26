import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core'
import { ContactGroup, PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'

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
  @Input() contactGroupDetails: ContactGroup
  @Input() isFrozen: boolean
  @Input() potentialDuplicatePeople: PotentialDuplicateResult

  @Output() onPassComplianceChecks: EventEmitter<any> = new EventEmitter()
  @Output() onFileWasUploaded: EventEmitter<any> = new EventEmitter()
  @Output() onFileWasDeleted: EventEmitter<any> = new EventEmitter()
  @Output() onToggleIsUBO: EventEmitter<any> = new EventEmitter()
  @Output() onUpdateEntity: EventEmitter<any> = new EventEmitter()
  @Output() onRemoveEntity: EventEmitter<any> = new EventEmitter()
  @Output() onAddCompany: EventEmitter<any> = new EventEmitter()
  @Output() onAddContact: EventEmitter<any> = new EventEmitter()
  @Output() onRefreshDocuments: EventEmitter<any> = new EventEmitter()
  @Output() onQueryDuplicates: EventEmitter<any> = new EventEmitter()
  @Output() onNavigatePage: EventEmitter<any> = new EventEmitter()

  smartSearchAddedDate = new Date() // TODO
  searchTerm: string = ''
  dialogs = {
    showContactDialog: false,
    showCompanyDialog: false,
    showRefreshDocumentstDialog: false
  }

  openDialog(dialog) {
    if (dialog === 'ZZshowContactDialog') {
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
      this.onAddContact.emit(fakeContact)
    } else {
      this.dialogs[dialog] = !this.dialogs[dialog]
    }
  }

  getAddedPersonDetails($event) {
    console.log('getAddedPersonDetails')
  }

  addSelectedContact($event) {
    console.log('addSelectedContact: ', $event)
    this.onAddContact.emit({ id: $event.personId })
  }

  getCompanyName(ev) {
    console.log('getCompanyName: ', ev)
  }

  setManualEntryFlag() {
    console.log('setManualEntryFlag')
  }
}
