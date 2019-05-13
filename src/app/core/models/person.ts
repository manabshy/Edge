import { Address } from './address';

export interface Person {
  personId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  titleId: TitleId;
  titleOther?: string;
  emailAddresses: Email[];
  phoneNumbers: PhoneNumber[];
  address: Address;
  isMainPerson: boolean;
  contactByEmail: boolean;
  contactByPhone: boolean;
  contactByPost: boolean;
  currentUserName: string;
  currentStaffMemberID: number;
  currentOfficeId?: number;
  amlCompleted: boolean;
  amlCompletedDate?: Date;
  marketingPreferences: MarketingPreferences;
  neverMarket: boolean;
  uKResident: boolean;
  addressFull: string;
  rawData: any;
}

export interface BasicPerson{
  personId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  title: string;
}
export interface Email {
  emailId: number;
  email: string;
  isPrimaryWebEmail: boolean;
  orderNumber: number;
}

export interface PhoneNumber {
  phoneNumberId: number;
  isPreferred: boolean;
  number: string;
  orderNumber: number;
  telephoneTypeId: TelephoneTypeId;
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
export interface MarketingPreferences {
  marketBulletin: boolean;
  events: boolean;
  newHomes: boolean;
  offerSurveys: boolean;
  general: boolean;
  count: number;
}

export enum TitleId {
  Mr = 1,
  Mrs = 2,
  Miss = 3,
  Ms = 4,
  Lady = 5,
  Sir = 6,
  Dr = 7,
  Lord = 8,
  Other = 100
}
export enum TelephoneTypeId {
  Home = 1,
  Work = 2,
  Mobile = 3,
  Fax = 4,
  Other = 5
}
export const PhoneTypes = <PhoneType[]> [
  { id: 1, name: 'Home', valueStr: 'Home'},
  { id: 2, name: 'Work', valueStr: 'Work'},
  { id: 3, name: 'Mobile', valueStr: 'Mobile'},
  { id: 4, name: 'Fax', valueStr: 'Fax'},
  { id: 5, name: 'Other', valueStr: 'Other'}
];
