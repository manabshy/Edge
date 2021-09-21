import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';

import { TermsOfBusinessTableLettingsComponent } from './terms-of-business-lettings-table.component';

export default {
  title: 'Components/Valuations/TermsOfBusinessTables/LettingsTable',
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
  data: [{
    signedOn: new Date(),
    instructionPriceDirection: '£890,000',
    isShortLetInstruction: 'Yes',
    isLongLetInstruction: 'Yes',
    isManagement: 'Yes',
    zeroDepositAccepted: 'No',
    signatureFile:{
      fileUri: 'http://www.google.co.uk'
    }
  }],
};

export const MultipleEntry = LettingsTemplate.bind({});
MultipleEntry.args = {
  data: [{
    signedOn: new Date(),
    instructionPriceDirection: '£890,000',
    isShortLetInstruction: 'Yes',
    isLongLetInstruction: 'Yes',
    isManagement: 'Yes',
    zeroDepositAccepted: 'No',
    signatureFile:{
      fileUri: 'http://www.google.co.uk'
    }
  },{
    signedOn: new Date(),
    instructionPriceDirection: '£1,000,000',
    isShortLetInstruction: 'No',
    isLongLetInstruction: 'No',
    isManagement: 'No',
    zeroDepositAccepted: 'Yes',
    signatureFile: {
      fileUri: 'http://www.google.co.uk'
    }
  }],
};