import { Component, OnInit, Input, Output, Renderer2, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContactNote, ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { Person } from '../../shared/models/person';
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
  @Input() selectedPerson: Person;
  @Input() selectedContactGroup: ContactGroup;
  @Input() isPersonNote: boolean;
  @Input() data;
  @Input() isCancelVisible: boolean = false;
  @Output() actionEmit = new EventEmitter<boolean>();
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

  constructor(private fb: FormBuilder, private contactGroupService: ContactGroupsService, private toastr: ToastrService, private renderer: Renderer2) { }

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
    if(textValue.includes(shortcut)) {
      if(textValue.includes(shortcut + ', ')){
        textValue = textValue.replace(shortcut + ', ','');
      } else {
        textValue = textValue.replace(shortcut,'');
      }
    } else {
      textValue = textValue.slice(0, 0) + shortcut + ', ' + textValue.slice(0);
    }
    textValue = textValue.replace(/,\s*$/, '');
    textControl.setValue(textValue.trimEnd() + ' ');
    this.renderer.selectRootElement('#note').focus();
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
    if(note && this.selectedPerson) {
      note.personId = this.selectedPerson.personId;
    } else if (note && this.data.personId) {
      note.personId = this.data.personId;
    }
    if (note) {
      this.contactGroupService.addPersonNote(note).subscribe(data => {
        if (data) {
          this.contactGroupService.notesChanged(data);
          this.toastr.success('Note successfully added');
        }
      });
    }
  }
  private addContactNote() {
    const note = { ...this.contactGroupNote, ...this.noteForm.value };
    if(note && this.selectedContactGroup) {
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
