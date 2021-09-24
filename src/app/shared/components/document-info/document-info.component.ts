import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FileService,
  FileTypeEnum,
} from "./../../../core/services/file.service";
@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html'
})
export class DocumentInfoComponent implements OnInit {

  @Input() files: Array<any>
  @Input() label: string
  @Input() documentType: string
  @Input() fileType: FileTypeEnum;
  @Input() fileLimit = 50;
  @Output() deleteFile: EventEmitter<any> = new EventEmitter()

  idHasExpired: boolean = true
  showFileUploadDialog: boolean = false
  tmpFiles: File[];

  constructor() { }

  ngOnInit(): void {
    this.checkIdIsValid()
  }

  openUploadDialog(){
    this.showFileUploadDialog = true
  }
  
  setSelectedFile() {
    console.log('setSelectedFile()')
  }
  
  private checkIdIsValid (){
    if(this.documentType == 'ID' && this.files.length){
      const docExpiryDate = new Date(this.files[0].expiryDate)
      this.idHasExpired = docExpiryDate > new Date()
    }
  }
}
