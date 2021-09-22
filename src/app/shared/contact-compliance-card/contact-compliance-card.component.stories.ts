import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';

import { ContactComplianceCardComponent } from './contact-compliance-card.component';
import { DocumentInfoComponent } from '../document-info/document-info.component'
// document-info stories
import { IdUploadedValid, ProofOfAddressUploaded, ReportUploadedValid, AdditionalDocumentsBlank } from '../document-info/document-info.component.stories'

export default {
  title: 'Components/Shared/ContactComplianceCard',
  component: ContactComplianceCardComponent,
  decorators: [
    moduleMetadata({
      declarations: [ContactComplianceCardComponent, DocumentInfoComponent],
      imports: [CommonModule, ],
    }),
    componentWrapperDecorator((story)=> `
        <div style="margin: 3em">${story}</div>
      `
    )
  ],
  
} as Meta;

const LettingsTemplate: Story<ContactComplianceCardComponent> = (args: ContactComplianceCardComponent) => ({
  props: args,
});

export const LeadContact = LettingsTemplate.bind({});
LeadContact.args = {
  pillLabel: 'lead',
  name: 'Andrew Whitbread',
  address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
  documents: {
    idDoc: IdUploadedValid.args, 
    proofOfAddressDoc: ProofOfAddressUploaded.args, 
    reportDocs: ReportUploadedValid.args,
    additionalDocs: AdditionalDocumentsBlank.args
  }
};

export const AssociatedContact = LettingsTemplate.bind({});
AssociatedContact.args = {
  pillLabel: 'associated',
  name: 'Jack Black',
  address: 'Scottich Parliament Building, Edinburgh, EH99 1SP'
};
