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
} from "@angular/core";
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
  @Output() deleteFile: EventEmitter<any> = new EventEmitter();
  @Output() getFileNames: EventEmitter<any[]> = new EventEmitter();
  openFileDialog = false;
  tmpFiles: File[];
  fileNames: string[];

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
          if (data && data.result) {
            this.getFileNames.emit(data.result.files);
            this.openFileDialog = false;
            this.files = [...this.tmpFiles];
          } else {
            this.showWarningMessage("Adding file gets error, please try again");
            return;
          }
        },
        (err) => {
          this.showWarningMessage(err.message);
          return;
        }
      );
    } else {
      this.showWarningMessage("You must add valid documents");
      return;
    }
  }

  showWarningMessage(message) {
    this.messageService.add({
      severity: "warn",
      summary: message,
      closable: false,
    });
  }

  ngOnDestroy(): void {}
}
