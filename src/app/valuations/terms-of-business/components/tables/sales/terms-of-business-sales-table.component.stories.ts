import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'

import { TermsOfBusinessTableSalesComponent } from './terms-of-business-sales-table.component'

export default {
  title: 'Valuations/TermsOfBusiness/TermsOfBusinessTables/SalesTable',
  component: TermsOfBusinessTableSalesComponent,
  decorators: [
    moduleMetadata({
      declarations: [TermsOfBusinessTableSalesComponent],
      imports: [CommonModule]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

const SalesTemplate: Story<TermsOfBusinessTableSalesComponent> = (args: TermsOfBusinessTableSalesComponent) => ({
  props: args
})

export const SingleEntrySales = SalesTemplate.bind({})
SingleEntrySales.args = {
  data: {
    signedOn: new Date(),
    instructionPriceDirection: '890000',
    salesAgencyTypeId: 1,
    signatureFile: {
      fileUri: 'http://www.google.co.uk'
    }
  }
}
