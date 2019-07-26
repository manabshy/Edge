import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Person } from '../models/person';
import { TargetLocator } from 'selenium-webdriver';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { PersonNote, ContactGroup, ContactGroupsNote } from 'src/app/contactgroups/shared/contact-group';
import { text } from '@angular/core/src/render3';

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
  personNote: PersonNote;
  contactGroupNote: ContactGroupsNote;
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
  public keepOriginalOrder = (a) => a.key;

  constructor(public bsModalRef: BsModalRef, private fb: FormBuilder, private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
    this.selectedPerson = this.data.person || null;
    this.selectedContactGroup = this.data.group || null;

    this.noteForm = this.fb.group({
      isImportant: false,
      isPinned: false,
      text: ['']
    });
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

  consumeShortcut(shortcut: string) {
    const textControl = this.noteForm.get('text');
    let textValue = textControl.value;
    switch(shortcut){
      case this.shortcuts.LVM:
        textValue = textValue.replace(this.shortcuts.LVMTCB, shortcut);
        textValue += textValue ? '' : shortcut;
        break;
      case this.shortcuts.LVMTCB:
        if(!textValue.includes(this.shortcuts.LVMTCB)) {
          textValue = textValue.replace(this.shortcuts.LVM, shortcut);
          textValue += textValue ? '' : shortcut;
        }
        break;
      default:
        if(textValue.includes(shortcut)) {
          if(textValue.includes(shortcut + ', ')){
            textValue = textValue.replace(shortcut + ', ','');
          } else {
            textValue = textValue.replace(shortcut,'');
          }
        } else {
          textValue = textValue.slice(0, 0) + shortcut + ', ' + textValue.slice(0);
        } 
    }
    textValue = textValue.replace(/,\s*$/, '');
    textControl.setValue(textValue);
  }

  action(value: boolean) {
   if (value) {
      this.saveNote();
   }
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

  saveNote() {
    this.isPersonNote || this.data.isPersonNote || this.data.personId ? this.addPersonNote() : this.addContactNote();
    // if (this.noteForm.valid) {
    //   if (this.noteForm.dirty) {
    //     this.isPersonNote || this.data.isPersonNote || this.data.personId ? this.addPersonNote() : this.addContactNote();
    //   }
    // }
  }

  private addPersonNote() {
    const note = { ...this.personNote, ...this.noteForm.value };
    if (note && this.selectedPerson) {
      note.personId = this.selectedPerson.personId;
      this.contactGroupService.addPersonNote(note).subscribe(data => {
        // if(data) {
        //   this.personNote = data;
        //   this.contactGroupService.personNotesChanged(this.personNote);
        // }
      });
    } else if (note && this.data.personId) {
      note.personId = this.data.personId;
      this.contactGroupService.addPersonNote(note).subscribe(data => {
        if(data) {
          this.personNote = data;
          this.contactGroupService.personNotesChanged(this.personNote);
        }
        console.log('added person note with id', data);
      });
    }
  }
  private addContactNote() {
    const note = { ...this.contactGroupNote, ...this.noteForm.value };
    if (note && this.selectedContactGroup) {
      note.contactGroupId = this.selectedContactGroup.contactGroupId;
      this.contactGroupService.addContactGroupNote(note).subscribe(data => {
        if(data){
          this.contactGroupNote = data;
          this.contactGroupService.contactGroupNotesChanged(this.contactGroupNote);
        }
        console.log('added  contact group note', data);
      });
    }
  }
}
