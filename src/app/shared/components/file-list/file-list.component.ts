import { FileService } from "./../../../core/services/file.service";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";

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

  constructor(private fileService: FileService) {}

  ngOnInit(): void {}

  setSelectedFile() {
    this.openFileDialog = false;
    this.files = [];
    this.tmpFiles = [...this.files];

    this.fileService.saveFileTemp(this.tmpFiles).subscribe((data) => {
      console.log(data);
    });
  }

  ngOnDestroy(): void {}
}
