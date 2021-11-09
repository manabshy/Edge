import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';

import { TermsOfBusinessTableLettingsComponent } from './terms-of-business-lettings-table.component';

export default {
  title: 'Valuations/TermsOfBusiness/TermsOfBusinessTables/LettingsTable',
  component: TermsOfBusinessTableLettingsComponent,
  decorators: [
    moduleMetadata({
      declarations: [TermsOfBusinessTableLettingsComponent],
      imports: [CommonModule],
    }),
    componentWrapperDecorator((story)=> `
        <div style="margin: 3em">${story}</div>
      `
    )
  ],
  
} as Meta;

const LettingsTemplate: Story<TermsOfBusinessTableLettingsComponent> = (args: TermsOfBusinessTableLettingsComponent) => ({
  props: args,
});

export const SingleEntry = LettingsTemplate.bind({});
SingleEntry.args = {
  data: {
    signedOn: new Date(),
    isShortLetInstruction: 'Yes',
    isLongLetInstruction: 'Yes',
    isManagement: 'Yes',
    zeroDepositAccepted: 'No',
    signatureFile:{
      fileUri: 'http://www.google.co.uk'
    }
  }
};
