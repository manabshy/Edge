import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload'
import { MessageService, PrimeNGConfig } from 'primeng/api'
import { BehaviorSubject, Subscription } from 'rxjs'
import { FileTypeEnum } from 'src/app/core/services/file.service'

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy, AfterViewInit {
  private _isMultiple
  set isMultiple(value) {
    if (value && this._isMultiple != value) {
      this._isMultiple = value
    }
  }

  @Input() get isMultiple() {
    return this._isMultiple
  }

  private _fileType: FileTypeEnum
  set fileType(value: FileTypeEnum) {
    if (value) {
      this._fileType = value
    }
  }

  @Input() get fileType() {
    return this._fileType
  }

  private _uploadedFiles
  set uploadedFiles(value) {
    if (value && this._uploadedFiles != value) {
      this._uploadedFiles = value
    }
  }

  @Input() get uploadedFiles() {
    return this._uploadedFiles
  }

  hasValidFiles = false

  fileUploadControl: FileUploadControl = new FileUploadControl({ multiple: false }, FileUploadValidators.filesLimit(1))

  private subscription: Subscription
  public readonly uploadedFile: BehaviorSubject<any> = new BehaviorSubject(null)

  @Output() getFiles: EventEmitter<File[]> = new EventEmitter()

  constructor(private messageService: MessageService, private primengConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primengConfig.ripple = true
  }

  ngAfterViewInit(): void {
    this.subscription = this.fileUploadControl.valueChanges.subscribe((values: Array<File>) => {
      // console.log(values);
      if (values && values.length > 0) {
        values.forEach((value) => {
          if (value.size * Math.pow(10, -6) >= 100) {
            this.messageService.add({
              severity: 'error',
              summary: 'File size cannot be bigger than 100 MB!',
              closable: false
            })
            this.fileUploadControl.setValue([])
            return
          }
          if (this.fileType) {
            let message = ''
            switch (this.fileType) {
              case FileTypeEnum.OnlyDocument:
                if (
                  value.type &&
                  !(value.type.indexOf('doc') > -1 || value.type.indexOf('docx') > -1 || value.type.indexOf('pdf') > -1)
                ) {
                  message = 'File type must be a document!'
                }
                break
              case FileTypeEnum.OnlyImage:
                if (value.type && !(value.type.indexOf('png') > -1 || value.type.indexOf('jpeg') > -1)) {
                  message = 'File type must be either png or jpeg!'
                }
                break
              case FileTypeEnum.ImageAndDocument:
                if (
                  value.type &&
                  !(
                    value.type.indexOf('png') > -1 ||
                    value.type.indexOf('jpeg') > -1 ||
                    value.type.indexOf('doc') > -1 ||
                    value.type.indexOf('docx') > -1 ||
                    value.type.indexOf('pdf') > -1
                  )
                ) {
                  message = 'File type must be either image or document'
                }
                break
            }

            if (message.length > 0) {
              this.messageService.add({
                severity: 'error',
                summary: message,
                closable: false
              })
              this.fileUploadControl.setValue([])
              return
            }
          }
        })
        this.hasValidFiles = true
        this.getFiles.emit([...this.fileUploadControl.value])
      } else this.hasValidFiles = false
    })
  }
  removeFile(file) {
    this.fileUploadControl.removeFile(file)
  }

  clear() {
    this.fileUploadControl.value.forEach((x) => this.fileUploadControl.removeFile(x))
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}
