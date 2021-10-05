import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuItem } from "primeng/api";
import moment from 'moment';

/***
 * @description shows company or contact compliance data such as ID, proof of address, reports and additional documents
 */
@Component({
  selector: 'app-compliance-card',
  templateUrl: './compliance-card.component.html'
})
export class ComplianceCardComponent implements OnInit {

  @Input() person: any
  @Input() hasMenuBtn: boolean
  @Output() fileUploaded: EventEmitter<any> = new EventEmitter
  @Output() fileDeleted: EventEmitter<any> = new EventEmitter
  
  contactForm: FormGroup = new FormGroup({
    name: new FormControl(),
    position: new FormControl(),
    address: new FormControl(),
  })
  pillClass: string
  items: MenuItem[] = []
  dialogs = {
    showRemoveContactDialog: false,
    showEditContactDialog: false
  }
  moment = moment

  constructor() { }

  ngOnInit(): void {
    this.pillClass = this.person.pillLabel == 'lead' ? 'pill--positive' : 'bg-gray-400'
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
        icon:  this.person.isUBO ? 'fa fa-toggle-off' : 'fa fa-toggle-on',
        command: (ev) => {
          this.person.isUBO = !this.person.isUBO
          this.setMenuItems() // refreshes options again
          // TODO: save
        },
      },
    ];
  }

  public confirmContactDelete() :void {
    console.log('user has confirmed deletion of ', this.person.id)
    this.dialogs.showRemoveContactDialog = false
    // TODO wire up contact removal/deletion
  }

  public saveContactChanges() :void {
    this.dialogs.showEditContactDialog = false
    console.log('this.contactForm', this.contactForm.value)
    // TODO wire up save
  }
}
