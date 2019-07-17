import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Person } from '../models/person';
import { TargetLocator } from 'selenium-webdriver';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { PersonNote } from 'src/app/contactgroups/shared/contact-group';

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
  personNote: PersonNote;
  noteForm: FormGroup;
  shortcuts = {
    'LVM': 'Left voice mail',
    'LVMTCB': 'Left voice mail to call back',
    'SW': 'Spoke with',
    'FDT': 'Foreign dial tone',
    'SMS\'D': 'Sent an SMS',
    'RO': 'Rang off/out',
    'STVM': 'Straight to voice mail',
    'EA/OA': 'External/enemy agent or other agent',
    'UO': 'Under offer',
    'NNW': 'Number not working'
  };
  shortcutsAdded: any[] = [];
  public keepOriginalOrder = (a) => a.key;
  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.selectedPerson = this.data.person || null;

    this.noteForm = this.fb.group({
      isImportant: false,
      text: ['']
    });
  }

  select(person: Person) {
    if (person) {
      this.selectedPerson = person;
    }
    this.step2 = true;
  }

  consumeShortcut(shortcut: string) {
    const index = this.shortcutsAdded.indexOf(shortcut);
    const text = '';
    if (index >= 0) {
      this.shortcutsAdded.splice(index, 1);
    } else {
      this.shortcutsAdded.push(shortcut);
    }
    this.shortcutsAdded.forEach(x => {
      text += x + ', ';
    });
    text = text.replace(/,\s*$/, '');
    this.noteForm.get('text').setValue(text);
  }

  action(value: boolean) {
    this.saveNote();
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

  saveNote() {
    const note = {...this.personNote, ...this.noteForm.value};
    console.log('here............', note);
    if(note && this.selectedPerson){
      note.personId = this.selectedPerson.personId;
      this.contactGroupService.addPersonNote(note).subscribe(data=>{
        console.log('added  person note', data);
      })
    }
    // if (this.noteForm) {
    //   this.noteForm.reset();
    // }
    // if (this.noteForm.valid) {
    //   if (this.noteForm.dirty) {
    //     const note = {...this.personNote, ...this.noteForm.value};
    //     if (note && this.selectedPerson) {
    //       this.contactGroupService.addPersonNotes(note).subscribe(data => {
    //         console.log('added  person note', data);
    //       });
    //     }
    //   }
    // }
  }
}
