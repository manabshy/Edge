import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, OnChanges } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { FileTypeEnum } from 'src/app/core/services/file.service'
import { SharedService } from 'src/app/core/services/shared.service'

@Component({
  selector: 'app-sales-tob-dialog',
  template: `
    <p-dialog
      header="Upload Terms of Business"
      appendTo="body"
      [(visible)]="showDialog"
      [modal]="true"
      [draggable]="false"
      (onHide)="close()"
    >
      <div class="flex flex-col" style="width: 500px">
        <app-file-upload
          [uploadedFiles]="tmpFiles"
          (getFiles)="getFiles($event)"
          [isMultiple]="'false'"
          [fileType]="fileType"
        ></app-file-upload>
        
      <form [formGroup]="form" class="my-4 px-2">
        <fieldset class="mb-2" [ngClass]="{ 'invalid': instructionPriceDirection.invalid && (instructionPriceDirection.dirty || instructionPriceDirection.touched) }">
          <label>
            Instruction price direction
          </label>
          <input type="tel" class="p-2" [ngClass]="{ 'is-invalid': instructionPriceDirection.invalid && (instructionPriceDirection.dirty || instructionPriceDirection.touched) }" formControlName="instructionPriceDirection" required />
          <p *ngIf="instructionPriceDirection.errors" class="message message--negative">Required field</p>
        </fieldset>
        <fieldset class="mb-3">
          <label>Sole or Multi</label>
          <p-dropdown
            [options]="salesAgencyTypeOptions"
            formControlName="salesAgencyTypeId"
            optionLabel="value"
            optionValue="id"
            [filter]="false"
            placeholder="Select one"
            data-cy="salesAgencyTypeId"
            class="py-2"
          ></p-dropdown>
        </fieldset>
      </form>

        <footer class="mt-10">
          <div class="flex flex-row space-x-4">
            <span class="flex-1"></span>
            <button type="button" class="btn btn--ghost" (click)="close()">Cancel</button>
            <button
              type="button"
              class="btn btn--positive"
              (click)="submit()"
              [disabled]="!fileUploaded || !form.valid"
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
  @Input() data: any = {}
  @Input() suggestedAskingPrice: number = 0

  get instructionPriceDirection() {
    return this.form.get('instructionPriceDirection')
  }

  form: FormGroup
  model: any = {}
  fileType = FileTypeEnum.ImageAndDocument
  tmpFiles: File[]
  fileUploaded: boolean = false
  formSub: Subscription
  salesAgencyTypeOptions = [
    {
      value: 'Select one',
      id: null
    },
    {
      value: 'Sole',
      id: 1
    },
    {
      value: 'Multi',
      id: 4
    }
  ]

  constructor(private fb: FormBuilder, private sharedService: SharedService) {}

  ngOnInit() {
    this.model = {
      instructionPriceDirection: null,
      salesAgencyTypeId: null,
      ...this.data
    }

    this.form = this.fb.group({
      instructionPriceDirection: [
        this.suggestedAskingPrice ? this.sharedService.transformCurrency(this.suggestedAskingPrice) : 0,
        Validators.required
      ],
      salesAgencyTypeId: [this.model.salesAgencyTypeId, Validators.required]
    })

    this.formSub = this.form.valueChanges.subscribe((data) => {
      this.model = { ...this.model, ...data }
      // console.log('data.instructionPriceDirection: ', data.instructionPriceDirection)
      this.form.patchValue(
        {
          instructionPriceDirection: this.sharedService.transformCurrency(data.instructionPriceDirection)
        },
        { emitEvent: false }
      )
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
    const currencyToString = this.model.instructionPriceDirection.replace(/\D/g, '')
    const payload = {
      model: { ...this.model, instructionPriceDirection:  +currencyToString},
      file: this.tmpFiles
    }
    if (!this.form.valid || !this.tmpFiles.length) return
    this.onSubmitTermsOfBusiness.emit(payload)
    this.showDialog = false
  }

  public close() {
    this.onSubmitTermsOfBusiness.emit(false)
    this.showDialog = false
  }
}
