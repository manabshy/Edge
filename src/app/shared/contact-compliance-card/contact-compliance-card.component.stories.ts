import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { VendorsModule } from '../vendors.module';

// component under test
import { ContactComplianceCardComponent } from './contact-compliance-card.component';

// document-info component
import { DocumentInfoComponent } from '../document-info/document-info.component'
// document-info stories
import { 
  IdBlank,
  IdUploadedValid, 
  IdUploadedInvalid, 
  ProofOfAddressBlank,
  ProofOfAddressUploaded,
  ReportBlank,
  ReportUploadedValid, 
  ReportUploadedInvalid,
  AdditionalDocumentsBlank,
  AdditionalDocumentUploaded
} from '../document-info/document-info.component.stories'


export default {
  title: 'Components/Shared/ContactComplianceCard',
  component: ContactComplianceCardComponent,
  decorators: [
    moduleMetadata({
      declarations: [ContactComplianceCardComponent, DocumentInfoComponent],
      imports: [CommonModule, VendorsModule],
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

// Lead contact stories
export const LeadContactBlank = LettingsTemplate.bind({});
LeadContactBlank.args = {
  contact: {
    pillLabel: 'lead',
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    documents: {
      idDoc: IdBlank.args, 
      proofOfAddressDoc: ProofOfAddressBlank.args, 
      reportDocs: ReportBlank.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
};

export const LeadContactValid = LettingsTemplate.bind({});
LeadContactValid.args = {
  contact: {
    pillLabel: 'lead',
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    documents: {
      idDoc: IdUploadedValid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploadedValid.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
};

export const LeadContactInvalid = LettingsTemplate.bind({});
LeadContactInvalid.args = {
  contact: {
    pillLabel: 'lead',
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    documents: {
      idDoc: IdUploadedInvalid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploadedInvalid.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
};

export const LeadContactMixed = LettingsTemplate.bind({});
LeadContactMixed.args = {
  contact: {
    pillLabel: 'lead',
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    documents: {
      idDoc: IdUploadedValid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploadedValid.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
};

// Associated contact stories
export const AssociatedContactBlank = LettingsTemplate.bind({});
AssociatedContactBlank.args = {
  contact: {
    pillLabel: 'Associated',
    name: 'Eddie Murphy',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    documents: {
      idDoc: IdBlank.args, 
      proofOfAddressDoc: ProofOfAddressBlank.args, 
      reportDocs: ReportBlank.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
};

export const AssociatedContactValid = LettingsTemplate.bind({});
AssociatedContactValid.args = {
  contact: {
    pillLabel: 'Associated',
    name: 'Ian Blackford',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    documents: {
      idDoc: IdUploadedValid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploadedValid.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
};

export const AssociatedContactInvalid = LettingsTemplate.bind({});
AssociatedContactInvalid.args = {
  contact: {
    pillLabel: 'Associated',
    name: 'Jack Black',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    documents: {
      idDoc: IdUploadedInvalid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploadedInvalid.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
};