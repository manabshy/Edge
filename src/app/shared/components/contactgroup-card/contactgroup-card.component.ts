import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactGroup, ContactNote } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Person } from '../../models/person';

@Component({
  selector: 'app-contactgroup-card',
  templateUrl: './contactgroup-card.component.html',
  styleUrls: ['./contactgroup-card.component.scss']
})
export class ContactgroupCardComponent implements OnInit, OnChanges {
  @Input() contactGroup: ContactGroup;
  @Input() showEmailModal = false;
  @Input() showValuationActions = true;

  numOfPeople: number;
  showAdditionalPeople = false;
  firstPerson: Person;
  importantNotes$: Observable<ContactNote[]>;

  constructor(private contactGroupService: ContactGroupsService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('contact groups in the card', this.contactGroup);

    this.numOfPeople = this.contactGroup?.contactPeople?.length;
    this.numOfPeople > 1 ? this.showAdditionalPeople = true : this.showAdditionalPeople = false;
    this.firstPerson = this.contactGroup?.contactPeople[0];
    if (this.firstPerson?.personId) {
      this.getPersonNotes(this.firstPerson?.personId);
    }
  }

  viewDetails(personId: number) {
    if (personId) {
      const people = this.contactGroup?.contactPeople;
      const index = people.findIndex(x => x.personId === personId);
      const person = people.find(x => x.personId === personId);
      this.getPersonNotes(person.personId);
      people.splice(index, 1);
      people.unshift(person);
      console.log({ person }, { people });
    }

  }

  getPersonNotes(personId: number) {
    this.importantNotes$ = this.contactGroupService.getPersonNotes(personId).pipe(map(x => x.filter(n => n.isImportant)));
  }

}
