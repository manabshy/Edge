import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Story, Meta } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions'
import { DocumentInfoComponent } from './document-info.component';
import { VendorsModule } from '../../vendors.module';
import { FileUploadComponent } from '../file-upload/file-upload.component';

export default {
  title: 'Components/Shared/DocumentInfo',
  component: DocumentInfoComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [DocumentInfoComponent, FileUploadComponent],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator((story)=> `
        <div style="margin: 3em" class="w-1/4">${story}</div>
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
    deleteFile: actionsData.deleteFile
  }
});

export const IdBlank = DocumentInfo.bind({});
IdBlank.args = {
  documentType: 'id',
  label: 'Upload ID',
  files: [],
  fileLimit: 1,
  fileType: ''
};

export const IdUploadedValid = DocumentInfo.bind({});
IdUploadedValid.args = {
  documentType: 'id',
  files: [{
    id: 0,
    label: 'ID',
    uploadDate: '07/04/21',
    expiryDate: '12/11/26'
 }],
};

export const IdUploadedInvalid = DocumentInfo.bind({});
IdUploadedInvalid.args = {
  documentType: 'id',
  files: [{
    id: 0,
    label: 'ID',
    uploadDate: '07/04/21',
    expiryDate: '20/09/21'
  }],
};

export const ProofOfAddressBlank = DocumentInfo.bind({});
ProofOfAddressBlank.args = {
 documentType: 'proof-of-address',
 label: 'Upload Proof Of Address',
 files: []
};

export const ProofOfAddressUploaded = DocumentInfo.bind({});
ProofOfAddressUploaded.args = {
  documentType: 'proof-of-address',
  label: 'Upload Proof Of Address',
  files: [{
    id: 0,
    label: 'Proof of Address',
    uploadDate: '20/09/21'
  }]
};

export const ReportBlank = DocumentInfo.bind({});
ReportBlank.args = {
  documentType: 'report',
  label: 'Upload Report',
  files: []
};

export const ReportUploadedValid = DocumentInfo.bind({});
ReportUploadedValid.args = {
  documentType: 'report',
  label: 'Upload Report',
  files: [{
    id: 0,
    label: 'Report',
    valid: true,
    uploadDate: '20/09/21'
  }]
};

export const ReportUploadedInvalid = DocumentInfo.bind({});
ReportUploadedInvalid.args = {
  documentType: 'report',
  label: 'Upload Report',
  files: [{
    id: 0,
    label: 'Report',
    valid: false,
    uploadDate: '20/09/21'
  }]
};

export const AdditionalDocumentsBlank = DocumentInfo.bind({});
AdditionalDocumentsBlank.args = {
  documentType: 'additional-documents',
  label: 'Upload Additional Documents',
  files: []
};

export const AdditionalDocumentUploaded = DocumentInfo.bind({});
AdditionalDocumentUploaded.args = {
  documentType: 'additional-documents',
  label: 'Upload Additional Documents',
  files: [{
    id: 0,
    label: 'Document',
    uploadDate: '01/09/21'
  }]
};

