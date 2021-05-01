import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-redacted-card',
  templateUrl: './redacted-card.component.html',
  styleUrls: ['./redacted-card.component.scss']
})
export class RedactedCardComponent implements OnInit {
  @Input() showAddPerson: boolean;
  @Input() showCards = false;
  @Input() cardButtonLabel: string;
  @Output() addPerson = new EventEmitter<boolean>();
  @Output() cardButtonClicked = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }

}
