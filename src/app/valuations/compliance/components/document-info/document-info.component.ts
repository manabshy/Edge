import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { FileTypeEnum } from '../../../../core/services/file.service'
import moment from 'moment'
import { FormBuilder, Validators } from '@angular/forms'
import { DOCUMENT_TYPE } from '../../compliance-checks.interfaces'

export interface EmitDocument {
  tmpFiles: Array<any>
  documentType?: DOCUMENT_TYPE
  idValidationDateExpiry?: Date
  smartSearchId?: number
}

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html'
})
export class DocumentInfoComponent implements OnInit {
  @Input() files: any[]
  @Input() name: string
  @Input() documentType: DOCUMENT_TYPE
  @Input() fileType: FileTypeEnum
  @Input() fileLimit = 50
  @Input() isMultiple: boolean = true
  @Input() isFrozen: boolean = false
  @Input() label: string

  @Output() deleteFile: EventEmitter<any> = new EventEmitter()
  @Output() onFileUploaded: EventEmitter<any> = new EventEmitter()
  @Output() afterFileOperation: EventEmitter<any> = new EventEmitter()

  constructor(private fb: FormBuilder) {}

  DOCUMENT_TYPE = DOCUMENT_TYPE
  idHasExpired: boolean = false
  showFileUploadDialog: boolean = false
  saveFileBtnDisabled: boolean = true
  tmpFiles: File[] = []
  uploadDialogHeaderText: string
  moment = moment
  idExpiryForm = this.fb.group({
    idExpiryDate: ['']
  })
  smartSearchIdForm = this.fb.group({
    smartSearchId: ['', [Validators.pattern('^[0-9]*$')]]
  })
  showExpiryDatePicker = false
  showAdditionalInput = false
  message = {
    type: 'info',
    text: ['Select a file to upload']
  }
  additionalLabel: string
  showFilesUploadButton: boolean

  ngOnInit(): void {
    this.checkIdIsValid()
    this.showFilesUploadButton = this.showFilesUploadButtonDecider()
    this.buildMessage()
    this.setFormValidation()
  }

  showFilesUploadButtonDecider(): boolean {
    return (
      (!this.files.length && this.documentType == DOCUMENT_TYPE.ID) ||
      (!this.files.length && this.documentType == DOCUMENT_TYPE.REPORT) ||
      (!this.files.length && this.documentType == DOCUMENT_TYPE.PROOF_OF_ADDRESS) ||
      (this.documentType == DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS && !this.isFrozen)
    )
  }

  openUploadDialog(): void {
    let label
    switch (this.documentType) {
      case DOCUMENT_TYPE.ID:
        label = 'Upload ID Document for ' + this.name
        break

      case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
        label = 'Upload Proof of Address for ' + this.name
        break

      case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
        label = 'Upload Additional Documents for ' + this.name
        break

      case DOCUMENT_TYPE.REPORT:
        label = 'Upload Report for ' + this.name
        break
    }
    this.uploadDialogHeaderText = label
    this.showFileUploadDialog = true
  }

  private checkIdIsValid(): void {
    if (this.documentType == DOCUMENT_TYPE.ID && this.files.length) {
      const docExpiryDate = this.files[0].idValidationDateExpiry
      this.idHasExpired = new Date(docExpiryDate) <= new Date()
    }
  }

  getFiles(files): void {
    this.tmpFiles = files
    this.validate()
  }

  buildMessage() {
    if (this.documentType === DOCUMENT_TYPE.ID) {
      this.showExpiryDatePicker = true
      this.message.text = ['Select a file to upload and enter ID expiry date below']
    } else if (this.documentType === DOCUMENT_TYPE.REPORT) {
      this.message.text = ['Select a file to upload and enter SmartSearch report ID below']
      this.showAdditionalInput = true
    } else {
      this.saveFileBtnDisabled = false
    }
  }

  setFormValidation() {
    if (this.documentType === DOCUMENT_TYPE.ID) {
      this.idExpiryForm.controls['idExpiryDate'].setValidators([Validators.required])
    } else if (this.documentType === DOCUMENT_TYPE.REPORT) {
      this.message.text = ['Select a file to upload and enter SmartSearch report ID below']
      this.showAdditionalInput = true
      this.smartSearchIdForm.controls['smartSearchId'].setValidators([Validators.required])
    } else {
      this.saveFileBtnDisabled = false
    }
  }

  validate(): void {
    if (this.documentType === DOCUMENT_TYPE.ID) {
      this.message.text = this.tmpFiles.length ? ['Enter expiry date below'] : this.message.text
      const formValid = this.idExpiryForm.controls['idExpiryDate'].valid
      this.message.type = formValid ? 'success' : 'info'
      this.message.text = formValid ? ['Valid for upload'] : ['Please enter the expiry date']
    } else if (this.documentType === DOCUMENT_TYPE.REPORT) {
      this.message.text = this.tmpFiles.length ? ['Enter SmartSearch ID below'] : this.message.text
      const formValid = this.smartSearchIdForm.controls['smartSearchId'].valid
      this.message.type = formValid && this.tmpFiles.length ? 'success' : 'info'
      this.message.text =
        formValid && this.tmpFiles.length ? ['Valid for upload'] : ['Please enter SmartSearch report ID below']
    } else {
      this.message.type = this.tmpFiles.length ? 'success' : 'info'
      this.message.text = this.tmpFiles.length ? ['Ready to upload'] : ['Please attach a file']
      this.saveFileBtnDisabled = false
    }
  }

  setSelectedFile(): void {
    if (!this.tmpFiles.length) return
    const emitData: EmitDocument = { tmpFiles: this.tmpFiles, documentType: this.documentType }
    if (this.documentType == DOCUMENT_TYPE.ID && !this.idHasExpired) {
      emitData.idValidationDateExpiry = this.idExpiryForm.get('idExpiryDate').value
    } else if (this.documentType === DOCUMENT_TYPE.REPORT) {
      const smartSearchId = this.smartSearchIdForm.get('smartSearchId').value
      emitData.smartSearchId = smartSearchId.trim()
      console.log('emitData.smartSearchId: ', emitData.smartSearchId)
    }
    this.onFileUploaded.emit(emitData)

    this.closeDialog()
    this.saveFileBtnDisabled = true
  }

  closeDialog() {
    this.showFileUploadDialog = false
  }

  onDateChange(expiryDate): void {
    if (expiryDate) {
      this.idHasExpired = new Date(expiryDate) <= new Date()
      this.saveFileBtnDisabled = this.idHasExpired
      if (!this.idHasExpired && this.files.length === 1) this.files[0].idValidationDateExpiry = new Date(expiryDate)
      if (this.idHasExpired) {
        this.message.type = 'error'
        this.message.text = ['The ID has expired']
      } else {
        this.message.type = this.tmpFiles.length ? 'success' : 'warn'
        this.message.text = this.tmpFiles.length ? ['Ready to upload'] : ['Please upload an ID']
      }
    }
  }

  onSmartSearchIdChange(id: string): void {
    this.saveFileBtnDisabled = !id
    this.validate()
  }
}
