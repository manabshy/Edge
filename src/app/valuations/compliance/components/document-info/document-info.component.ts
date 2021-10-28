import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core'
import { FileTypeEnum } from '../../../../core/services/file.service'
import moment from 'moment'
import { FormControl, FormGroup } from '@angular/forms'
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

  DOCUMENT_TYPE = DOCUMENT_TYPE
  idHasExpired: boolean = false
  showFileUploadDialog: boolean = false
  saveFileBtnDisabled: boolean = true
  tmpFiles: File[]
  uploadDialogHeaderText: string
  moment = moment
  idExpiryForm = new FormGroup({
    idExpiryDate: new FormControl()
  })
  smartSearchIdForm = new FormGroup({
    smartSearchId: new FormControl()
  })
  showExpiryDatePicker = false
  showAdditionalInput = false
  expiryDateMessage = {
    type: 'info',
    text: ['Please enter the ID expiry date below']
  }
  additionalInputMessage = {
    type: 'info',
    text: ['Please enter the ID for the SmartSearch below']
  }
  additionalLabel: string

  ngOnInit(): void {
    this.checkIdIsValid()
  }

  showFilesUploadButton(): boolean {
    return (
      (!this.files.length && this.documentType == DOCUMENT_TYPE.ID) ||
      (!this.files.length && this.documentType == DOCUMENT_TYPE.REPORT) ||
      (!this.files.length && this.documentType == DOCUMENT_TYPE.PROOF_OF_ADDRESS) ||
      this.documentType == DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS
    )
  }

  openUploadDialog(): void {
    this.showFileUploadDialog = true
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

  validate(): void {
    if (this.documentType === DOCUMENT_TYPE.ID) {
      this.showExpiryDatePicker = !!this.tmpFiles.length
    } else if (this.documentType === DOCUMENT_TYPE.REPORT) {
      this.showAdditionalInput = !!this.tmpFiles.length
    } else {
      this.saveFileBtnDisabled = false
    }
  }

  setSelectedFile(): void {
    if (!this.tmpFiles.length) return
    const emitData: EmitDocument = { tmpFiles: this.tmpFiles, documentType: this.documentType }
    if (this.documentType == DOCUMENT_TYPE.ID && !this.idHasExpired) {
      emitData.idValidationDateExpiry = this.idExpiryForm.get('idExpiryDate').value
    } else if (this.documentType === DOCUMENT_TYPE.REPORT) {
      emitData.smartSearchId = this.smartSearchIdForm.get('smartSearchId').value
    }
    console.log('emitData: ', emitData)
    this.onFileUploaded.emit(emitData)
    this.saveFileBtnDisabled = true
    this.showFileUploadDialog = false
  }

  onDateChange(expiryDate): void {
    if (expiryDate) {
      this.idHasExpired = new Date(expiryDate) <= new Date()
      this.saveFileBtnDisabled = this.idHasExpired
      if (!this.idHasExpired && this.files.length === 1) this.files[0].idValidationDateExpiry = new Date(expiryDate)
    }
  }

  onSmartSearchIdChange(id: string): void {
    this.saveFileBtnDisabled = !id
  }
}
