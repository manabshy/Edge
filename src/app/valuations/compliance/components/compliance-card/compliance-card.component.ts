import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import moment from 'moment'

/***
 * @description shows company or contact compliance data such as ID, proof of address, reports and additional documents
 */
@Component({
  selector: 'app-compliance-card',
  templateUrl: './compliance-card.component.html',
})
export class ComplianceCardComponent implements OnInit {
  @Input() person: any
  @Input() hasMenuBtn: boolean
  @Input() isFrozen: boolean
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter()
  @Output() fileDeleted: EventEmitter<any> = new EventEmitter()
  @Output() toggleIsUBO: EventEmitter<any> = new EventEmitter()
  @Output() removeContact: EventEmitter<any> = new EventEmitter()
  @Output() saveContact: EventEmitter<any> = new EventEmitter()

  contactForm: FormGroup = new FormGroup({
    name: new FormControl(),
    position: new FormControl(),
    address: new FormControl(),
  })

  pillClass: string
  items: MenuItem[] = []
  dialogs = {
    showRemoveContactDialog: false,
    showEditContactDialog: false,
  }
  moment = moment
  pillLabel: String

  constructor() {}

  ngOnInit(): void {
    this.pillClass = this.person.isMain ? 'pill--positive' : 'bg-gray-400'
    this.pillLabel = this.person.isMain ? 'Lead Contact' : 'Associated Contact'
    this.setMenuItems()
  }

  private setMenuItems() {
    this.items = [
      {
        label: 'Edit Contact',
        icon: 'fa fa-edit',
        command: (ev) => {
          this.dialogs.showEditContactDialog = !this.dialogs.showEditContactDialog
        },
      },
      {
        label: 'Remove Contact',
        icon: 'fa fa-times',
        command: (ev) => {
          this.dialogs.showRemoveContactDialog = !this.dialogs.showRemoveContactDialog
        },
      },
      {
        label: this.person.isUBO ? 'Remove as UBO' : 'Make UBO',
        icon: this.person.isUBO ? 'fa fa-toggle-off' : 'fa fa-toggle-on',
        command: (ev) => {
          this.setMenuItems() // refreshes options again
          this.toggleIsUBO.emit(this.person)
        },
      },
    ]
  }

  public confirmContactDelete(): void {
    this.dialogs.showRemoveContactDialog = false
    this.removeContact.emit(this.person)
  }

  public saveContactChanges(): void {
    this.dialogs.showEditContactDialog = false
    this.saveContact.emit(this.contactForm.value)
  }
}
