import { BasicPerson } from 'src/app/core/models/person';

export const MockBasicPerson = {
  firstName: 'John',
  lastName: 'Don',
  phoneNumber: '07967888444',
  emailAddress: 'don@test.com'
} as BasicPerson;

export const MockPerson = {
  personId: 297426,
  titleId: 1,
  titleOther: null,
  firstName: 'Alex',
  middleName: '',
  lastName: 'Agyapong',
  addressee: 'Mr Alex Agyapong',
  salutation: 'Mr Agyapong',
  isMainPerson: null,
  contactByEmail: true,
  contactByPhone: false,
  marketingPreferences: {
    marketBulletin: false,
    events: false,
    newHomes: false,
    offersSurveys: false,
    general: false,
    count: 0
  },
  amlCompletedDate: null,
  warningStatusId: 1,
  warningStatusComment: null,
  address: {
    addressLines: 'Loqate\nWaterside\nBasin Road\nWorcester',
    outCode: 'WR5',
    inCode: '3DA',
    postCode: 'WR5 3DA',
    countryId: 232
  },
  phoneNumbers: [
    {
      id: 289063,
      typeId: 3,
      number: '07803409153',
      isPreferred: true,
      sendSMS: true,
      comments: null
    },
    {
      id: 302206,
      typeId: 3,
      number: '07803409154',
      isPreferred: false,
      sendSMS: true,
      comments: ''
    },
    {
      id: 302207,
      typeId: 1,
      number: '02073654278',
      isPreferred: false,
      sendSMS: false,
      comments: ''
    },
    {
      id: 302208,
      typeId: 3,
      number: '07803409199',
      isPreferred: false,
      sendSMS: true,
      comments: ''
    }
  ],
  emailAddresses: [
    {
      id: 237338,
      email: 'aagyapong@dng.co.uk',
      isPreferred: true,
      isPrimaryWebEmail: true
    }
  ],
  info: null
};
