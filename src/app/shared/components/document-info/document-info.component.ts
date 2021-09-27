import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FileTypeEnum,
} from "./../../../core/services/file.service";
import moment from 'moment';

export enum DocumentType {
  id = 'id',
  proofOfAddress = 'proof-of-address',
  report = 'report',
  additionalDocuments = 'additional-documents'
}

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html'
})
export class DocumentInfoComponent implements OnInit {

  @Input() files: Array<any>
  @Input() label: string
  @Input() documentType: DocumentType
  @Input() fileType: FileTypeEnum;
  @Input() fileLimit = 50;
  @Output() deleteFile: EventEmitter<any> = new EventEmitter()
  @Output() onFileUploaded: EventEmitter<any> = new EventEmitter();

  idHasExpired: boolean = true
  showFileUploadDialog: boolean = false
  tmpFiles: File[];
  uploadDialogHeaderText: string;
  moment = moment
  
  constructor(
  ) { }
  
  ngOnInit(): void {
    this.checkIdIsValid()
  }
 
  showFilesUploadButton(){
    return !this.files.length && this.documentType == DocumentType.id || 
    this.documentType == DocumentType.report ||
    !this.files.length && this.documentType == DocumentType.proofOfAddress ||
    this.documentType == DocumentType.additionalDocuments
  }

  openUploadDialog(){
    this.showFileUploadDialog = true
    let label
    switch(this.documentType) {
      case DocumentType.id:
        label = 'Upload ID Document'
        break;

      case DocumentType.proofOfAddress:
        label = 'Upload Proof of Address'
        break;

      case DocumentType.additionalDocuments:
        label = 'Upload Additional Documents'
        break;

      case DocumentType.report:
        label = 'Upload Report'
        break;

    }
    this.uploadDialogHeaderText = label
  }
  
  private checkIdIsValid (){
    if(this.documentType == DocumentType.id && this.files.length){
      const docExpiryDate = new Date(this.files[0].expiryDate)
      this.idHasExpired = docExpiryDate > new Date()
    }
  }

  getFiles(files) {
    this.tmpFiles = files
  }
  
  setSelectedFile() {
    this.onFileUploaded.emit({files: this.tmpFiles, type: this.documentType })
  }

}
