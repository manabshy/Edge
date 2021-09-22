import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import {
  FileUploadControl,
  FileUploadValidators,
} from "@iplab/ngx-file-upload";
import { BehaviorSubject, Subscription } from "rxjs";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
})
export class FileUploadComponent implements OnInit, OnDestroy {
  @Input() fileLimit = 50;

  private fileTypes: string = "file_extension|";

  private _onlyAcceptDocument: boolean = false;
  set onlyAcceptDocument(value: boolean) {
    this._onlyAcceptDocument = value;
    if (value) {
      this.fileTypes = this.fileTypes.concat(".pdf|.doc|.docx");
    }
  }
  @Input() get onlyAcceptDocument() {
    return this._onlyAcceptDocument;
  }

  private _onlyAcceptImage: boolean = false;
  set onlyAcceptImage(value: boolean) {
    this._onlyAcceptImage = value;
    if (value) {
      this.fileTypes = this.fileTypes.concat("image/*|media_type");
    }
  }
  @Input() get onlyAcceptImage() {
    return this._onlyAcceptImage;
  }

  private _acceptAll: boolean = false;
  set acceptAll(value: boolean) {
    this._acceptAll = value;
    if (value) {
      this.fileTypes = "file_extension|.pdf|.doc|.docx|image/*|media_type";
    }
  }
  @Input() get acceptAll() {
    return this._acceptAll;
  }

  fileUploadControl: FileUploadControl;
  hasFiles = false;
  private subscription: Subscription;
  public readonly uploadedFile: BehaviorSubject<any> = new BehaviorSubject(
    null
  );

  @Output() getFiles: EventEmitter<File[]> = new EventEmitter();

  constructor() {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.fileUploadControl = new FileUploadControl(
      {
        listVisible: true,
        accept: [this.fileTypes],
        discardInvalid: true,
        multiple: false,
      },
      [
        FileUploadValidators.accept([this.fileTypes]),
        FileUploadValidators.filesLimit(this.fileLimit),
      ]
    );
    this.subscription = this.fileUploadControl.valueChanges.subscribe(
      (values: Array<File>) => {
        console.log(values);
        if (values && values.length > 0) {
          this.hasFiles = true;
          this.getFiles.emit(values);
        } else this.hasFiles = false;
      }
    );
  }
}
