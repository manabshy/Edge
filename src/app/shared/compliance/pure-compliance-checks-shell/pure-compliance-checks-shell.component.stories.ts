import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions'
import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VendorsModule } from '../../vendors.module';

// component under test
import { PureComplianceChecksShellComponent } from './pure-compliance-checks-shell.component';

// child components
import { ComplianceCardComponent } from '../compliance-card/compliance-card.component';
import { DocumentInfoComponent } from '../../components/document-info/document-info.component';
import { MessagesComponent } from '../../components/messages/messages.component';
import { CompanyFinderComponent } from '../../components/company-finder/company-finder.component';
import { 
  LeadContactValid,
  AssociatedContactBlank,
  AssociatedContactValid,
  AssociatedContactInvalid 
} from '../compliance-card/compliance-card.component.stories'
import { BigButtonComponent } from '../../components/big-button/big-button.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';

export default {
  title: 'Components/Shared/Compliance/PureComplianceChecksShellComponent',
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
        FileUploadComponent
      ],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule ]
    }),
    componentWrapperDecorator((story)=> `
        <div style="margin: 3em">${story}</div>
      `
    )
  ], 
} as Meta;

export const actionsData = {
  passAML: action('passAML'),
  fileWasUploaded: action('fileWasUploaded'),
  fileWasDeleted: action('fileWasDeleted'),
}

const LettingsTemplate: Story<PureComplianceChecksShellComponent> = (args: PureComplianceChecksShellComponent) => ({
  props: {
    ...args,
    passAML: actionsData.passAML,
    fileWasUploaded: actionsData.fileWasUploaded,
    fileWasDeleted: actionsData.fileWasDeleted,
  } 
});

// AML stories - contact
export const ContactAMLCompletedAndValid = LettingsTemplate.bind({});
ContactAMLCompletedAndValid.args = {
  checksAreValid: true,
  checkType: 'AML',
  message: {
    type:'success',
    text:['AML Completed', 'SmartSearch added: 7th Sep 2020 (11:45)']
  },
  people: [
    LeadContactValid.args.person,
    {...AssociatedContactValid.args.person, name: 'Jack Black' },
    AssociatedContactValid.args.person,
    {...AssociatedContactValid.args.person, name: 'Eddie Murphy'}
  ]
};

export const ContactAMLIncompleteAndInvalid = LettingsTemplate.bind({});
ContactAMLIncompleteAndInvalid.args = {
  checksAreValid: false,
  checkType: 'AML',
  message: {
    type:'warn',
    text:['AML not yet completed', 'SmartSearch added: 7th Sep 2020 (11:45)']
  },
  people: [
    LeadContactValid.args.person,
    {...AssociatedContactInvalid.args.person, name: 'Jack Black'},
    AssociatedContactValid.args.person,
    {...AssociatedContactValid.args.person, name: 'Eddie Murphy'}
  ]
};

// KYC stories - contact
export const ContactKYCCompletedAndValid = LettingsTemplate.bind({});
ContactKYCCompletedAndValid.args = {
  checksAreValid: true,
  checkType: 'KYC',
  message: {
    type:'success',
    text:['KYC Completed', 'SmartSearch added: 7th Sep 2020 (11:45)']
  },
  people: [
    LeadContactValid.args.person,
    {...AssociatedContactValid.args.person, name: 'Jack Black'},
    AssociatedContactValid.args.person,
    {...AssociatedContactValid.args.person, name: 'Eddie Murphy'}
  ]
};

export const ContactKYCIncompleteAndInvalid = LettingsTemplate.bind({});
ContactKYCIncompleteAndInvalid.args = {
  checksAreValid: false,
  checkType: 'KYC',
  message: {
    type:'warn',
    text:['KYC not yet completed', 'SmartSearch added: 7th Sep 2020 (11:45)']
  },
  people: [
    LeadContactValid.args.person,
    {...AssociatedContactValid.args.person, name: 'Jack Black'},
    {...AssociatedContactInvalid.args.person, name: 'Ian Blackford'},
    {...AssociatedContactValid.args.person, name: 'Eddie Murphy'}
  ]
};

// AML stories - company
export const CompanyAMLIncomplete = LettingsTemplate.bind({});
CompanyAMLIncomplete.args = {
  checksAreValid: false,
  checkType: 'AML',
  companyOrContact: 'company',
  message: {
    type:'warn',
    text:['AML incomplete']
  },
  people: [
    LeadContactValid.args.person,
    AssociatedContactValid.args.person
  ]
};

export const CompanyAMLComplete = LettingsTemplate.bind({});
CompanyAMLComplete.args = {
  checksAreValid: false,
  checkType: 'AML',
  companyOrContact: 'company',
  message: {
    type:'success',
    text:['AML Completed', 'SmartSearch added: 7th Sep 2020 (11:45)']
  },
  people: [
    {...LeadContactValid.args.person, isUBO: true },
    AssociatedContactValid.args.person
  ]
};
