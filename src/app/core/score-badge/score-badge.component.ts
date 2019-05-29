import { Component, OnInit, Input } from '@angular/core';
import { Person } from '../models/person';
import { FormatAddressPipe } from '../shared/format-address.pipe';

@Component({
  selector: 'app-score-badge',
  templateUrl: './score-badge.component.html',
  styleUrls: ['./score-badge.component.scss']
})
export class ScoreBadgeComponent implements OnInit {

  @Input() person: Person;
  @Input() bar: boolean;

  bg: string;
  percent: string;
  message: string;

  constructor() { }

  ngOnInit() {
    this.calculateScore();
  }

  ngOnChanges() {
    this.calculateScore();
    console.log(this.person);
  }

  calculateScore() {
    let percent = 0;
    let message = 'Complete'

    if(this.person) {
      if(this.person.firstName && this.person.lastName) {
        percent += 25;
      } else {
        message += ', Profile';
      }

      if(this.person.address.addressLines && this.person.address.postCode) {
        percent += 25;
      } else {
        percent += 12.5;
        message += ', Address';
      }

      if(this.person.phoneNumbers.length  && this.person.phoneNumbers[0].number) {
        percent += 25;
      } else {
        message += ', Phone number';
      }

      if(this.person.emailAddresses.length && this.person.emailAddresses[0].email) {
        percent += 25;
      } else {
        message += ', Email address';
      }
    }

    message += ' to have a 100% score';

    this.message = message.replace(',','');

    this.percent = (percent || 15) + '%';


    switch(true) {
      case percent < 100:
        this.bg = 'warning';
        break;
      case percent < 75:
        this.bg = 'danger';
        break;
      default:
        this.bg = 'success';
        this.message = 'Good Job! You\'ve completed this person details.';
    }
  }

}
