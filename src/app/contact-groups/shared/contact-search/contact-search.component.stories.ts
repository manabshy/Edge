import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
import { action } from '@storybook/addon-actions'
import { Story, Meta } from '@storybook/angular/types-6-0'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { VendorsModule } from '../../../shared/vendors.module'

// component under test
import { ContactSearchComponent } from './contact-search.component'

export default {
  title: 'ContactGroups/Shared/ContactSearchComponent',
  component: ContactSearchComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [ContactSearchComponent],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

export const actionsData = {
  addedPersonDetails: action('addedPersonDetails'),
  selectedPerson: action('selectedPerson'),
  isCanvasHidden: action('isCanvasHidden'),
  creatingNewPerson: action('creatingNewPerson'),
  findPotentialDuplicatePerson: action('findPotentialDuplicatePerson'),
}

const Primary: Story<ContactSearchComponent> = (args: ContactSearchComponent) => ({
  props: {
    ...args,
    findPotentialDuplicatePerson: actionsData.findPotentialDuplicatePerson,
    selectedPerson: actionsData.selectedPerson
  }
})

export const Blank = Primary.bind({})
Blank.args = {}

export const ContactMatches = Primary.bind({})
ContactMatches.args = {
  searchTerm: 'Dave Beazer',
  isCreateNewPersonVisible: true,
  existingIds: [407512, 86077],
  potentialDuplicatePeople: {
    firstName: 'Dave',
    lastName: 'Beazer',
    fullName: 'Dave Beazer',
    emailAddress: 'dbeazer@dng.co.uk',
    phoneNumber: '',
    matches: [
      {
        personId: 407512,
        titleId: 1,
        titleOther: null,
        firstName: 'Dave',
        middleName: null,
        lastName: 'Beazer',
        addressee: 'Mr Dave Beazer',
        salutation: 'Mr Beazer',
        phoneNumbers: null,
        emailAddresses: ['dbeazer@dng.co.uk'],
        ranking: 653,
        matchType: 'GoodMatch',
        matchScore: 0
      },
      {
        personId: 86077,
        titleId: 1,
        titleOther: '',
        firstName: 'Hadyn',
        middleName: '',
        lastName: 'Beazer',
        addressee: 'Mr Hadyn Beazer',
        salutation: 'Mr Beazer',
        phoneNumbers: ['07929369277'],
        emailAddresses: ['hadyn.beazer@gmail.com'],
        ranking: 126,
        matchType: 'PartMatch',
        matchScore: 0
      },
      {
        personId: 407514,
        titleId: 1,
        titleOther: '',
        firstName: 'Dave',
        middleName: '',
        lastName: 'Dave',
        addressee: 'Mr Dave Dave',
        salutation: 'Mr Dave',
        phoneNumbers: null,
        emailAddresses: ['a@a.com'],
        ranking: 105,
        matchType: 'PartMatch',
        matchScore: 0
      },
      {
        personId: 306025,
        titleId: 1,
        titleOther: null,
        firstName: 'Dave',
        middleName: null,
        lastName: 'Dave',
        addressee: 'Mr Dave Dave',
        salutation: 'Mr Dave',
        phoneNumbers: ['07595605205'],
        emailAddresses: null,
        ranking: 105,
        matchType: 'PartMatch',
        matchScore: 0
      },
      {
        personId: 123041,
        titleId: 1,
        titleOther: '',
        firstName: 'Dave',
        middleName: '',
        lastName: 'Brook',
        addressee: 'Mr Dave Brook',
        salutation: 'Mr Brook',
        phoneNumbers: ['07738687778'],
        emailAddresses: ['brooks666@yahoo.co.uk'],
        ranking: 101,
        matchType: 'PartMatch',
        matchScore: 0
      },
      {
        personId: 129987,
        titleId: 1,
        titleOther: '',
        firstName: 'Dave',
        middleName: '',
        lastName: 'Budge',
        addressee: 'Mr Dave Budge',
        salutation: 'Mr Budge',
        phoneNumbers: ['07737523773'],
        emailAddresses: ['dave.personalfitness@googlemail.com'],
        ranking: 101,
        matchType: 'PartMatch',
        matchScore: 0
      },
      {
        personId: 125100,
        titleId: 1,
        titleOther: '',
        firstName: 'Dave',
        middleName: '',
        lastName: 'Lockyer',
        addressee: 'Mr Dave Lockyer',
        salutation: 'Mr Lockyer',
        phoneNumbers: ['07770857091'],
        emailAddresses: ['davelockyer@gmail.com'],
        ranking: 101,
        matchType: 'PartMatch',
        matchScore: 0
      },
      {
        personId: 172986,
        titleId: 1,
        titleOther: '',
        firstName: 'Dave',
        middleName: '',
        lastName: 'Paker',
        addressee: 'Mr Dave Paker',
        salutation: 'Mr Paker',
        phoneNumbers: ['01797226114'],
        emailAddresses: ['davepaker96@yahoo.com'],
        ranking: 101,
        matchType: 'PartMatch',
        matchScore: 0
      }
    ]
  }
}
