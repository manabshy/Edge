import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { FileTypeEnum } from 'src/app/core/services/file.service'

@Component({
  selector: 'app-lettings-tob-dialog',
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

        <form [formGroup]="form" class="my-4 ml-4">
         
          <fieldset class="mb-2">
            <fieldset class="row">
              <label style="width: auto; margin-top: 10px">Will D&G be managing the property?</label>
            </fieldset>
            <span class="radio radio--inline">
              <span style="margin-right: 8px">
                <input class="p-2" type="radio" id="isManagementYes" [value]="true" formControlName="isManagement" />
                <label for="isManagementYes" class="mb-1">Yes</label>
              </span>
              <span style="margin-right: 8px">
                <input class="p-2" type="radio" id="isManagementNo" [value]="false" formControlName="isManagement" />
                <label for="isManagementNo" class="mb-1">No</label>
              </span>
            </span>
          </fieldset>
         
          <fieldset class="mb-2 animated fadeIn" *ngIf="model.isManagement === false">
            <fieldset class="row">
              <label style="width: auto; margin-top: 10px">Will the Landlord be managing the property?</label>
            </fieldset>
            <span class="radio radio--inline">
              <span style="margin-right: 8px">
                <input class="p-2" type="radio" id="isLandlordManagedYes" [value]="true" formControlName="isLandlordManaged" />
                <label for="isLandlordManagedYes" class="mb-1">Yes</label>
              </span>
              <span style="margin-right: 8px">
                <input class="p-2" type="radio" id="isLandlordManagedNo" [value]="false" formControlName="isLandlordManaged" />
                <label for="isLandlordManagedNo" class="mb-1">No</label>
              </span>
            </span>
          </fieldset>

          <fieldset class="mb-2">
            <fieldset class="row">
              <label style="width: auto; margin-top: 10px">Are zero deposits accepted?</label>
            </fieldset>
            <span class="radio radio--inline">
              <span style="margin-right: 8px">
                <input class="p-2" type="radio" id="zeroDepositAcceptedYes" [value]="true" formControlName="zeroDepositAccepted" />
                <label for="zeroDepositAcceptedYes" class="mb-1">Yes</label>
              </span>
              <span style="margin-right: 8px">
                <input class="p-2" type="radio" id="zeroDepositAcceptedNo" [value]="false" formControlName="zeroDepositAccepted" />
                <label for="zeroDepositAcceptedNo" class="mb-1">No</label>
              </span>
            </span>
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
export class LettingsToBDialogComponent implements OnInit, OnDestroy {
  @Output() onSubmitTermsOfBusiness: EventEmitter<any> = new EventEmitter()
  @Input() showDialog: boolean = false
  @Input() data: any = {}

  form: FormGroup
  model: any = {}
  fileType = FileTypeEnum.ImageAndDocument
  tmpFiles: File[]
  fileUploaded: boolean = true
  formSub: Subscription

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.model = {
      isManagement: null,
      isLandlordManaged: null,
      zeroDepositAccepted: null,
      managedByTypeId: null,
      ...this.data
    }

    this.form = this.fb.group({
      isManagement: [this.model.isManagement, Validators.required],
      isLandlordManaged: [this.model.isLandlordManaged],
      zeroDepositAccepted: [this.model.zeroDepositAccepted, Validators.required]
    })

    this.formSub = this.form.valueChanges.subscribe((data) => {
      this.model = { ...this.model, ...data }
      console.log('model : ', this.model)
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
    const payload = {
      model: this.model,
      file: this.tmpFiles
    }
    if (!this.form.valid || !this.tmpFiles.length) return
    payload.model.managedByTypeId = this.model.isManaged ? 1 : this.model.isLandlordManaged ? 2 : 0
    console.log('payload: ', payload)
    this.onSubmitTermsOfBusiness.emit(payload)
    this.showDialog = false
  }

  public close() {
    this.onSubmitTermsOfBusiness.emit(false)
    this.showDialog = false
  }
}
