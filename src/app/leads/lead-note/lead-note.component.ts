import { Component, OnInit, Renderer2, Input, OnChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { ContactNote } from 'src/app/contactgroups/shared/contact-group';
import { ValidationService } from 'src/app/core/services/validation.service';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { Person } from 'src/app/shared/models/person';
import { LeadsService } from '../shared/leads.service';

@Component({
  selector: 'app-lead-note',
  templateUrl: './lead-note.component.html',
  styleUrls: ['./lead-note.component.scss']
})
export class LeadNoteComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() selectedPerson: Person;
  @Input() isDisabled: boolean;
  @Input() isUpdateComplete: boolean;
  @Input() noteRequiredWarning: string;
  @Input() noteIsRequired = false;
  @Output() leadNote = new EventEmitter<ContactNote>();
  @ViewChild('note', { static: true }) noteComponent: ElementRef;
  public keepOriginalOrder = (a) => a.key;
  showErrorMessage = false;

  shortcuts = {
    'Left Message': 'Left message',
    'SMS': 'Sent an SMS',
    'Emailed': 'Emailed'
  };

  personNote: ContactNote;
  noteForm: FormGroup;
  note: string;

  constructor(private fb: FormBuilder, private leadService: LeadsService, private validationService: ValidationService) {
    super();
  }


  ngOnInit() {
    this.formInit();
    this.leadService.isLeadUpdated$.subscribe(data => {
      if (data) {
        console.log('is updated in note', data)
        this.noteForm?.reset();
      }
    });

    this.validationService.noteIsRequired$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => this.showErrorMessage = res);

  }

  formInit() {
    this.noteForm = this.fb.group({
      isImportant: false,
      isPinned: false,
      text: ['']
    });

    this.noteForm.valueChanges.subscribe(val => {
      if (val) {
        this.showErrorMessage = false;
        this.note = val.text;
        console.log({ val });

        if (val.text) {
          this.leadNote.emit(this.getNote());
        }
      }
    });


  }

  ngOnChanges() {
    if (this.isUpdateComplete) {
      this.noteForm.reset();
    }
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

