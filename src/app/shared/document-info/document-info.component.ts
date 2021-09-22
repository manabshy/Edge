import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html'
})
export class DocumentInfoComponent implements OnInit {

  @Input() files: Array<any>
  @Input() label: string
  @Input() documentType: string
  @Output() deleteFile: EventEmitter<any> = new EventEmitter()
  idHasExpired: boolean = true

  constructor() { }

  ngOnInit(): void {
    this.checkIdIsValid()
    console.log('label: ', this.label)
  }

  openUploadDialog(){
    alert('openUploadDialog()')
  }

  private checkIdIsValid (){
    if(this.documentType == 'ID' && this.files.length){
      const docExpiryDate = new Date(this.files[0].expiryDate)
      this.idHasExpired = docExpiryDate > new Date()
    }
  }
}
