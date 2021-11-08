import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { action } from '@storybook/addon-actions'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { TermsOfBusinessComponent } from './terms-of-business.component'
import { TermsOfBusinessTableLettingsComponent } from './components/tables/lettings/terms-of-business-lettings-table.component'
import { TermsOfBusinessTableSalesComponent } from './components/tables/sales/terms-of-business-sales-table.component'
import { VendorsModule } from 'src/app/shared/vendors.module'
import formErrorsSampleData from './form-errors-sample'
import { MessagesComponent } from 'src/app/shared/components/messages/messages.component'
import { MenuComponent } from 'src/app/shared/components/menu/menu.component'
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component'
import { MessageService } from 'primeng/api'

export default {
  title: 'Valuations/TermsOfBusiness/TermsOfBusinessComponent',
  excludeStories: /.*Data$/,
  component: TermsOfBusinessComponent,
  //   subcomponents: { TermsOfBusinessTableLettingsComponent, TermsOfBusinessTableSalesComponent },
  decorators: [
    moduleMetadata({
      declarations: [
        TermsOfBusinessComponent,
        TermsOfBusinessTableLettingsComponent,
        TermsOfBusinessTableSalesComponent,
        MessagesComponent,
        MenuComponent,
        FileUploadComponent
      ],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
      providers: [MessageService]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

export const actionsData = {
  onSendTermsOfBusinessReminder: action('onSendTermsOfBusinessReminder'),
  onFileUploaded: action('onFileUploaded')
}

const SalesTemplate: Story<TermsOfBusinessComponent> = (args: TermsOfBusinessComponent) => ({
  props: {
    ...args,
    onSendTermsOfBusinessReminder: actionsData.onSendTermsOfBusinessReminder,
    onFileUploaded: actionsData.onFileUploaded
  }
})

// <app-terms-of-business
//  [valuationForm]="valuationForm"
//  [interestList]="interestList"
//  [termsOfBusinessDocument]="valuation.termsOfBusinessDocument"
//  [formErrors]="formErrors"
//  [valuationType]="valuation.valuationType"
//  [valuationStatus]="valuation.valuationStatus"
//  [dateRequestSent]="valuation.dateRequestSent"
//  (onSendTermsOfBusinessReminder)="onSendTermsOfBusinessReminder($event)"
//  (onFileUploaded)="onFileUploaded($event)">
// </app-terms-of-business>

export const SalesExample = SalesTemplate.bind({})
SalesExample.args = {
  valuationFormData: {
    declarableInterest: '',
    section21StatusId: []
  },
  interestList: [
    { id: 2, value: 'Douglas & Gordon Employee' },
    { id: 3, value: 'Related to a Douglas & Gordon Employee' },
    { id: 4, value: 'Douglas & Gordon Business Associate' }
  ],
  formErrors: formErrorsSampleData(),
  valuationType: 0, //ValuationTypeEnum
  valuationStatus: 4, //number
  dateRequestSent: new Date(), //Date
  fileType: 1, // FileTypeEnum
  termsOfBusinessDocument: {
    isLongLetInstruction: false,
    isManagement: false,
    isShortLetInstruction: false,
    signedOn: null,
    // signedOn: '2021-04-28T20:42:04.183+01:00',
    zeroDepositAccepted: false,
    signatureFile: {
      fileStoreId: 15746702,
      fileName: 'Completed_Landlord__Property_Questionnaire_3_69_Ch…eet_SW1V_4PG_deac4b4228134092b743340f37a4d4e7.pdf',
      updateDate: '2021-04-28T20:42:04.183+01:00',
      fileUri: 'https://google.com'
    },
  }
}
