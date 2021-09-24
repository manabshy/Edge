import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { VendorsModule } from '../../vendors.module';

// component under test
import { ContactComplianceCardComponent } from './contact-compliance-card.component';

import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
// document-info component and stories
import { DocumentInfoComponent } from '../../components/document-info/document-info.component'
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
} from '../../components/document-info/document-info.component.stories'


export default {
  title: 'Components/Shared/Compliance/ContactComplianceCard',
  component: ContactComplianceCardComponent,
  decorators: [
    moduleMetadata({
      declarations: [ContactComplianceCardComponent, DocumentInfoComponent, FileUploadComponent],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator((story)=> `
        <div class="m-10 w-1/2 mx-auto shadow-md">${story}</div>
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
  hasMenuBtn: false,
  contact: {
    id: 123,
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
  hasMenuBtn: false,
  contact: {
    id :456,
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

export const LeadContactAndUBO= LettingsTemplate.bind({});
LeadContactAndUBO.args = {
  hasMenuBtn: false,
  contact: {
    id :456,
    isUBO: true,
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
  hasMenuBtn: false,
  contact: {
    id: 789,
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
  hasMenuBtn: false,
  contact: {
    id: 101,
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
  hasMenuBtn: false,
  contact: {
    id: 121,
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
  hasMenuBtn: false,
  contact: {
    id: 131,
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
  hasMenuBtn: false,
  contact: {
    id: 415,
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

export const ContactWithMenu = LettingsTemplate.bind({});
ContactWithMenu.args = {
  hasMenuBtn: true,
  contact: {
    id: 161,
    pillLabel: 'Associated',
    name: 'Jack Black',
    position: 'Director',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    documents: {
      idDoc: IdUploadedInvalid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploadedInvalid.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
};