import { Component, Input, OnInit } from '@angular/core';
import { Person } from '../../models/person';

@Component({
  selector: 'app-marketing-preferences',
  templateUrl: './marketing-preferences.component.html',
  styleUrls: ['./marketing-preferences.component.scss']
})
export class MarketingPreferencesComponent implements OnInit {
  @Input() personDetails: Person;
  constructor() { }

  ngOnInit(): void {
  }

}
