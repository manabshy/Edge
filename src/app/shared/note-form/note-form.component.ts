import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContactNote, ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { Person } from '../models/person';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  noteForm: FormGroup;
  personNote: ContactNote;
  contactGroupNote: ContactNote;
  @Input() isModal: number;
  @Input() selectedPerson: Person;
  @Input() selectedContactGroup: ContactGroup;
  @Input() isPersonNote: boolean;
  @Input() data;
  @Input() isCancelVisible: boolean = false;
  @Output() actionEmit = new EventEmitter<boolean>();
  @ViewChild('note', {static: true}) noteComponent: ElementRef;
  shortcuts = {
    'Left Message': 'Left message',
    'SMS': 'Sent an SMS',
    'Emailed': 'Emailed'
  };
  public keepOriginalOrder = (a) => a.key;

  constructor(private fb: FormBuilder,
    private contactGroupService: ContactGroupsService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.formInit();
  }

  formInit() {
    this.noteForm = this.fb.group({
      isImportant: false,
      isPinned: false,
      text: ['']
    });
    this.noteForm.updateValueAndValidity();
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
    textControl.setValue(textValue.replace(/,\s*$/, '') + ' ');
    this.noteComponent.nativeElement.focus();
  }

  ctrlEnterSubmit(e) {
    if (e.ctrlKey && e.keyCode == 13) {
      this.action(true);
    }
  }



  action(value: boolean) {
    if (value) {
      this.saveNote();
    }
    this.actionEmit.emit(value);
  }

  saveNote() {
    console.log(this.data);
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
    } else if (note && this.data.personId) {
      note.personId = this.data.personId;
    }
    if (note) {
      this.contactGroupService.addPersonNote(note).subscribe(data => {
        if (data) {
          this.formReset();
          this.contactGroupService.notesChanged(data);
          this.toastr.success('Note successfully added');
        }
      });
    }
  }
  private addContactNote() {
    const note = { ...this.contactGroupNote, ...this.noteForm.value };
    if (note && this.selectedContactGroup) {
      note.contactGroupId = this.selectedContactGroup.contactGroupId;
    } else if (note && this.data.group.contactGroupId) {
      note.contactGroupId = this.data.group.contactGroupId;
    }
    if (note) {
      this.contactGroupService.addContactGroupNote(note).subscribe(data => {
        if (data) {
          this.formReset();
          this.contactGroupService.notesChanged(data);
          this.toastr.success('Note successfully added');
        }
        console.log('added  contact group note', data);
      });
    }
  }

  private formReset() {
    this.noteForm.reset();
    this.formInit();
  }

}
