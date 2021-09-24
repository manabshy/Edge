import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuItem } from "primeng/api";

@Component({
  selector: 'app-contact-compliance-card',
  templateUrl: './contact-compliance-card.component.html'
})
export class ContactComplianceCardComponent implements OnInit {

  @Input() contact: any
  @Input() hasMenuBtn: boolean
  
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

  constructor() { }

  ngOnInit(): void {
    this.pillClass = this.contact.pillLabel == 'lead' ? 'pill--positive' : 'bg-gray-400'
    this.setMenuItems()
    console.log('this.contact: ', this.contact)
  }

  private setMenuItems() {
    this.items = [
      {
        label: 'Edit Contact',
        icon: 'fa fa-edit',
        command: (ev) => {
          console.log('edit contact: ', ev)
          this.dialogs.showEditContactDialog = !this.dialogs.showEditContactDialog
        },
      },
      {
        label: 'Remove Contact',
        icon: 'fa fa-times',
        command: (ev) => {
          console.log('Remove contact: ', ev)
          this.dialogs.showRemoveContactDialog = !this.dialogs.showRemoveContactDialog
        },
      },
      {
        label: this.contact.isUBO ? 'Remove as UBO' : 'Make UBO',
        icon:  this.contact.isUBO ? 'fa fa-toggle-off' : 'fa fa-toggle-on',
        command: (ev) => {
          console.log('Toggling UBO: ', ev)
          this.contact.isUBO = !this.contact.isUBO
          this.setMenuItems() // refreshes options again
          // TODO: save
        },
      },
    ];
  }

  public confirmContactDelete() :void {
    console.log('user has confirmed deletion of ', this.contact.id)
    this.dialogs.showRemoveContactDialog = false
  }

  public saveContactChanges() :void {
    this.dialogs.showEditContactDialog = false
    console.log('this.contactForm', this.contactForm.value)
  }
}
