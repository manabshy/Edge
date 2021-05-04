import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { ContactNote, ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { Person } from '../models/person';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { ToastrService } from 'ngx-toastr';
import { FormErrors, ValidationMessages } from 'src/app/core/shared/app-constants';
import { SharedService } from 'src/app/core/services/shared.service';
import { WedgeValidators } from '../wedge-validators';
import { MessageService } from 'primeng/api';

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
  @Input() isCancelVisible = false;
  @Output() actionEmit = new EventEmitter<boolean>();
  @Output() noteSaved = new EventEmitter<boolean>();
  @ViewChild('note', { static: true }) noteComponent: ElementRef;
  shortcuts = {
    'Left Message': 'Left message',
    'SMS': 'Sent an SMS',
    'Emailed': 'Emailed'
  };

  get textControl() {
    return this.noteForm.get('text') as FormControl;
  }

  public keepOriginalOrder = (a) => a.key;
  formErrors = FormErrors;

  constructor(private fb: FormBuilder,
    private contactGroupService: ContactGroupsService,
    private messageService: MessageService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.formInit();
    this.noteForm.valueChanges.subscribe(() => this.logValidationErrors(this.noteForm, false));
  }

  formInit() {
    this.noteForm = this.fb.group({
      isImportant: false,
      isPinned: false,
      text: ['', [Validators.required, Validators.minLength(1)]]
    });
  }


  // setNoWhiteSpaceValidator(control: AbstractControl) {
  //   if (control.value.trim().length === 0) {
  //     control.setValidators(WedgeValidators.noWhitespaceValidator);
  //     control.updateValueAndValidity();
  //   } else {
  //     control.clearValidators();
  //     control.updateValueAndValidity();
  //   }
  // }

  ctrlEnterSubmit(e) {
    if (e.ctrlKey && e.keyCode === 13) {
      this.action(true);
    }
  }



  action(value: boolean) {
    if (value) {
      this.saveNote();
    }
    this.actionEmit.emit(value);
  }


  /* Duplication of logValidationErrors() and scrollToFirstInvalidField() due to cyclic dependency.
     This component is used in the shared service so we can't
     inject the shared service here.
  */

  logValidationErrors(group: FormGroup = this.noteForm, fakeTouched: boolean, scrollToError = false) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
        FormErrors[key] = '';
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        FormErrors[key] = '';
        console.log('errors in prop edit', control.errors)
        for (const errorKey in control.errors) {
          if (errorKey) {
            FormErrors[key] += messages[errorKey] + '\n';
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched);
      }
    });
    if (scrollToError) {
      this.scrollToFirstInvalidField();
    }
  }

  scrollToFirstInvalidField() {
    const invalidFields = document.getElementsByClassName('invalid');
    if (invalidFields.length) {
      setTimeout(() => {
        if (invalidFields[0]) {
          invalidFields[0].scrollIntoView({ block: 'center' });
        }
      });
    }
  }

  saveNote() {
    console.log(this.data);
    this.logValidationErrors(this.noteForm, true, true);
    if (this.noteForm.valid) {
      if (this.noteForm.dirty) {
        console.log('note form is valid and dirty', this.noteForm.value);
        this.isPersonNote || this.data.isPersonNote || this.data.personId ? this.addPersonNote() : this.addContactNote();
      }
    }
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
          this.onSaveComplete(data);
        }
      });
    }
  }

  private addContactNote() {
    const note = { ...this.contactGroupNote, ...this.noteForm.value } as ContactNote;
    if (note && this.selectedContactGroup) {
      note.contactGroupId = this.selectedContactGroup.contactGroupId;
    } else if (note && this.data.group.contactGroupId) {
      note.contactGroupId = this.data.group.contactGroupId;
    }
    if (note && note.text) {
      this.contactGroupService.addContactGroupNote(note).subscribe(data => {
        if (data) {
          this.onSaveComplete(data);
        }
      });
    }
  }

  private onSaveComplete(data: any) {
    this.formReset();
    this.contactGroupService.notesChanged(data);
    // this.toastr.success('Note successfully added');
    this.messageService.add({ severity: 'success', summary: 'Note successfully added', closable: false});
    this.noteSaved.emit(true);
  }

  private formReset() {
    this.noteForm.reset();
    this.formInit();
  }

}
