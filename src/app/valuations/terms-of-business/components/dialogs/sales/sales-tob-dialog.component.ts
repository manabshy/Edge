import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'
import { Subscription } from 'rxjs'

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

        <!--
        <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="fileUploaded">
          <formly-form [model]="model" [fields]="fields" [options]="options" [form]="form"></formly-form>
        </form>
        -->
        
        
      <form [formGroup]="form" class="my-4">
        <fieldset class="mb-2">
          <label>
            Instruction price direction
          </label>
          <input type="tel" class="p-2" formControlName="instructionPriceDirection" required />
        </fieldset>
        <fieldset class="mb-3">
          <label>Sole or Multi</label>
          <p-dropdown
            [options]="salesAgencyTypeOptions"
            formControlName="salesAgencyTypeId"
            optionLabel="value"
            optionValue="id"
            [filter]="false"
            data-cy="salesAgencyTypeId"
          ></p-dropdown>
        </fieldset>
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
export class SalesToBDialogComponent implements OnInit, OnDestroy {
  @Output() onSubmitTermsOfBusiness: EventEmitter<any> = new EventEmitter()
  @Input() showDialog: boolean = false
  @Input() data: any

  form: FormGroup
  model: any = {}
  isMultiple: boolean = false
  tmpFiles: File[]
  fileUploaded: boolean = true
  formSub: Subscription
  salesAgencyTypeOptions = [
    {
      value: 'Sole',
      id: 1
    },
    {
      value: 'Multi',
      id: 4
    }
  ]

  // options: FormlyFormOptions = {}
  // fields: FormlyFieldConfig[] = this.salesTermsOfBusinessFormFields()

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    console.log('data SalesToBDialogComponent: ', this.data)
    this.model = {
      instructionPriceDirection: null,
      salesAgencyTypeId: null,
      ...this.data
    }

    this.form = this.fb.group({
      instructionPriceDirection: [this.model.instructionPriceDirection, Validators.required],
      salesAgencyTypeId: [this.model.salesAgencyTypeId, Validators.required]
    })

    this.formSub = this.form.valueChanges.subscribe((data) => {
      this.model = { ...this.model, ...data }
    })
  }

  ngOnDestroy() {
    this.formSub.unsubscribe()
  }

  public getFiles(files): void {
    this.tmpFiles = files
    this.fileUploaded = !!files ? true : false
  }

  public submit() {
    // console.log('submit: ', this)
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
              required: true
            }
          },
          {
            className: 'w-full mt-2',
            key: 'salesAgencyTypeId',
            type: 'select',
            templateOptions: {
              label: 'Sole or Multi',
              required: true,
              options: [
                { value: 1, label: 'Sole' },
                { value: 4, label: 'Multi' }
              ]
            }
          }
        ]
      }
    ]
  }
}
