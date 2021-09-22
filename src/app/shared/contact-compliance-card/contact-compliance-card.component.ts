import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact-compliance-card.component.html'
})
export class ContactComplianceCardComponent implements OnInit {

  @Input() pillLabel: string
  @Input() name: string
  @Input() address: string
  @Input() documents: any

  pillClass: string

  constructor() { }

  ngOnInit(): void {
    this.pillClass = this.pillLabel == 'lead' ? 'pill--positive' : ''
  }

}
