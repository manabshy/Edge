import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'

import { SalesToBDialogComponent } from './sales-tob-dialog.component'

export default {
  title: 'Valuations/TermsOfBusiness/Dialogs/Sales',
  component: SalesToBDialogComponent,
  decorators: [
    moduleMetadata({
      declarations: [SalesToBDialogComponent],
      imports: [CommonModule]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

const SalesTemplate: Story<SalesToBDialogComponent> = (args: SalesToBDialogComponent) => ({
  props: args
})

export const SingleEntry = SalesTemplate.bind({})
SingleEntry.args = {
  data: {
    signedOn: new Date(),
    isShortLetInstruction: 'Yes',
    isLongLetInstruction: 'Yes',
    isManagement: 'Yes',
    zeroDepositAccepted: 'No',
    signatureFile: {
      fileUri: 'http://www.google.co.uk'
    }
  }
}
