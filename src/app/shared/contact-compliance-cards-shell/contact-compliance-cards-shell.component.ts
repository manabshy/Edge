import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-contact-compliance-shell',
  templateUrl: './contact-compliance-cards-shell.component.html'
})
export class ContactComplianceCardsShellComponent implements OnInit {

  @Input() contacts: any
  @Input() message: any
  @Input() isValid: boolean
  @Input() checkType: string
  @Output() passAML: EventEmitter<any> = new EventEmitter
  smartSearchAddedDate = new Date()

  constructor() { }

  ngOnInit(): void {
  }

}
