import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'

@Component({
  selector: 'app-lettings-tob-dialog',
  template: `
    <p-dialog
      header="Upload Terms of Business (Lettings)"
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
export class LettingsToBDialogComponent implements OnInit {
  @Output() onSubmitTermsOfBusiness: EventEmitter<any> = new EventEmitter()
  @Input() showDialog: boolean = false
  @Input() data: any

  form = new FormGroup({})
  model: any = {}
  options: FormlyFormOptions = {}
  fields: FormlyFieldConfig[] = this.lettingsTermsOfBusinessFormFields()
 
  isMultiple: boolean = false
  tmpFiles: File[]
  fileUploaded: boolean = false

  ngOnInit() {
    console.log('data LettingsToBDialogComponent: ', this.data)
    this.model = this.data
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

  private lettingsTermsOfBusinessFormFields(): FormlyFieldConfig[] {
    return [
      {
        fieldGroupClassName: 'flex flex-col pl-4 mt-4',
        fieldGroup: [
          {
            className: 'w-full',
            key: 'isShortLetInstruction',
            type: 'checkbox',
            templateOptions: {
              label: 'Is short let instruction',
              description: 'In order to proceed, please accept terms',
              required: true
            }
          },
          {
            className: 'w-full mt-2',
            key: 'isLongLetInstruction',
            type: 'checkbox',
            templateOptions: {
              label: 'Is long let instruction',
              description: 'In order to proceed, please accept terms',
              required: true
            }
          },
          {
            className: 'w-full mt-2',
            key: 'isManagement',
            type: 'checkbox',
            templateOptions: {
              label: 'Is management',
              description: 'In order to proceed, please accept terms',
              required: true
            }
          },
          {
            className: 'w-full mt-2',
            key: 'zeroDepositAccepted',
            type: 'checkbox',
            templateOptions: {
              label: 'Zero deposit accepted',
              description: 'In order to proceed, please accept terms',
              required: true
            }
          }
        ]
      }
    ]
  }
}
