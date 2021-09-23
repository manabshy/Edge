import { FileService } from "./../../../core/services/file.service";
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
  @Input() files: any[];
  @Output() deleteFile: EventEmitter<any> = new EventEmitter();
  openFileDialog = false;
  tmpFiles: File[];

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
      this.openFileDialog = false;
      this.files = [];
      this.files = [...this.tmpFiles];

      const formData = new FormData();
      this.tmpFiles.forEach((x) => {
        formData.append("files", x, x.name);
      });

      this.fileService.saveFileTemp(formData).subscribe((data) => {
        console.log(data);
      });
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "You must add valid documents",
        closable: false,
      });
      return;
    }
  }

  ngOnDestroy(): void {}
}
