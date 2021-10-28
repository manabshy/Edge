import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VendorsModule } from '../../../../shared/vendors.module';

// component under test
import { PureComplianceChecksShellComponent } from './pure-compliance-checks-shell.component';

// child components
import { ComplianceCardComponent } from '../compliance-card/compliance-card.component';
import { DocumentInfoComponent } from '../../components/document-info/document-info.component';
import { MessagesComponent } from '../../../../shared/components/messages/messages.component';
import { CompanyFinderComponent } from '../../../../shared/components/company-finder/company-finder.component';
import {
  LeadContactBlank,
  LeadContactValid,
  AssociatedContactBlank,
  AssociatedContactValid,
  AssociatedContactInvalid,
  AssociatedCompanyContact,
} from '../compliance-card/compliance-card.component.stories';
import { BigButtonComponent } from '../../../../shared/components/big-button/big-button.component';
import { FileUploadComponent } from '../../../../shared/components/file-upload/file-upload.component';
import { PureCompanyFinderShellComponent } from 'src/app/shared/components/company-finder/pure-company-finder-shell.component';
import { MessageService } from 'primeng/api';

export default {
  title: 'Valuations/Compliance/PureComplianceChecksShellComponent',
  component: PureComplianceChecksShellComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [
        PureComplianceChecksShellComponent,
        ComplianceCardComponent,
        DocumentInfoComponent,
        MessagesComponent,
        CompanyFinderComponent,
        BigButtonComponent,
        FileUploadComponent,
        PureCompanyFinderShellComponent,
      ],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
      providers: [MessageService],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `,
    ),
  ],
} as Meta;

export const actionsData = {
  passAML: action('passAML'),
  fileWasUploaded: action('fileWasUploaded'),
  fileWasDeleted: action('fileWasDeleted'),
  refreshDocuments: action('refreshDocuments'),
};

const LettingsTemplate: Story<PureComplianceChecksShellComponent> = (args: PureComplianceChecksShellComponent) => ({
  props: {
    ...args,
    passAML: actionsData.passAML,
    fileWasUploaded: actionsData.fileWasUploaded,
    fileWasDeleted: actionsData.fileWasDeleted,
    refreshDocuments: actionsData.refreshDocuments,
  },
});

// AML stories - contact
export const ContactAMLCompletedAndValid = LettingsTemplate.bind({});
ContactAMLCompletedAndValid.args = {
  checksAreValid: true,
  checkType: 'AML',
  message: {
    type: 'success',
    text: ['AML Completed', '7th Sep 2020 (11:45)'],
  },
  entities: [
    LeadContactValid.args.entity,
    { ...AssociatedContactValid.args.entity, name: 'Jack Black' },
    AssociatedContactValid.args.entity,
    { ...AssociatedContactValid.args.entity, name: 'Eddie Murphy' },
  ],
  isFrozen: true,
};

export const ContactAMLCompleted1YearLater = LettingsTemplate.bind({});
ContactAMLCompleted1YearLater.args = {
  checksAreValid: true,
  checkType: 'AML',
  message: {
    type: 'info',
    text: ['AML checks are more than a year old', 'Consider running updated checks'],
  },
  entities: [
    LeadContactValid.args.entity,
    { ...AssociatedContactValid.args.entity, name: 'Jack Black' },
    AssociatedContactValid.args.entity,
    { ...AssociatedContactValid.args.entity, name: 'Eddie Murphy' },
  ],
  isFrozen: true,
};

export const ContactAMLIncompleteAndInvalid = LettingsTemplate.bind({});
ContactAMLIncompleteAndInvalid.args = {
  checksAreValid: false,
  checkType: 'AML',
  message: {
    type: 'error',
    text: ['AML not yet completed', 'Jack Black requires attention'],
  },
  entities: [
    LeadContactValid.args.entity,
    { ...AssociatedContactInvalid.args.entity, name: 'Jack Black' },
    AssociatedContactBlank.args.entity,
    { ...AssociatedContactValid.args.entity, name: 'Eddie Murphy' },
  ],
  isFrozen: false,
};

// KYC stories - contact
export const ContactKYCCompletedAndValid = LettingsTemplate.bind({});
ContactKYCCompletedAndValid.args = {
  checksAreValid: true,
  checkType: 'KYC',
  message: {
    type: 'success',
    text: ['KYC Completed', 'SmartSearch added: 7th Sep 2020 (11:45)'],
  },
  entities: [
    LeadContactValid.args.entity,
    { ...AssociatedContactValid.args.entity, name: 'Jack Black' },
    AssociatedContactValid.args.entity,
    { ...AssociatedContactValid.args.entity, name: 'Eddie Murphy' },
  ],
  isFrozen: true,
};

export const ContactKYCIncompleteAndInvalid = LettingsTemplate.bind({});
ContactKYCIncompleteAndInvalid.args = {
  checksAreValid: false,
  checkType: 'KYC',
  message: {
    type: 'warn',
    text: ['KYC not yet completed', 'SmartSearch added: 7th Sep 2020 (11:45)'],
  },
  entities: [
    LeadContactValid.args.entity,
    { ...AssociatedContactValid.args.entity, name: 'Jack Black' },
    { ...AssociatedContactInvalid.args.entity, name: 'Ian Blackford' },
    { ...AssociatedContactValid.args.entity, name: 'Eddie Murphy' },
  ],
  isFrozen: false,
};

// AML stories - company
export const CompanyAMLIncomplete = LettingsTemplate.bind({});
CompanyAMLIncomplete.args = {
  checksAreValid: false,
  checkType: 'AML',
  companyOrContact: 'company',
  message: {
    type: 'warn',
    text: ['AML incomplete'],
  },
  entities: [
    { ...LeadContactValid.args.entity, personDateAmlCompleted: null, companyId: LeadContactValid.args.entity.id },
    AssociatedContactValid.args.entity,
  ],
  isFrozen: false,
};

export const CompanyAMLComplete = LettingsTemplate.bind({});
CompanyAMLComplete.args = {
  checksAreValid: true,
  checkType: 'AML',
  companyOrContact: 'company',
  message: {
    type: 'success',
    text: ['AML Completed', 'SmartSearch added: 7th Sep 2020 (11:45)'],
  },
  entities: [
    { ...LeadContactValid.args.entity, isUBO: true, companyId: LeadContactValid.args.entity.id },
    AssociatedContactValid.args.entity,
  ],
  isFrozen: true,
};

export const MultipleCompanyAMLComplete = LettingsTemplate.bind({});
MultipleCompanyAMLComplete.args = {
  checksAreValid: true,
  checkType: 'AML',
  companyOrContact: 'company',
  message: {
    type: 'success',
    text: ['AML Completed', 'SmartSearch added: 7th Sep 2020 (11:45)'],
  },
  entities: [
    { ...LeadContactValid.args.entity, isUBO: true, companyId: LeadContactValid.args.entity.id },
    AssociatedContactValid.args.entity,
    AssociatedCompanyContact.args.entity,
  ],
  isFrozen: true,
};
