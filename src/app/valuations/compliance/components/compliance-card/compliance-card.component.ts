import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MenuItem } from 'primeng/api'
import moment from 'moment'

/***
 * @description shows company or contact compliance data such as ID, proof of address, reports and additional documents
 */
@Component({
  selector: 'app-compliance-card',
  templateUrl: './compliance-card.component.html'
})
export class ComplianceCardComponent implements OnInit {
  @Input() entity: any // TODO add type!
  @Input() isFrozen: boolean
  @Input() hasMenuBtn: boolean

  @Output() onFileUploaded: EventEmitter<any> = new EventEmitter()
  @Output() onFileDeleted: EventEmitter<any> = new EventEmitter()
  @Output() onToggleIsUBO: EventEmitter<any> = new EventEmitter()
  @Output() onRemoveEntity: EventEmitter<any> = new EventEmitter()
  @Output() onUpdateEntity: EventEmitter<any> = new EventEmitter()

  contactForm: FormGroup = new FormGroup({
    name: new FormControl(),
    position: new FormControl(),
    address: new FormControl()
  })

  pillClass: string
  items: MenuItem[] = []
  dialogs = {
    showRemoveDialog: false,
    showEditDialog: false
  }
  moment = moment
  pillLabel: string

  constructor() {}

  ngOnInit(): void {
    this.buildPills()
    this.setMenuItems()
  }

  private buildPills() {
    if (this.entity.companyId) {
      this.pillClass = this.entity.isMain ? 'pill--positive' : 'bg-gray-400'
      this.pillLabel = this.entity.isMain ? 'Company' : 'Associated Company'
    } else {
      this.pillClass = this.entity.isMain ? 'pill--positive' : 'bg-gray-400'
      this.pillLabel = this.entity.isMain ? 'Lead Contact' : 'Associated Contact'
    }
  }

  private setMenuItems() {
    this.items = [
      {
        label: `Edit ${this.entity.companyId ? 'company' : 'contact'}`,
        icon: 'fa fa-edit',
        command: (ev) => {
          this.dialogs.showEditDialog = !this.dialogs.showEditDialog
        }
      },
      {
        label: `Remove ${this.entity.companyId ? 'company' : 'contact'}`,
        icon: 'fa fa-times',
        command: (ev) => {
          this.dialogs.showRemoveDialog = !this.dialogs.showRemoveDialog
        }
      },
      {
        label: this.entity.isUBO ? 'Remove as UBO' : 'Make UBO',
        icon: this.entity.isUBO ? 'fa fa-toggle-off' : 'fa fa-toggle-on',
        command: (ev) => {
          this.setMenuItems() // refreshes options again
          this.onToggleIsUBO.emit(this.entity)
        }
      }
    ]
  }

  public confirmDelete(): void {
    this.dialogs.showRemoveDialog = false
    this.onRemoveEntity.emit(this.entity)
  }

  public updateEntity(): void {
    this.dialogs.showEditDialog = false
    this.onUpdateEntity.emit({ id: this.entity.id, ...this.contactForm.value })
  }
}
