import { Address } from './address';

export interface Person {
  personId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  title: string;
  titleOther?: string;
  emailAddresses: Email[];
  phoneNumbers: PhoneNumbers[];
  address: Address;
  contactByEmail: boolean;
  contactByPhone: boolean;
  contactByPost: boolean;
  currentUserName: string;
  currentStaffMemberID: number;
  neverMarket: boolean;
}
export interface Email {
  emailId: number;
  email: string;
  isPrimaryWebEmail: boolean;
  orderNumber: number;
}

export interface PhoneNumbers {
  phoneNumberId: number;
  isPreferred: boolean;
  number: string;
  orderNumber: number;
  type: PhoneType;
  comments: string;
}

export interface PhoneType {
  id: number;
  name: string;
  valueStr: string;
}

export interface Referees {
  referralCompanyId: number;
  name: string;
  email: string;
  valueOrder: number;
  referralCompanyTypeId: string;
}

export interface Referral {
  personId: number;
  staffMemberId: number;
  referredTo: string;
  currentStaffMemberId: number;
}

export const PeopleTitles  = <PersonTitle[]>[
  {id: 'Mr', name: 'Mr'},
  {id: 'Mrs', name: 'Mrs'},
  {id: 'Miss', name: 'Miss'},
  {id: 'Ms', name: 'Ms'},
  {id: 'Lady', name: 'Lady'},
  {id: 'Sir', name: 'Sir'},
  {id: 'Dr', name: 'Dr'},
  {id: 'Lord', name: 'Lord'},
  {id: 'Other', name: 'Other'},
];

export interface PersonTitle {
  id: string;
  name: string;
}

export const MarketTypes = <MarketType[]> [
  {id: 'contactByEmail', name: 'Email', selected: false},
  {id: 'contactByPost', name: 'Post', selected: false},
  {id: 'contactByPhone', name: 'Phone', selected: false}
];

export interface MarketType {
  id: string;
  name: string;
  selected: boolean;

}
