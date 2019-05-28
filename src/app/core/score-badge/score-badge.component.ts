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
    let message = 'Complete '

    if(this.person) {
      if(this.person.firstName && this.person.lastName) {
        percent += 25;
      } else {
        message += 'Profile, ';
      }

      let address;
      if(this.person.address){
        address = new FormatAddressPipe().transform(this.person.address);
      } else {
        address = this.person.address.postCode;
      }

      if(address) {
        percent += 25;
      } else {
        message += 'Address, ';
      }

      if(this.person.phoneNumbers.length) {
        percent += 25;
      } else {
        message += 'Phone number, ';
      }

      if(this.person.emailAddresses.length) {
        percent += 25;
      } else {
        message += 'Email address, ';
      }
    }

    message += 'to have a 100% score';

    this.message = message;

    this.percent = (percent || 15) + '%';


    switch(percent) {
      case 100:
        this.bg = 'success';
        this.message = 'Good Job! You\'ve completed this person details.';
        break;
      case 75:
        this.bg = 'warning';
        break;
      default:
        this.bg = 'danger';
    }
  }

}
