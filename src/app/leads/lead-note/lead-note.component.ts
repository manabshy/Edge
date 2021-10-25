import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { isThisSecond } from "date-fns";
import { Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  takeUntil,
} from "rxjs/operators";
import { ContactNote } from "src/app/contact-groups/shared/contact-group";
import { ValidationService } from "src/app/core/services/validation.service";
import { BaseComponent } from "src/app/shared/models/base-component";
import { Person } from "src/app/shared/models/person";
import { LeadsService } from "../shared/leads.service";

@Component({
  selector: "app-lead-note",
  templateUrl: "./lead-note.component.html",
  styleUrls: ["./lead-note.component.scss"],
})
export class LeadNoteComponent
  extends BaseComponent
  implements OnInit, OnChanges
{
  @Input() selectedPerson: Person;
  @Input() isDisabled: boolean;
  private _isUpdateComplete: boolean;
  @Input() set isUpdateComplete(value: boolean) {
    this._isUpdateComplete = value;
    if (this._isUpdateComplete) {
      this.noteRequired = false;
      this.showErrorMessage = false;
      this.setTextValidator();
    }
  }
  get isUpdateComplete(): boolean {
    return this._isUpdateComplete;
  }
  @Input() noteRequiredWarning: string;
  @Input() noteIsRequired = false;
  @Output() leadNote = new EventEmitter<ContactNote>();
  @Output() formValidChanged = new EventEmitter<boolean>();
  @ViewChild("note", { static: true }) noteComponent: ElementRef;

  public keepOriginalOrder = (a) => a.key;

  showErrorMessage = false;
  personNote: ContactNote;
  noteForm: FormGroup;
  note: string;
  noteRequired = false;

  constructor(
    private fb: FormBuilder,
    private leadService: LeadsService,
    private validationService: ValidationService
  ) {
    super();
  }

  ngOnInit() {
    this.formInit();
    this.leadService.isLeadUpdated$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data) {
          console.log("is updated in note", data);
          this.noteForm?.reset();
        }
      });

    this.noteRequired = false;

    this.validationService.noteIsRequired$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        if (!(this.note && this.note.length > 0)) {
          this.showErrorMessage = res;
          this.setTextValidator();
        }
        this.noteRequired = true;
        console.log({ res });
      });
  }

  formInit() {
    this.noteForm = this.fb.group({
      isImportant: false,
      isPinned: false,
      text: [""],
    });

    this.formValidChanged.emit(true);

    this.noteForm.valueChanges.subscribe((val) => {
      if (val) {
        this.note = val.text;
        this.note = this.note?.trim();
        console.log({ val });
        if (this.note) {
          this.showErrorMessage = false;
          this.leadNote.emit(this.getNote());
        } else if (this.noteRequired) {
          this.showErrorMessage = true;
        }
        this.setTextValidator();
      }
    });
  }

  setTextValidator() {
    if (this.showErrorMessage) {
      this.formValidChanged.emit(false);
    } else {
      this.noteForm.controls["text"].setValidators(null);
      this.formValidChanged.emit(true);
    }
  }

  ngOnChanges() {
    if (this.isUpdateComplete) {
      this.noteForm?.reset();
    }
  }

  getNote() {
    const note = { ...this.personNote, ...this.noteForm.value } as ContactNote;
    if (note && this.selectedPerson) {
      note.personId = this.selectedPerson.personId;
    }
    return note;
  }
}
