import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { action } from '@storybook/addon-actions'
import { Story, Meta } from '@storybook/angular/types-6-0';
import { VendorsModule } from '../vendors.module';

// component under test
import { ContactComplianceCardsShellComponent } from './contact-compliance-cards-shell.component';

// child components
import { ContactComplianceCardComponent } from '../contact-compliance-card/contact-compliance-card.component';
import { DocumentInfoComponent } from '../document-info/document-info.component';
import { MessagesComponent } from '../messages/messages.component';
import { 
  LeadContactValid,
  AssociatedContactBlank,
  AssociatedContactValid,
  AssociatedContactInvalid 
} from '../contact-compliance-card/contact-compliance-card.component.stories'

export default {
  title: 'Components/Shared/ContactComplianceCardsShell',
  component: ContactComplianceCardsShellComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [ContactComplianceCardsShellComponent, ContactComplianceCardComponent, DocumentInfoComponent, MessagesComponent],
      imports: [CommonModule, VendorsModule],
    }),
    componentWrapperDecorator((story)=> `
        <div style="margin: 3em">${story}</div>
      `
    )
  ],
  
} as Meta;

export const actionsData = {
  passAML: action('passAML'),
}


const LettingsTemplate: Story<ContactComplianceCardsShellComponent> = (args: ContactComplianceCardsShellComponent) => ({
  props: {
    ...args,
    passAML: actionsData.passAML
  } 
});

// AML stories
export const AMLCompletedAndValid = LettingsTemplate.bind({});
AMLCompletedAndValid.args = {
  isValid: true,
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
export const AMLIncompletedAndInvalid = LettingsTemplate.bind({});
AMLIncompletedAndInvalid.args = {
  isValid: false,
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

// KYC stories
export const KYCCompletedAndValid = LettingsTemplate.bind({});
KYCCompletedAndValid.args = {
  isValid: true,
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
export const KYCIncompletedAndInvalid = LettingsTemplate.bind({});
KYCIncompletedAndInvalid.args = {
  isValid: false,
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
