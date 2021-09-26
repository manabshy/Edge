import { FileUploadComponent } from "./../file-upload/file-upload.component";
import {
  FileService,
  FileTypeEnum,
} from "./../../../core/services/file.service";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import moment from "moment";
import { MessageService, PrimeNGConfig } from "primeng/api";

@Component({
  selector: "app-file-list",
  templateUrl: "./file-list.component.html",
})
export class FileListComponent implements OnInit, OnDestroy {
  @Input() header;
  @Input() fileLimit = 50;
  @Input() fileType: FileTypeEnum;
  @Input() files: any[];
  // @Output() deleteFile: EventEmitter<any> = new EventEmitter();
  @Output() getFileNames: EventEmitter<any[]> = new EventEmitter();
  openFileDialog = false;
  tmpFiles: File[];
  fileNames: string[];

  @ViewChild(FileUploadComponent) fileUploadComponent: FileUploadComponent;

  constructor(
    private fileService: FileService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  setSelectedFile() {
    if (this.tmpFiles && this.tmpFiles.length > 0) {
      const formData = new FormData();
      this.tmpFiles.forEach((x) => {
        formData.append("files", x, x.name);
      });

      this.fileService.saveFileTemp(formData).subscribe(
        (data) => {
          if (data && data.files) {
            this.getFileNames.emit(data.files);
            this.files = [...this.tmpFiles];
            this.fileUploadClear();
            this.openFileDialog = false;
          } else {
            this.tmpFiles = [];
            this.showWarningMessage("Adding file gets error, please try again");
            return;
          }
        },
        (err) => {
          this.tmpFiles = [];
          this.showWarningMessage(err.message);
          return;
        }
      );
    } else {
      this.files = [...this.tmpFiles];
      this.showWarningMessage("You must add valid documents");
      return;
    }
  }

  fileUploadClear() {
    this.fileUploadComponent.clear();
  }

  showWarningMessage(message) {
    this.messageService.add({
      severity: "warn",
      summary: message,
      closable: false,
    });
  }

  cancel() {
    this.fileUploadClear();
    this.openFileDialog = false;
  }

  ngOnDestroy(): void {}

  deleteFile(fileName: string) {
    if (this.files && this.files.length > 0) {
      this.files = this.files.filter((x) => x.name != fileName);
      // let file = this.files.find((c) => c.name == fileName);
      // if (file) this.fileUploadComponent.removeFile(file);
    }
  }

  getFiles(files) {
    this.tmpFiles = files;
  }

  getUploadedDate(date: Date): string {
    if (date) return moment(date).format("Do MMM YYYY (HH:mm)");
    return "-";
  }
}
