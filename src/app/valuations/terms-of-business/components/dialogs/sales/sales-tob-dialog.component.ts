import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'

@Component({
  selector: 'app-sales-tob-dialog',
  template: `
    <p-dialog
      header="Upload Terms of Business (Sale)"
      appendTo="body"
      [(visible)]="showDialog"
      [modal]="true"
      [draggable]="false"
    >
      <div class="flex flex-col" style="width: 500px">
        <app-file-upload
          [uploadedFiles]="tmpFiles"
          (getFiles)="getFiles($event)"
          [isMultiple]="isMultiple"
        ></app-file-upload>

        <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="fileUploaded">
          <formly-form [model]="model" [fields]="fields" [options]="options" [form]="form"></formly-form>
        </form>

        <footer class="mt-10">
          <div class="flex flex-row space-x-4">
            <span class="flex-1"></span>
            <button type="button" class="btn btn--ghost" (click)="showDialog = false">Cancel</button>
            <button
              type="button"
              class="btn btn--positive"
              (click)="submit()"
              [disabled]="!fileUploaded && !form.valid"
              data-cy="uploadFiles"
            >
              Submit
            </button>
          </div>
        </footer>
      </div>
    </p-dialog>
  `
})
export class SalesToBDialogComponent implements OnInit {
  @Output() onSubmitTermsOfBusiness: EventEmitter<any> = new EventEmitter()
  @Input() showDialog: boolean = false
  @Input() termsOfBusinessModel: any

  form = new FormGroup({})
  model: any = {}
  options: FormlyFormOptions = {}
  fields: FormlyFieldConfig[] = this.salesTermsOfBusinessFormFields()

  isMultiple: boolean = false
  tmpFiles: File[]
  fileUploaded: boolean = false

  ngOnInit() {
    // console.log('termsOfBusinessModel SalesToBDialogComponent: ', this.termsOfBusinessModel)
    this.model = this.termsOfBusinessModel
  }

  public getFiles(files): void {
    this.tmpFiles = files
    this.fileUploaded = !!files ? true : false
  }

  public submit() {
    if (!this.form.valid) return
    const payload = {
      model: this.model,
      file: this.tmpFiles
    }
    // console.log('submit: ', payload)
    this.onSubmitTermsOfBusiness.emit(payload)
    this.showDialog = false
  }

  private salesTermsOfBusinessFormFields(): FormlyFieldConfig[] {
    return [
      {
        fieldGroupClassName: 'flex flex-col',
        fieldGroup: [
          {
            className: 'w-full mt-2',
            key: 'instructionPriceDirection',
            type: 'input',
            templateOptions: {
              label: 'Instruction price direction',
              description: 'In order to proceed, please accept terms',
              required: true
            }
          },
          {
            className: 'w-full mt-2',
            key: 'salesAgencyTypeId',
            type: 'select',
            templateOptions: {
              label: 'Sole or Multi',
              description: 'In order to proceed, please accept terms',
              required: true,
              options: [
                { value: 1, label: 'Sole' },
                { value: 2, label: 'Multi' }
              ]
            }
          }
        ]
      }
    ]
  }
}
