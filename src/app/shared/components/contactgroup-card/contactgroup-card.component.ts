import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-contactgroup-card',
  templateUrl: './contactgroup-card.component.html',
  styleUrls: ['./contactgroup-card.component.scss']
})
export class ContactgroupCardComponent implements OnInit, OnChanges {
  @Input() contactGroup: ContactGroup;
  numOfPeople: number;
  constructor() { }
  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('contact groups in the card', this.contactGroup);

    this.numOfPeople = this.contactGroup?.contactPeople?.length;
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
