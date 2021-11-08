import moment from 'moment'
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MenuItem } from 'primeng/api/menuitem'
import { EdgeFile } from 'src/app/shared/models/edgeFile'
import { Valuation, ValuationTypeEnum } from '../shared/valuation'
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core'

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
  salesAgencyTypeId?: string
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
        <span class="flex-1"></span>
        <app-menu [menuItems]="menuItems"></app-menu>
      </div>

      <form [formGroup]="form" class="my-4">
        <formly-form
          [model]="model"
          [fields]="fields"
          [options]="options"
          [form]="form"
          (modelChange)="onModelChange.emit($event)"
        ></formly-form>
      </form>

      <!--
      <p-messages *ngIf="true" severity="error">
        <ng-template pTemplate>
          <div data-cy="termsofbusinessWarningMessage" class="p-ml-2">Please select terms of business</div>
        </ng-template>
      </p-messages>
      -->

      <ng-container *ngIf="showSalesToB">
        <app-terms-of-business-table-sales [data]="termsOfBusinessDocument"></app-terms-of-business-table-sales>

        <app-sales-tob-dialog
          (onSubmitTermsOfBusiness)="submitTermsOfBusiness($event)"
          [showDialog]="showSalesDialog"
          [termsOfBusinessModel]="termsOfBusinessDocument.toBSale"
        ></app-sales-tob-dialog>
      </ng-container>

      <ng-container *ngIf="showLettingsToB">
        <app-terms-of-business-table-lettings [data]="termsOfBusinessDocument"></app-terms-of-business-table-lettings>

        <app-lettings-tob-dialog
          (onSubmitTermsOfBusiness)="submitTermsOfBusiness($event)"
          [showDialog]="showLettingsDialog"
          [termsOfBusinessModel]="termsOfBusinessDocument.toBLetting"
        ></app-lettings-tob-dialog>
      </ng-container>
    </div>
  `
})
export class TermsOfBusinessComponent implements OnInit {
  @Input() valuationData: Valuation
  @Input() interestList: any[] = []
  @Input() formErrors

  @Output() onSendTermsOfBusinessReminder: EventEmitter<any> = new EventEmitter()
  @Output() onSubmitTermsOfBusiness: EventEmitter<any> = new EventEmitter()
  @Output() onFileUploaded: EventEmitter<any> = new EventEmitter()
  @Output() onModelChange: EventEmitter<any> = new EventEmitter()

  form = new FormGroup({})
  model: any = {}
  options: FormlyFormOptions = {}
  fields: FormlyFieldConfig[]

  termsOfBusinessDocument: ToBDocument
  moment = moment
  menuItems: MenuItem[]
  message: any
  defaultMessage: any
  showSalesToB: boolean = false
  showSalesDialog: boolean = false
  showLettingsToB: boolean = false
  showLettingsDialog: boolean = false
  valuationType: number

  public get valuationTypeGetter(): typeof ValuationTypeEnum {
    return ValuationTypeEnum
  }

  informationMessage =
    'If property is owned by a D&G employee, employee relation or business associate e.g. Laurus Law, Prestige, Foxtons Group'

  constructor() {}

  ngOnInit(): void {
    this.fields = this.termsOfBusinessFormFields()
    this.termsOfBusinessDocument = this.valuationData.eSignSignatureTob
      ? this.valuationData.eSignSignatureTob
      : { dateRequestSent: null, toBLetting: {}, toBSale: {} }
    this.valuationType = this.valuationData.valuationType
    this.showSalesToB = this.isSalesToB()
    this.showLettingsToB = this.isLettingsToB()

    console.log('initting tob component: ', this.termsOfBusinessDocument)

    this.defaultMessage = {
      type: 'warn',
      text: [
        'Terms of business not yet signed',
        `Last Emailed : ${moment(this.termsOfBusinessDocument?.dateRequestSent).format('Do MMM YYYY (HH:mm)')}`
      ]
    }

    this.menuItems = this.setMenuItems()
    this.message =
      this.valuationData.valuationStatus == 3 ||
      this.valuationData.valuationStatus == 4 ||
      this.valuationData.valuationStatus == 5
        ? this.defaultMessage
        : {}
  }

  isSalesToB() {
    return (
      (this.valuationType == this.valuationTypeGetter.Sales && this.valuationData.valuationStatus === 3) ||
      this.valuationData.valuationStatus === 4
    )
  }

  isLettingsToB() {
    return this.valuationType == this.valuationTypeGetter.Lettings
  }

  public submitTermsOfBusiness(ev) {
    console.log('submit terms of business: ', ev)
    this.onSubmitTermsOfBusiness.emit(ev)
  }

  public uploadFile(file) {
    this.onFileUploaded.emit(file)
  }

  private setMenuItems() {
    return [
      {
        id: 'uploadToB',
        label: 'Upload ToB (L)',
        icon: 'pi pi-upload',
        command: () => {
          this.showLettingsDialog = !this.showLettingsDialog
        }
      },
      {
        id: 'uploadToB',
        label: 'Upload ToB (S)',
        icon: 'pi pi-upload',
        command: () => {
          this.showSalesDialog = !this.showSalesDialog
        }
      },
      {
        id: 'sendAReminder',
        label: 'Send a reminder',
        icon: 'pi pi-send',
        command: () => {
          this.onSendTermsOfBusinessReminder.emit()
        }
      }
    ]
  }

  private termsOfBusinessFormFields(): FormlyFieldConfig[] {
    return [
      {
        fieldGroupClassName: 'w-full md:w-1/2 my-2',
        fieldGroup: [
          {
            key: 'declarableInterest',
            type: 'radio',
            templateOptions: {
              label: 'Does the Owner have a declarable interest (Section 21)',
              description: 'In order to proceed, please accept terms',
              required: true,
              options: [
                {
                  value: true,
                  label: 'Yes'
                },
                {
                  value: false,
                  label: 'No'
                }
              ]
            }
          }
        ]
      },
      {
        template: '<hr /><div><strong>Address:</strong></div>',
      },
      {
        fieldGroupClassName: 'flex flex-col',
        fieldGroup: [
          {
            className: 'w-full md:w-1/2 my-2',
            key: 'section21StatusId',
            type: 'select',
            templateOptions: {
              label: 'Section 21 status',
              description: 'Description to go here',
              required: true,
              options: this.interestList.map((o) => {
                return { value: o.id, label: o.value }
              })
            },
            hideExpression: '!model.declarableInterest'
          }
        ]
      }
    ]
  }
}
