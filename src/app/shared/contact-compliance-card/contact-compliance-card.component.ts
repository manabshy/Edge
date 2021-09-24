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
  items: MenuItem[] = [
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
  ];
  dialogs = {
    showRemoveContactDialog: false,
    showEditContactDialog: false
  }

  constructor() { }

  ngOnInit(): void {
    this.pillClass = this.contact.pillLabel == 'lead' ? 'pill--positive' : 'bg-gray-400'
  }

  confirmContactDelete():void {
    console.log('user has confirmed deletion of ', this.contact.name)
    this.dialogs.showRemoveContactDialog = false
  }
}
