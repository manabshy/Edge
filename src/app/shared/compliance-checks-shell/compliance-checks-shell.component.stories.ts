import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions'
import { Story, Meta } from '@storybook/angular/types-6-0';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VendorsModule } from '../vendors.module';

// component under test
import { ComplianceChecksShellComponent } from './compliance-checks-shell.component';

// child components
import { ContactComplianceCardComponent } from '../contact-compliance-card/contact-compliance-card.component';
import { DocumentInfoComponent } from '../document-info/document-info.component';
import { MessagesComponent } from '../messages/messages.component';
import { CompanyFinderComponent } from '../components/company-finder/company-finder.component';
import { 
  LeadContactValid,
  AssociatedContactBlank,
  AssociatedContactValid,
  AssociatedContactInvalid 
} from '../contact-compliance-card/contact-compliance-card.component.stories'
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Router, RouterModule } from '@angular/router';
import { BigButtonComponent } from '../big-button/big-button.component';

export default {
  title: 'Components/Shared/ComplianceChecksShell',
  component: ComplianceChecksShellComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [
        ComplianceChecksShellComponent,
        ContactComplianceCardComponent,
        DocumentInfoComponent,
        MessagesComponent,
        CompanyFinderComponent,
        BigButtonComponent
      ],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule, ],
      providers: [ContactGroupsService, RouterModule]
    }),
    componentWrapperDecorator((story)=> `
        <div style="margin: 3em">${story}</div>
      `
    )
  ],
  
} as Meta;

export const actionsData = {
  passAML: action('passAML')
}

const LettingsTemplate: Story<ComplianceChecksShellComponent> = (args: ComplianceChecksShellComponent) => ({
  props: {
    ...args,
    passAML: actionsData.passAML
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
  contacts: [
    LeadContactValid.args.contact,
    {...AssociatedContactValid.args.contact, name: 'Jack Black'},
    AssociatedContactValid.args.contact,
    {...AssociatedContactValid.args.contact, name: 'Eddie Murphy'}
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
  contacts: [
    LeadContactValid.args.contact,
    {...AssociatedContactInvalid.args.contact, name: 'Jack Black'},
    AssociatedContactValid.args.contact,
    {...AssociatedContactValid.args.contact, name: 'Eddie Murphy'}
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
  contacts: [
    LeadContactValid.args.contact,
    {...AssociatedContactValid.args.contact, name: 'Jack Black'},
    AssociatedContactValid.args.contact,
    {...AssociatedContactValid.args.contact, name: 'Eddie Murphy'}
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
  contacts: [
    LeadContactValid.args.contact,
    {...AssociatedContactValid.args.contact, name: 'Jack Black'},
    {...AssociatedContactInvalid.args.contact, name: 'Ian Blackford'},
    {...AssociatedContactValid.args.contact, name: 'Eddie Murphy'}
  ]
};

// AML stories - company
export const CompanyAMLIncomplete = LettingsTemplate.bind({});
CompanyAMLIncomplete.args = {
  checksAreValid: false,
  checkType: 'AML',
  companyOrContact: 'company',
  message: {
    type:'success',
    text:['AML Completed', 'SmartSearch added: 7th Sep 2020 (11:45)']
  },
  contacts: [
    LeadContactValid.args.contact,
    AssociatedContactValid.args.contact
  ]
};
