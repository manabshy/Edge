import { FileUploadComponent } from './../file-upload/file-upload.component'
import { FileService, FileTypeEnum } from './../../../core/services/file.service'
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import moment from 'moment'
import { MessageService, PrimeNGConfig } from 'primeng/api'
import { EdgeFile } from '../../models/edgeFile'

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit, OnDestroy {
  @Input() header
  @Input() isMultiple
  @Input() type: string
  @Input() fileType: FileTypeEnum

  private _edgeFileList: EdgeFile[]
  set edgeFileList(value) {
    if (value && this._edgeFileList != value) {
      this.files = []
      value.forEach((x) => {
        this.files.push({
          fileLongName: x.fileName,
          name: x.fileName,
          url: x.url,
          lastModified: x.updateDate ? new Date(x.updateDate) : null
        })
      })
      this._edgeFileList = value
    }
  }

  @Input() get edgeFileList(): EdgeFile[] {
    return this._edgeFileList
  }

  files: any[] = []
  //@Output() deleteFileFromL: EventEmitter<any> = new EventEmitter();
  @Output() getFileNames: EventEmitter<{
    file: any[]
    type: string
  }> = new EventEmitter()
  openFileDialog = false
  tmpFiles: File[]
  fileNames: string[]

  @Output() afterFileOperation: EventEmitter<Boolean> = new EventEmitter()

  @ViewChild(FileUploadComponent) fileUploadComponent: FileUploadComponent

  constructor(
    private fileService: FileService,
    private primengConfig: PrimeNGConfig,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true
  }

  setSelectedFile() {
    if (this.tmpFiles && this.tmpFiles.length > 0) {
      if (this.fileType === FileTypeEnum.OnlyImage && this.tmpFiles.some((x) => x.type.indexOf('Image') == -1)) {
        this.showWarningMessage('This file operation accepts only image files(.png,.jpeg). Please try again!')
        return
      }
      if (
        this.fileType === FileTypeEnum.OnlyDocument &&
        this.tmpFiles.some((x) => x.type.indexOf('document') == -1 && x.type.indexOf('pdf') == -1)
      ) {
        this.showWarningMessage('This file operation accepts only document files(.pdf). Please try again!')
        return
      }
      if (
        this.fileType === FileTypeEnum.ImageAndDocument &&
        this.tmpFiles.some(
          (x) => x.type.indexOf('document') == -1 && x.type.indexOf('pdf') == -1 && x.type.indexOf('image') == -1
        )
      ) {
        this.showWarningMessage(
          'This file operation accepts only document and image files(.jpeg,.png,.pdf). Please try again!'
        )
        return
      }

      this.fileService.saveFileTemp(this.tmpFiles).subscribe(
        (data) => {
          if (data && data.files) {
            this.getFileNames.emit({ file: [...data.files], type: this.type })
            this.tmpFiles.forEach((file: any) => {
              file.fileLongName = file.name
            })
            this.files = [...this.tmpFiles]
            this.fileUploadClear()
            this.openFileDialog = false
          } else {
            this.tmpFiles = []
            this.showWarningMessage('Adding file gets error, please try again')
            return
          }
        },
        (err) => {
          this.tmpFiles = []
          this.showWarningMessage(err.message)
          return
        }
      )
    } else {
      this.files = [...this.tmpFiles]
      this.showWarningMessage('You must add valid documents')
      return
    }
  }

  fileUploadClear() {
    this.fileUploadComponent.clear()
  }

  showWarningMessage(message) {
    this.messageService.add({
      severity: 'error',
      summary: message,
      closable: false
    })
  }

  openFile(url) {
    window.open(url)
  }

  cancel() {
    this.fileUploadClear()
    this.openFileDialog = false
  }

  ngOnDestroy(): void {}

  deleteFile(fileName: string) {
    if (this.files && this.files.length > 0) {
      this.files = this.files.filter((x) => x.name != fileName)
      this.edgeFileList = this.edgeFileList.filter((x) => x.fileName != fileName)
      this.getFileNames.emit({ file: [...this.edgeFileList], type: this.type })
      // let file = this.files.find((c) => c.name == fileName);
      // if (file) this.fileUploadComponent.removeFile(file);
    }
  }

  getFiles(files) {
    this.tmpFiles = files
  }

  closeFileList() {
    this.afterFileOperation.emit(true)
  }

  getUploadedDate(date: Date): string {
    if (date) return moment(date).format('Do MMM YYYY (HH:mm)')
    return '-'
  }
}
