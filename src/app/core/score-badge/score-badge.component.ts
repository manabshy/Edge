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
  }

  calculateScore() {
    let percent = 0;
    let percentRange = 20;
    let message = 'Complete'

    if(this.person) {
      
      if(this.person.address.countryId != 232) {
        percentRange = 25;
      } else {
        if(this.person.address.postCode) {
          percent += percentRange;
        } else {
          message += ', Postcode';
        }
      }

      if(this.person.firstName && this.person.lastName) {
        percent += percentRange;
      } else {
        message += ', Profile';
      }

      if(this.person.address.addressLines) {
        percent += percentRange;
      } else {
        message += ', Address';
      }

      if(this.person.phoneNumbers.length  && this.person.phoneNumbers[0].number) {
        percent += percentRange;
      } else {
        message += ', Phone number';
      }

      if(this.person.emailAddresses.length && this.person.emailAddresses[0].email) {
        percent += percentRange;
      } else {
        message += ', Email address';
      }
    }

    message += ' to have a 100% score';

    this.message = message.replace(',','');

    this.percent = (percent || 15) + '%';


    switch(true) {
      case percent == 100:
        this.bg = 'success';
        this.message = 'Good Job! You\'ve completed this person details.';
        break;
      case percent > 75:
        this.bg = 'warning';
        break;
      default:
        this.bg = 'danger';
    }
  }

}
