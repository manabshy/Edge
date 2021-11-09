import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'

import { TermsOfBusinessTableLettingsComponent } from './terms-of-business-lettings-table.component'

export default {
  title: 'Valuations/TermsOfBusiness/TermsOfBusinessTables/LettingsTable',
  component: TermsOfBusinessTableLettingsComponent,
  decorators: [
    moduleMetadata({
      declarations: [TermsOfBusinessTableLettingsComponent],
      imports: [CommonModule]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

const LettingsTemplate: Story<TermsOfBusinessTableLettingsComponent> = (
  args: TermsOfBusinessTableLettingsComponent
) => ({
  props: args
})

export const SingleEntryLettings = LettingsTemplate.bind({})
SingleEntryLettings.args = {
  data: {
    signedOn: new Date(),
    isLongLetInstruction: true,
    isManagement: false,
    isShortLetInstruction: true,
    zeroDepositAccepted: false,
    signatureFile: {
      fileStoreId: 15746702,
      fileName: 'Completed_Landlord__Property_Questionnaire_3_69_Ch…eet_SW1V_4PG_deac4b4228134092b743340f37a4d4e7.pdf',
      updateDate: '2021-04-28T20:42:04.183+01:00',
      fileUri: 'https://google.com'
    }
  }
}
