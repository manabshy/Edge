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
import { FileTypeEnum } from "src/app/core/services/file.service";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements OnInit, OnDestroy {
  @Input() fileLimit = 50;

  private fileTypes: string = "file_extension|";

  private _fileType: FileTypeEnum;
  set fileType(value: FileTypeEnum) {
    if (value) {
      this._fileType = value;
      switch (value) {
        case FileTypeEnum.OnlyDocument:
          this.fileTypes = this.fileTypes.concat(".pdf|.doc|.docx");
          break;
        case FileTypeEnum.OnlyImage:
          this.fileTypes = this.fileTypes.concat("image/*|media_type");
        case FileTypeEnum.ImageAndDocument:
          this.fileTypes = this.fileTypes.concat(".pdf|.doc|.docx|.png|.jpeg");
        case FileTypeEnum.All:
          this.fileTypes = "file_extension|.pdf|.doc|.docx|image/*|media_type";
        default:
          this.fileTypes = "file_extension|.pdf|.doc|.docx|image/*|media_type";
      }
    }
  }

  @Input() get fileType() {
    return this._fileType;
  }

  private _uploadedFiles;
  set uploadedFiles(value) {
    if (value && this._uploadedFiles != value) {
      this._uploadedFiles = value;
      if (value.length > 0) this.fileUploadControl.setValue(value);
      else {
        console.log(this.fileUploadControl.value);
        this.fileUploadControl.clear();
      }
    }
  }

  @Input() get uploadedFiles() {
    return this._uploadedFiles;
  }

  fileUploadControl: FileUploadControl = new FileUploadControl({
    accept: [this.fileTypes],
  });

  hasValidFiles = false;
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
    this.fileUploadControl.setValidators([
      FileUploadValidators.accept([this.fileTypes]),
      FileUploadValidators.filesLimit(this.fileLimit),
    ]);
    console.log(this.fileLimit);
    this.subscription = this.fileUploadControl.valueChanges.subscribe(
      (values: Array<File>) => {
        console.log(values);
        if (values && values.length > 0) {
          this.hasValidFiles = true;
        } else this.hasValidFiles = false;
        this.getFiles.emit(this.fileUploadControl.value);
      }
    );
  }
}
