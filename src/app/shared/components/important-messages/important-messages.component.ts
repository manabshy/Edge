import { Component, Input, OnInit } from '@angular/core';
import { ContactNote } from 'src/app/contact-groups/shared/contact-group';

@Component({
  selector: 'app-important-messages',
  templateUrl: './important-messages.component.html',
  styleUrls: ['./important-messages.component.scss']
})
export class ImportantMessagesComponent implements OnInit {
  @Input() importantNotes: ContactNote[];
  constructor() { }

  ngOnInit(): void {
  }

}
