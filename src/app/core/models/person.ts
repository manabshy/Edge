import { Address } from './address';
import { ContactNote } from 'src/app/contactgroups/shared/contact-group';

export interface Person extends PersonWarning{
  personId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  addressee: string;
  salutation: string;
  titleId: TitleId;
  title?: string;
  titleOther?: string;
  emailAddresses: Email[];
  phoneNumbers: PhoneNumber[];
  personNotes: ContactNote[];
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
  isNewPerson: boolean;
  warningStatusId: number;
  warningStatusComment: string;
}

export interface PersonWarning {
  warning: any;
}

export interface BasicPerson {
  personId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  title: string;
  emailAddress: string;
  phoneNumber: string;
  emailAddresses: Email[];
  phoneNumbers: PhoneNumber[];
}
export interface Email {
  id?: number;
  email: string;
  orderNumber: number;
  isPreferred: boolean;
  isPrimaryWebEmail: boolean;
}

export interface PhoneNumber {
  id?: number;
  typeId: TelephoneTypeId;
  number: string;
  orderNumber: number;
  sendSMS: boolean;
  isPreferred: boolean;
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
export interface SmsInfo {
  personId: string;
  phoneNumber: string;
  header: string;
  message: string;
  senderName: string;
  senderPhoneNumber: string;
}
export interface PersonOffer {
  propertyAddress: Address;
}
export interface PersonInstruction {
  propertyAddress: Address;
}
export interface PersonSearch {
  propertyAddress: Address;
}
export interface PersonLettingsManagement {
  propertyAddress: Address;
}
export interface PersonHomeManagement {
  propertyAddress: Address;
}
export interface PersonSearch {
  lettingsRequirementId: number;
  salesRequirementId?: any;
  maxAmount: number;
  minBeds: number;
  createDate: Date;
  staffMember: string;
  areas: string;
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
  {id: 'contactByEmail', name: 'Email', selected: true},
  {id: 'contactByPost', name: 'Post', selected: false},
  {id: 'contactByPhone', name: 'Phone', selected: true}
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
  offersSurveys: boolean;
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
export const Titles  = new Map<number, string>([
  [TitleId.Mr, 'Mr'],
]);

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
