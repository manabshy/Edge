import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  FileUploadControl,
  FileUploadValidators,
} from "@iplab/ngx-file-upload";
import { BehaviorSubject, Subscription } from "rxjs";
import { FileTypeEnum } from "src/app/core/services/file.service";
import { SharedService } from "src/app/core/services/shared.service";
import { FormErrors } from "src/app/core/shared/app-constants";
import { PropertyNote } from "src/app/property/shared/property";

@Component({
  selector: "app-standalone-note",
  templateUrl: "./standalone-note.component.html",
  styleUrls: ["./standalone-note.component.scss"],
})
export class StandAloneNoteComponent
  implements OnInit, OnDestroy, AfterViewInit {
  private _note;
  set note(value) {
    if (value && this._note != value) {
      this._note = value;
      if (this._note && this._note.id > 0) this.isNewMode = false;
    }
  }

  @Input() get note() {
    return this._note;
  }

  @Input() currentStaffMember: any;
  @Output() getNote: EventEmitter<any> = new EventEmitter();

  isEditMode = false;
  isNewMode = false;
  noteForm: FormGroup;
  formErrors = FormErrors;

  constructor(private fb: FormBuilder, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.noteForm = this.fb.group({
      text: ["", [Validators.required, Validators.minLength(1)]],
    });
    this.noteForm.valueChanges.subscribe(() =>
      this.sharedService.logValidationErrors(this.noteForm, true)
    );
  }

  getClassName(jobType: number) {
    const className = "warning--light";
    if (jobType === 1) {
      return "positive--light";
    }
    if (jobType === 2) {
      return "blossom--light";
    }
    if (jobType === 3) {
      return "info--light";
    }
    return className;
  }

  ngAfterViewInit(): void {}

  saveNote() {
    this.noteForm.markAsDirty();
    this.sharedService.logValidationErrors(this.noteForm, true);
    if (this.noteForm.valid) {
      this.note.text = this.noteForm.controls["text"].value;
      this.getNote.emit(this.note);
    }
  }

  ngOnDestroy(): void {}
}
