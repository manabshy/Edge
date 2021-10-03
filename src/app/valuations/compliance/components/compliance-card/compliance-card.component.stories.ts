import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions';
import { VendorsModule } from '../../../../shared/vendors.module';

// component under test
import { ComplianceCardComponent } from './compliance-card.component';

// document-info component and stories
import { DocumentInfoComponent } from '../document-info/document-info.component'
import { 
  IdBlank,
  IdUploadedValid,
  IdUploadedInvalid,
  ProofOfAddressBlank,
  ProofOfAddressUploaded,
  ReportBlank,
  ReportUploaded,
  MultipleReportsUploaded,
  AdditionalDocumentsBlank,
  AdditionalDocumentUploaded,
  MultipleAdditionalDocumentsUploaded
} from '../document-info/document-info.component.stories'
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';

export default {
  title: 'Valuations/Compliance/Components/ComplianceCard',
  excludeStories: /.*Data$/,
  component: ComplianceCardComponent,
  decorators: [
    moduleMetadata({
      declarations: [ComplianceCardComponent, DocumentInfoComponent, FileUploadComponent],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator((story)=> `
        <div class="m-10 w-full md:w-1/2 mx-auto shadow-md">${story}</div>
      `
    )
  ],
} as Meta;

export const actionsData = {
  fileUploaded: action('fileUploaded'),
  fileDeleted: action('fileDeleted'),
}
const ComplianceCardTemplate: Story<ComplianceCardComponent> = (args: ComplianceCardComponent) => ({
  props: {
    ...args,
    fileUploaded: actionsData.fileUploaded,
    fileDeleted: actionsData.fileDeleted
  }
});

// Lead person stories
export const LeadContactBlank = ComplianceCardTemplate.bind({});
LeadContactBlank.args = {
  hasMenuBtn: false,
  person: {
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

export const LeadContactValid = ComplianceCardTemplate.bind({});
LeadContactValid.args = {
  hasMenuBtn: false,
  person: {
    id :456,
    pillLabel: 'lead',
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    documents: {
      idDoc: IdUploadedValid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploaded.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
};

export const LeadContactAndUBO= ComplianceCardTemplate.bind({});
LeadContactAndUBO.args = {
  hasMenuBtn: false,
  person: {
    id :456,
    isUBO: true,
    pillLabel: 'lead',
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    documents: {
      idDoc: IdUploadedValid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploaded.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
};

export const LeadContactInvalid = ComplianceCardTemplate.bind({});
LeadContactInvalid.args = {
  hasMenuBtn: false,
  person: {
    id: 789,
    pillLabel: 'lead',
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    documents: {
      idDoc: IdUploadedInvalid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploaded.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
};

export const LeadContactMixed = ComplianceCardTemplate.bind({});
LeadContactMixed.args = {
  hasMenuBtn: false,
  person: {
    id: 101,
    pillLabel: 'lead',
    name: 'Andrew Whitbread',
    address: 'Flat 4, Clarendon Square, Leamington Spa, CV32 5QX',
    documents: {
      idDoc: IdUploadedValid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: MultipleReportsUploaded.args,
      additionalDocs: MultipleAdditionalDocumentsUploaded.args
    }
  }
};

// Associated person stories
export const AssociatedContactBlank = ComplianceCardTemplate.bind({});
AssociatedContactBlank.args = {
  hasMenuBtn: false,
  person: {
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

export const AssociatedContactValid = ComplianceCardTemplate.bind({});
AssociatedContactValid.args = {
  hasMenuBtn: false,
  person: {
    id: 131,
    pillLabel: 'Associated',
    name: 'Ian Blackford',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    documents: {
      idDoc: IdUploadedValid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: MultipleReportsUploaded.args,
      additionalDocs: AdditionalDocumentsBlank.args
    }
  }
};

export const AssociatedContactInvalid = ComplianceCardTemplate.bind({});
AssociatedContactInvalid.args = {
  hasMenuBtn: false,
  person: {
    id: 415,
    pillLabel: 'Associated',
    name: 'Jack Black',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    documents: {
      idDoc: IdUploadedInvalid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: MultipleReportsUploaded.args,
      additionalDocs: AdditionalDocumentUploaded.args
    }
  }
};

export const ContactWithMenu = ComplianceCardTemplate.bind({});
ContactWithMenu.args = {
  hasMenuBtn: true,
  person: {
    id: 161,
    pillLabel: 'Associated',
    name: 'Jack Black',
    position: 'Director',
    address: 'Scottich Parliament Building, Edinburgh, EH99 1SP',
    documents: {
      idDoc: IdUploadedInvalid.args, 
      proofOfAddressDoc: ProofOfAddressUploaded.args, 
      reportDocs: ReportUploaded.args,
      additionalDocs: MultipleAdditionalDocumentsUploaded.args
    }
  }
};