import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core'
import { Observable, of } from 'rxjs'
import { ContactGroup, PotentialDuplicateResult } from 'src/app/contact-groups/shared/contact-group'

@Component({
  selector: 'app-pure-compliance-checks-shell',
  templateUrl: './pure-compliance-checks-shell.component.html'
})
export class PureComplianceChecksShellComponent implements OnInit, OnChanges {
  @Input() entities: any[]
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
  @Output() onCreateNewPerson: EventEmitter<any> = new EventEmitter()

  smartSearchAddedDate = new Date() // TODO
  searchTerm: string = ''
  dialogs = {
    showContactDialog: false,
    showCompanyDialog: false,
    showRefreshDocumentstDialog: false
  }
  existingContactIds$: Observable<string[]>
  existingCompanyIds$: Observable<string[]>

  ngOnInit() {
    this.computeExistingIds()
  }

  ngOnChanges(changes) {
    if (changes.entities && !changes.entities.firstChange) {
      this.entities = changes.entities.currentValue
      this.computeExistingIds()
    }
  }

  computeExistingIds() {
    this.existingContactIds$ = of(this.entities.filter((entity) => entity.personId).map((e) => e.personId))
    this.existingCompanyIds$ = of(this.entities.filter((entity) => entity.companyId).map((e) => e.id))
  }

  openDialog(dialog) {
    this.dialogs[dialog] = !this.dialogs[dialog]
  }

  getAddedPersonDetails($event) {
    console.log('getAddedPersonDetails')
  }

  addSelectedContact($event) {
    // console.log('addSelectedContact: ', $event)
    this.onAddContact.emit({ id: $event.personId })
  }

  getCompanyName(ev) {
    console.log('getCompanyName: ', ev)
  }

}
