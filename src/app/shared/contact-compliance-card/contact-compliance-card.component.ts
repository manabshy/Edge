import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact-compliance-card',
  templateUrl: './contact-compliance-card.component.html'
})
export class ContactComplianceCardComponent implements OnInit {

  @Input() contact: any

  pillClass: string

  constructor() { }

  ngOnInit(): void {
    this.pillClass = this.contact.pillLabel == 'lead' ? 'pill--positive' : 'bg-gray-400'
  }

}
