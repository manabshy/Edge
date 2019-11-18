import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../../models/person';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
@Input()  personDetails: Person;
  constructor() { }

  ngOnInit() {
  }

}
