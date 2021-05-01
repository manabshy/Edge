import { Component, OnInit, Input} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Person } from '../models/person';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.scss']
})
export class NoteModalComponent implements OnInit {
  @Input() data;
  subject: Subject<boolean>;
  step2 = false;
  selectedPerson: Person;
  selectedContactGroup: ContactGroup;
  isPersonNote: boolean;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.selectedPerson = this.data.person || null;
    this.selectedContactGroup = this.data.group || null;
  }

  select(person: Person) {
    console.log('selected person', person);
    if (person) {
      this.selectedPerson = person;
      this.isPersonNote = true;
    }
    this.step2 = true;
  }
  selectGroup(group: ContactGroup) {
    console.log('selected group', group);
    if (group) {
      this.selectedContactGroup = group;
    }
    this.step2 = true;
  }

  action(value: boolean) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }
}
