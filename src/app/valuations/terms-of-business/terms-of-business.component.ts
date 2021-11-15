import moment from 'moment'
import { Component, Input, OnInit, EventEmitter, Output, OnChanges, OnDestroy } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { MenuItem } from 'primeng/api/menuitem'
import { EdgeFile } from 'src/app/shared/models/edgeFile'
import { Valuation, ValuationStatusEnum, ValuationTypeEnum } from '../shared/valuation'
import { Subscription } from 'rxjs'
import { MessageService } from 'primeng/api'

export interface ToBDocument {
  dateRequestSent: Date
  toBLetting?: toBLetting
  toBSale?: toBSale
}

interface toBLetting {
  signatureFile?: EdgeFile
  requestId?: number
  signedOn?: Date
  isLongLetInstruction?: boolean
  isLongLetInstructionEsignAnswerId?: number
  isManagement?: boolean
  isManagementEsignAnswerId?: number
  isShortLetInstruction?: boolean
  isShortLetInstructionEsignAnswerId?: number
  zeroDepositAccepted?: boolean
  zeroDepositAcceptedEsignAnswerId?: number
}

interface toBSale {
  signatureFile?: EdgeFile
  requestId?: number
  signedOn?: Date
  instructionPriceDirection?: string
  instructionPriceDirectionEsignAnswerId?: number
  salesAgencyTypeId?: number
  salesAgencyTypeIdEsignAnswerId?: number
}

@Component({
  selector: 'app-terms-of-business',
  template: `
    <div class="">
      <div class="w-full flex flex-row">
        <ng-container *ngIf="message">
          <div class="w-full">
            <app-messages [message]="message"></app-messages>
          </div>
        </ng-container>
        <span class="flex-1 mr-2"></span>
        <ng-container *ngIf="menuItems.length">
          <app-menu [menuItems]="menuItems"></app-menu>
        </ng-container>
      </div>
      
      <form [formGroup]="form" class="my-4">
        <fieldset class="mb-2">
          <fieldset class="row">
            <label style="width: auto; margin-top: 10px" for="haveInterest">
              Does the Owner have a declarable interest
              <span class="--color-red-400">
                <i
                  [pTooltip]="informationMessage"
                  class="fa fa-info-circle fa-lg text-blue"
                  style="color: #3498db; padding-left: 4px; margin-top: -4px"
                ></i>
              </span>
            </label>
          </fieldset>
          <span class="radio radio--inline">
            <span style="margin-right: 8px">
              <input
                class="p-2"
                type="radio"
                id="declarableInterestYes"
                [value]="true"
                name="declarableInterest"
                formControlName="declarableInterest"
                data-cy="declarableInterestYes"
              />
              <label for="declarableInterestYes" class="mb-1">Yes</label>
            </span>
            <span>
              <input
                class="p-2"
                type="radio"
                id="declarableInterestNo"
                [value]="false"
                name="declarableInterest"
                formControlName="declarableInterest"
                data-cy="declarableInterestNo"
              />
              <label for="declarableInterestNo" class="mb-1">No</label>
            </span>
          </span>
        </fieldset>
        <fieldset class="mb-3">
          <p-dropdown
            *ngIf="model.declarableInterest"
            [options]="interestList"
            formControlName="section21StatusId"
            optionLabel="value"
            optionValue="id"
            [filter]="false"
            data-cy="section21StatusId"
          ></p-dropdown>
        </fieldset>
        <p-messages *ngIf="formErrors?.declarableInterest" severity="error">
          <ng-template pTemplate>
            <div data-cy="termsofbusinessWarningMessage" class="p-ml-2">Please select terms of business</div>
          </ng-template>
        </p-messages>
      </form>

      <ng-container *ngIf="showSalesToB">
        <ng-container *ngIf="termsOfBusinessDocumentIsSigned && !isPreVal">
          <app-terms-of-business-table-sales [data]="termsOfBusinessDocument?.toBSale"></app-terms-of-business-table-sales>
        </ng-container>

        <app-sales-tob-dialog
          (onSubmitTermsOfBusiness)="submitTermsOfBusiness($event)"
          [showDialog]="showDialog"
          [data]="termsOfBusinessDocument?.toBSale"
          [suggestedAskingPrice]="valuationData.suggestedAskingPrice"
        ></app-sales-tob-dialog>
      </ng-container>

      <ng-container *ngIf="showLettingsToB">
        <ng-container *ngIf="termsOfBusinessDocumentIsSigned && !isPreVal">
          <app-terms-of-business-table-lettings [data]="termsOfBusinessDocument?.toBLetting"></app-terms-of-business-table-lettings>
        </ng-container>

        <app-lettings-tob-dialog
          (onSubmitTermsOfBusiness)="submitTermsOfBusiness($event)"
          [showDialog]="showDialog"
          [data]="termsOfBusinessDocument?.toBLetting"
        ></app-lettings-tob-dialog>
      </ng-container>

      <app-send-reminder-confirmation-dialog
        [showDialog]="showSendReminderConfirmationDialog"
        (onDialogClosed)="onReminderConfirmationDialogClose($event)">
      </app-send-reminder-confirmation-dialog>
    </div>
  `
})
export class TermsOfBusinessComponent implements OnInit, OnChanges, OnDestroy {
  @Input() valuationData: Valuation
  @Input() termsOfBusinessDocument?: ToBDocument
  @Input() interestList: any[] = []
  @Input() formErrors: any = {}

  @Output() onSendTermsOfBusinessReminder: EventEmitter<any> = new EventEmitter()
  @Output() onSubmitTermsOfBusiness: EventEmitter<any> = new EventEmitter()
  @Output() onModelChange: EventEmitter<any> = new EventEmitter()

  formSubscription: Subscription = new Subscription()
  form: FormGroup
  model: any = {}
  moment = moment
  menuItems: MenuItem[]
  message: any
  showSalesToB: boolean = false
  showLettingsToB: boolean = false
  showDialog: boolean = false
  valuationType: number
  termsOfBusinessDocumentIsSigned: boolean = false
  showSendReminderConfirmationDialog: boolean = false
  isPreVal: boolean = true

  public get valuationTypeGetter(): typeof ValuationTypeEnum {
    return ValuationTypeEnum
  }

  informationMessage =
    'If property is owned by a D&G employee, employee relation or business associate e.g. Laurus Law, Prestige, Foxtons Group'

  constructor(private fb: FormBuilder, private messageService: MessageService) {}

  ngOnInit(): void {
    this.valuationType = this.valuationData.valuationType
    this.showSalesToB = this.isSalesToB()
    this.showLettingsToB = this.isLettingsToB()

    this.model.declarableInterest = this.valuationData.declarableInterest
    this.model.section21StatusId = this.valuationData.section21StatusId || ''

    this.form = this.fb.group({
      declarableInterest: [this.model.declarableInterest, Validators.required],
      section21StatusId: [this.model.section21StatusId, Validators.required]
    })
    this.formSubscription = this.form.valueChanges.subscribe((data) => {
      this.onModelChange.emit(data)
    })

    this.termsOfBusinessDocumentIsSigned = this.isTermsOfBusinessSigned()
    this.menuItems = this.setMenuItems()
    this.buildMessageForView()
    this.isPreVal = this.isPreValStatus()
  }

  ngOnChanges(changes) {
    if (changes.valuationData && !changes.valuationData.firstChange) {
      this.model.declarableInterest = changes.valuationData.currentValue.declarableInterest
      this.valuationData = changes.valuationData.currentValue
      if (changes.valuationData.currentValue.eSignSignatureTob?.dateRequestSent) {
        if (!this.message.text) this.message.text = []
        this.message.text.push(
          `Last Emailed : ${moment(this.termsOfBusinessDocument.dateRequestSent).format('Do MMM YYYY (HH:mm)')}`
        )
      }
      if (typeof this.model.declarableInterest != 'undefined') {
        this.message.type = ''
        this.message.text = []
      }
    }
    if (changes.termsOfBusinessDocument && !changes.termsOfBusinessDocument.firstChange) {
      this.termsOfBusinessDocument = changes.termsOfBusinessDocument.currentValue
      this.termsOfBusinessDocumentIsSigned = this.isTermsOfBusinessSigned()
    }
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe()
  }

  isTermsOfBusinessSigned() {
    const signedOn =
      this.termsOfBusinessDocument &&
      this.termsOfBusinessDocument.toBLetting &&
      this.termsOfBusinessDocument.toBLetting.signedOn
        ? true
        : this.termsOfBusinessDocument &&
          this.termsOfBusinessDocument.toBSale &&
          this.termsOfBusinessDocument.toBSale.signedOn
        ? true
        : false
    return signedOn
  }

  buildMessageForView() {
    // valuation statuses: None = 0, Booked = 2, Valued = 3, Instructed = 4, Cancelled = 5, Closed = 6
    this.message =
      (!this.termsOfBusinessDocumentIsSigned && this.valuationData.valuationStatus == 3) ||
      this.valuationData.valuationStatus == 4 ||
      this.valuationData.valuationStatus == 5
        ? {
            type: 'warn',
            text: ['Terms of business not yet signed']
          }
        : {
            type: '',
            text: []
          }

    if (this.termsOfBusinessDocument?.dateRequestSent && this.message.text) {
      this.message.text.push(
        `Last Emailed : ${moment(this.termsOfBusinessDocument.dateRequestSent).format('Do MMM YYYY (HH:mm)')}`
      )
    }

    console.log('this.valuationData.declarableInterest: ', this.valuationData.declarableInterest)

    if (this.valuationData.declarableInterest === null || typeof this.valuationData.declarableInterest == 'undefined') {
      this.message.type = 'error'
      this.message.text = ['Please answer declarable interest']
    }

    if (this.termsOfBusinessDocumentIsSigned) {
      const signedOn = this.termsOfBusinessDocument.toBSale
        ? this.termsOfBusinessDocument.toBSale.signedOn
        : this.termsOfBusinessDocument.toBLetting.signedOn
      this.message.type = 'success'
      this.message.text = [`Terms of business was signed on ${moment(signedOn).format('Do MMM YYYY (HH:mm)')}`]
    }
  }

  isSalesToB() {
    const isSalesTOB =
      this.valuationType == this.valuationTypeGetter.Sales &&
      (this.valuationData.valuationStatus === 3 || this.valuationData.valuationStatus === 4)
    return isSalesTOB
  }

  isLettingsToB() {
    const isLettingsTOB = this.valuationType == this.valuationTypeGetter.Lettings
    return isLettingsTOB
  }

  isPreValStatus() {
    return (
      this.valuationData.valuationStatus === ValuationStatusEnum.None ||
      this.valuationData.valuationStatus === ValuationStatusEnum.Booked
    )
  }

  public submitTermsOfBusiness(ev) {
    if (ev) {
      this.message.type = 'info'
      this.message.text = ['Terms of Business uploaded, pending save.']
      this.onSubmitTermsOfBusiness.emit(ev)
    }
    this.showDialog = false
  }

  public onReminderConfirmationDialogClose(ev) {
    this.showSendReminderConfirmationDialog = false
    if (ev) {
      this.onSendTermsOfBusinessReminder.emit()
      this.messageService.add({
        severity: 'success',
        summary: 'Reminder email sent',
        closable: false
      })
    }
  }

  private setMenuItems() {
    const items = []

    if (!this.termsOfBusinessDocumentIsSigned && this.valuationData.valuationStatus == ValuationStatusEnum.Valued) {
      items.push({
        id: 'uploadToB',
        label: 'Upload Terms of Business',
        icon: 'pi pi-upload',
        command: () => {
          this.showDialog = true
        }
      })
      items.push({
        id: 'sendAReminder',
        label: 'Send a reminder',
        icon: 'pi pi-send',
        command: () => {
          this.showSendReminderConfirmationDialog = true
        }
      })
    }

    return items
  }
}
