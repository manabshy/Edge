import { Component, OnInit, Renderer2, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactNote } from 'src/app/contactgroups/shared/contact-group';
import { Person } from 'src/app/shared/models/person';

@Component({
  selector: 'app-lead-note',
  templateUrl: './lead-note.component.html',
  styleUrls: ['./lead-note.component.scss']
})
export class LeadNoteComponent implements OnInit, OnChanges {
  @Input() selectedPerson: Person;
  @Input() isDisabled: boolean;
  @Input() isUpdateComplete: boolean;
  @Input() noteRequiredWarning: string;
  @Output() leadNote = new EventEmitter<ContactNote>();
  public keepOriginalOrder = (a) => a.key;

  shortcuts = {
    'Left Message': 'Left message',
    'SMS': 'Sent an SMS',
    'Emailed': 'Emailed'
  };

  personNote: ContactNote;
  noteForm: FormGroup;
  note: string;

  constructor(private fb: FormBuilder, private renderer: Renderer2) { }


  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.noteForm = this.fb.group({
      isImportant: false,
      isPinned: false,
      text: ['']
    });

    this.noteForm.valueChanges.subscribe(val => {
      this.note = val.text;
      this.leadNote.emit(this.getNote());
    });


  }

  ngOnChanges() {
    if (this.isUpdateComplete) {
      this.noteForm.reset();
    }
    console.log('Lead Note Component:', this.isDisabled);
    console.log('Note required warning:', this.noteRequiredWarning);
  }

  consumeShortcut(shortcut: string) {
    const textControl = this.noteForm.get('text');
    let textValue = textControl.value || '';
    if (textValue.includes(shortcut)) {
      if (textValue.includes(shortcut + ', ')) {
        textValue = textValue.replace(shortcut + ', ', '');
      } else {
        textValue = textValue.replace(shortcut, '');
      }
    } else {
      textValue = textValue.slice(0, 0) + shortcut + ', ' + textValue.slice(0);
    }
    textValue = textValue.replace(/,\s*$/, '');
    textControl.setValue(textValue.trimEnd() + ' ');
    this.renderer.selectRootElement('#note').focus();
  }

  ctrlEnterSubmit(e) {
    if (e.ctrlKey && e.keyCode == 13) {
      //this.action(true);
    }
  }

  action(value: boolean) {
    if (value) {
      //this.saveNote();
    }
    //this.actionEmit.emit(value);
  }

  private formReset() {
    this.noteForm.reset();
    this.formInit();
  }

  getNote() {
    const note = { ...this.personNote, ...this.noteForm.value } as ContactNote;
    if (note && this.selectedPerson) {
      note.personId = this.selectedPerson.personId;
    }
    return note;
  }

}

