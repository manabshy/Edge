import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../models/person';
import { Router } from '@angular/router';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
  @Input() personDetails: Person;
  @Input() isClickable: boolean = true;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigate() {
    this.router.navigate(['/contact-centre/detail/', this.personDetails.personId, 'edit']);
  }
}
