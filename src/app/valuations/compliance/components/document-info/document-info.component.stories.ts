import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Story, Meta } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions'
import { DocumentInfoComponent } from './document-info.component';
import { VendorsModule } from '../../../../shared/vendors.module';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { MessagesComponent } from '../../../../shared/components/messages/messages.component';
import { MessageService } from 'primeng/api';
import { DOCUMENT_TYPE } from '../../compliance-checks.interfaces'

export default {
  title: 'Valuations/Compliance/Components/DocumentInfo',
  component: DocumentInfoComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [DocumentInfoComponent, FileUploadComponent, MessagesComponent ],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
      providers: [MessageService]
    }),
    componentWrapperDecorator((story)=> `
        <div class="w-full md:w-1/4 mx-auto">${story}</div>
      `
    )
  ],
  
} as Meta;

export const actionsData = {
  deleteFile: action('deleteFilePlease'),
}

const DocumentInfo: Story<DocumentInfoComponent> = (args: DocumentInfoComponent) => ({
  props: {
    ...args,
    deleteFile: actionsData.deleteFile,
    isFrozen: false
  }
});

export const IdBlank = DocumentInfo.bind({});
IdBlank.args = {
  documentType: DOCUMENT_TYPE.ID,
  label: 'ID',
  files: [],
  fileLimit: 1,
  fileType: '',
  url: 'https://google.com'
};

export const IdUploadedValid = DocumentInfo.bind({});
IdUploadedValid.args = {
  documentType: DOCUMENT_TYPE.ID,
  files: [{
    id: 0,
    label: 'ID',
    updateDate: '07/04/21',
    idValidationDateExpiry: '01/11/26',
    url: 'https://google.com'
 }],
};

export const IdUploadedInvalid = DocumentInfo.bind({});
IdUploadedInvalid.args = {
  documentType: DOCUMENT_TYPE.ID,
  files: [{
    id: 0,
    label: 'ID',
    updateDate: '07/04/21',
    idValidationDateExpiry: '02/09/21',
    url: 'https://google.com'
  }],
};

export const ProofOfAddressBlank = DocumentInfo.bind({});
ProofOfAddressBlank.args = {
 documentType: DOCUMENT_TYPE.PROOF_OF_ADDRESS,
 label: 'Proof Of Address',
 files: []
};

export const ProofOfAddressUploaded = DocumentInfo.bind({});
ProofOfAddressUploaded.args = {
  documentType: DOCUMENT_TYPE.PROOF_OF_ADDRESS,
  label: 'Proof Of Address',
  files: [{
    id: 0,
    label: 'Proof of Address',
    updateDate: '05/09/21'
  }]
};

export const ReportBlank = DocumentInfo.bind({});
ReportBlank.args = {
  documentType: DOCUMENT_TYPE.REPORT,
  label: 'Report',
  files: []
};

export const ReportUploaded = DocumentInfo.bind({});
ReportUploaded.args = {
  documentType: DOCUMENT_TYPE.REPORT,
  label: 'Report',
  files: [{
    id: 0,
    label: 'Report',
    updateDate: '10/19/21'
  }]
};

export const MultipleReportsUploaded = DocumentInfo.bind({});
MultipleReportsUploaded.args = {
  documentType: DOCUMENT_TYPE.REPORT,
  label: 'Report',
  files: [{
    id: 0,
    label: 'Report',
    updateDate: '01/09/21'
  }, {
    id: 0,
    label: 'Report',
    updateDate: '01/09/21'
  }]
};

export const AdditionalDocumentsBlank = DocumentInfo.bind({});
AdditionalDocumentsBlank.args = {
  documentType: DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS,
  label: 'Additional Documents',
  files: []
};

export const AdditionalDocumentUploaded = DocumentInfo.bind({});
AdditionalDocumentUploaded.args = {
  documentType: DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS,
  label: 'Additional Documents',
  files: [{
    id: 0,
    label: 'Document.pdf',
    updateDate: '01/09/21'
  }]
};

export const MultipleAdditionalDocumentsUploaded = DocumentInfo.bind({});
MultipleAdditionalDocumentsUploaded.args = {
  documentType: DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS,
  label: 'Additional Documents',
  files: [{
    id: 0,
    label: 'Other-doc.pdf',
    updateDate: '01/09/21'
  }, {
    id: 0,
    label: 'Reference-x.pdf',
    updateDate: '01/09/21'
  }]
};

export const LongNameDocumentsUploaded = DocumentInfo.bind({});
LongNameDocumentsUploaded.args = {
  documentType: DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS,
  label: 'Additional Documents',
  files: [{
    id: 0,
    updateDate: '01/09/21',
    label: 'p-52364_LandReg_0d4f32873cfa40ae918644e85472bcbe.pdf'
  }, {
    id: 0,
    label: 'Reference-x.pdf',
    updateDate: '01/09/21'
  }]
};

