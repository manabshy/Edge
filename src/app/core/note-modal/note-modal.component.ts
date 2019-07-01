import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Person } from '../models/person';

@Component({
  selector: 'app-note-modal',
  templateUrl: './note-modal.component.html',
  styleUrls: ['./note-modal.component.scss']
})
export class NoteModalComponent implements OnInit {
  @Input() data;
  subject: Subject<boolean>;
  step2: boolean = false;
  selectedPerson: Person;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
    this.selectedPerson = this.data.person || null;
  }

  select(person: Person) {
    if(person) {
      this.selectedPerson = person
    }
    this.step2 = true;
  }

  action(value: boolean) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

}
