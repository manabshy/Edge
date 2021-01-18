import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { Person } from '../../models/person';

@Component({
  selector: 'app-contactgroup-card',
  templateUrl: './contactgroup-card.component.html',
  styleUrls: ['./contactgroup-card.component.scss']
})
export class ContactgroupCardComponent implements OnInit, OnChanges {
  @Input() contactGroup: ContactGroup;
  numOfPeople: number;
  showAdditionalPeople = false;
  firstPerson: Person;
  constructor() { }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('contact groups in the card', this.contactGroup);

    this.numOfPeople = this.contactGroup?.contactPeople?.length;
    this.numOfPeople > 1 ? this.showAdditionalPeople = true : this.showAdditionalPeople = false;
    this.firstPerson = this.contactGroup?.contactPeople[0];
  }

  viewDetails(personId: number) {
    if (personId) {
      const people = this.contactGroup?.contactPeople;
      const index = people.findIndex(x => x.personId === personId);
      const person = people.find(x => x.personId === personId);

      people.splice(index, 1);
      people.unshift(person);
      console.log({ person }, { people });
    }

  }

}
