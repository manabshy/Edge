import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileTypeEnum } from '../../../../core/services/file.service';
import moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { DOCUMENT_TYPE } from '../../compliance-checks.interfaces';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface EmitDocument {
  tmpFiles: Array<any>;
  documentType?: DOCUMENT_TYPE;
  idValidationDateExpiry?: Date;
}

@Component({
  selector: 'app-document-info',
  templateUrl: './document-info.component.html',
})
export class DocumentInfoComponent implements OnInit {
  @Input() files: Array<any>;
  @Input() personName: String;
  @Input() documentType: DOCUMENT_TYPE;
  @Input() fileType: FileTypeEnum;
  @Input() fileLimit = 50;
  @Input() isMultiple: boolean = true;
  @Input() isFrozen: boolean = false;
  @Input() label: String;
  @Output() deleteFile: EventEmitter<any> = new EventEmitter();
  @Output() onFileUploaded: EventEmitter<any> = new EventEmitter();

  DOCUMENT_TYPE = DOCUMENT_TYPE;
  idHasExpired: boolean = false;
  showFileUploadDialog: boolean = false;
  saveFileBtnDisabled: boolean = true;
  tmpFiles: File[];
  uploadDialogHeaderText: string;
  moment = moment;
  idExpiryForm = new FormGroup({
    idExpiryDate: new FormControl(),
  });
  showExpiryDatePicker = false;
  expiryDateMessage = {
    type: 'info',
    text: ['Please enter the ID expiry date below'],
  };
  // constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.checkIdIsValid();
  }

  // openDialog(): void {
  //   let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
  //     width: '250px',
  //     data: {}
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed', result);
  //   });
  // }

  showFilesUploadButton() {
    return (
      (!this.files.length && this.documentType == DOCUMENT_TYPE.ID) ||
      (!this.files.length && this.documentType == DOCUMENT_TYPE.REPORT) ||
      (!this.files.length && this.documentType == DOCUMENT_TYPE.PROOF_OF_ADDRESS) ||
      this.documentType == DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS
    );
  }

  openUploadDialog() {
    this.showFileUploadDialog = true;
    let label;
    switch (this.documentType) {
      case DOCUMENT_TYPE.ID:
        label = 'Upload ID Document for ' + this.personName;
        break;

      case DOCUMENT_TYPE.PROOF_OF_ADDRESS:
        label = 'Upload Proof of Address';
        break;

      case DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS:
        label = 'Upload Additional Documents';
        break;

      case DOCUMENT_TYPE.REPORT:
        label = 'Upload Report';
        break;
    }
    this.uploadDialogHeaderText = label;
    return;
  }

  private checkIdIsValid() {
    if (this.documentType == DOCUMENT_TYPE.ID && this.files.length) {
      const docExpiryDate = this.files[0].idValidationDateExpiry;
      this.idHasExpired = new Date(docExpiryDate) <= new Date();
    }
  }

  getFiles(files) {
    this.tmpFiles = files;
    this.validate();
  }

  validate() {
    if (this.documentType === DOCUMENT_TYPE.ID) {
      this.showExpiryDatePicker = !!this.tmpFiles.length;
    } else {
      this.saveFileBtnDisabled = false;
    }
  }

  setSelectedFile() {
    if (!this.tmpFiles.length) return;
    const emitData: EmitDocument = { tmpFiles: this.tmpFiles, documentType: this.documentType };
    if (this.documentType == DOCUMENT_TYPE.ID && !this.idHasExpired)
      emitData.idValidationDateExpiry = this.idExpiryForm.get('idExpiryDate').value;
    this.onFileUploaded.emit(emitData);
    this.saveFileBtnDisabled = true;
    this.showFileUploadDialog = false;
  }

  onDateChange(expiryDate) {
    if (expiryDate) {
      this.idHasExpired = new Date(expiryDate) <= new Date();
      this.saveFileBtnDisabled = this.idHasExpired;
      if (!this.idHasExpired && this.files.length === 1) this.files[0].idValidationDateExpiry = new Date(expiryDate);
    }
  }
}

// @Component({
//   selector: 'dialog-overview-example-dialog',
//   template: `
//   <h2 mat-dialog-title>Delete all</h2>
//   <mat-dialog-content>Are you sure?</mat-dialog-content>
//   <mat-dialog-actions>
//     <button mat-button mat-dialog-close>No</button>
//     <!-- The mat-dialog-close directive optionally accepts a value as a result for the dialog. -->
//     <button mat-button [mat-dialog-close]="true">Yes</button>
//   </mat-dialog-actions>
//   `,
// })
// export class DialogOverviewExampleDialog {

//   constructor(
//     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
//     @Inject(MAT_DIALOG_DATA) public data: any) { }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }

// }
