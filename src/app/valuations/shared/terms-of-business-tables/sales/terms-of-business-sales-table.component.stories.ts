import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';

import { TermsOfBusinessTableSalesComponent } from './terms-of-business-sales-table.component';

export default {
  title: 'Components/Valuations/TermsOfBusinessTables/SalesTable',
  component: TermsOfBusinessTableSalesComponent,
  decorators: [
    moduleMetadata({
      declarations: [TermsOfBusinessTableSalesComponent],
      imports: [CommonModule],
    }),
    componentWrapperDecorator((story)=> `
        <div style="margin: 3em">${story}</div>
      `
    )
  ],
} as Meta;

const SalesTemplate: Story<TermsOfBusinessTableSalesComponent> = (args: TermsOfBusinessTableSalesComponent) => ({
  props: args,
});

export const SingleEntry = SalesTemplate.bind({});
SingleEntry.args = {
  data: [{
    valuationDate: new Date(),
    instructionPriceDirection: '£890,000',
    soleOrMulti: 'Sole',
    valuationFiles:[{
      fileUri: 'http://www.google.co.uk'
    }]
  }],
};

export const MultipleEntry = SalesTemplate.bind({});
MultipleEntry.args = {
  data: [{
    valuationDate: new Date(),
    instructionPriceDirection: '£890,000',
    soleOrMulti: 'Sole',
    valuationFiles:[{
      fileUri: 'http://www.google.co.uk'
    }]
  },{
    valuationDate: new Date(),
    instructionPriceDirection: '£1,000,000',
    soleOrMulti: 'Multi',
    valuationFiles:[{
      fileUri: 'http://www.google.co.uk'
    }]
  }],
};
