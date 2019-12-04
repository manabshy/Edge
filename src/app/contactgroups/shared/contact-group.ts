import { Address } from 'src/app/shared/models/address';
import { Person, BasicPerson, PersonWarning } from 'src/app/shared/models/person';
import { ResultData } from 'src/app/shared/result-data';
import { SubNavItem, SubNav } from 'src/app/shared/subnav';

export interface ContactGroup {
  contactType: ContactType;
  contactGroupId: number;
  addressee: string;
  notes: ContactNote[];
  contactNotes: ContactNote[];
  // notes?: string;
  contactPeople: Person[];
  title?: string;
  comments: string;
  salutation: string;
  companyId?: number;
  companyName: string;
  companyAddress: Address;
  referenceCount: number;
  isSolicitor: boolean;
  isInventoryClerk: boolean;
  isEstateAgent: boolean;
  isMortgageAdvisor: boolean;
  relocationContactName?: string;
  isRelocationAgent: boolean;
  assignedContactType?: string;
  currentUserName?: string;
  currentStaffMemberId?: number;
  currentOfficeId?: number;
  rawData?: any;
  companyAmlCompletedDate?: string;
  isAmlCompleted: boolean;
}
export const ContactGroupDetailsSubNav = ['properties', 'leads', 'instructions', 'offers', 'searches', 'lettings-managements', 'home-helpers'];
// export const ContactGroupDetailsSubNav = ['notes','leads','searches','valuations', 'instructions', 'offers', 'tenancies', 'lettings-managements', 'home-managements'];

export const ContactGroupDetailsSubNavItems: SubNavItem[] = ContactGroupDetailsSubNav.map(x => ({
  link: x,
  label: SubNav.subNavLabel(x),
  value: SubNav.subNavValue(x),
}));



export interface Signer {
  contactGroupId: number;
  contactNames: string;
  companyName: string;
  phoneNumber: string;
  emailAddress: string;
}
export class SignerRequest {
  searchTerm: string;
  isSolicitor: boolean;
  isRelocationAgent: boolean;
  isMortgageAdvisor: boolean;
  isEstateAgent: boolean;
  isInventoryClerk: boolean;
}
export interface Summary {
  active: number;
  total: number;
}
export interface PersonSummaryFigures {
  personId: number;
  leads: number;
  notes: number;
  searches: number;
  valuations: Summary;
  instructions: Summary;
  offers: Summary;
  tenancies: Summary;
  lettingsManagements: number;
  homeManagements: number;
}
export interface Company {
  companyId: number;
  companyName: string;
  companyTypeId: CompanyTypeId;
  signer: Signer;
  companyContacts: BasicContactGroup[];
  companyAddress: Address;
  telephone: string;
  fax: string;
  website: string;
  email: string;
  amlCompleted: boolean;
  amlCompletedDate?: Date;
}

export interface ContactAddress extends Address {
  postCode: string;
  countryId: number;
}
export interface BaseNote {
  id: number;
  text: string;
  isImportant: boolean;
  isPinned: boolean;
  createDate: Date;
  createdBy: number;
}
export interface ContactNote extends BaseNote {
  contactGroupId?: number;
  personId?: number;
}
export interface PersonNote extends BaseNote {
  personId: number;
}

export interface AutoCompleteResult {
  contactGroupId: number;
  contactTypeId: number;
  firstName: string;
  surname: string;
  titleOther: string;
  number: string;
  email: string;
  addressee: string;
  titleId: number;
  companyId: number;
  companyName: string;
}
export interface CompanyAutoCompleteResult extends Company {
  matchScore: number;
  companyId: number;
  companyName: string;
}

export interface ContactGroupAutoCompleteResult extends PersonWarning {
  personId: number;
  title: string;
  firstName: string;
  middleNames: string;
  lastName: string;
  fullName: string;
  addressee: string;
  salution: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  outcode: string;
  incode: string;
  postCode: string;
  warningStatusId: number;
  warningStatusComment: string;
  contactGroups: BasicContactGroup[];
}
export interface PeopleAutoCompleteResult {
  personId: number;
  title: string;
  firstName: string;
  middleNames: string;
  lastName: string;
  fullName: string;
  addressee: string;
  salution: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  matchScore: number;
  matchType: string;
  ranking: number;
}

export interface BasicContactGroup {
  contactGroupId: number;
  isCompany: boolean;
  companyId?: number;
  companyName: string;
  contactPeople: Person[];
}
export enum ContactType {
  Individual = 1,
  Sharers = 2,
  CompanyContact = 4,
  ReloContact = 8
}
export const ContactGroupsTypes = new Map([
  [ContactType.Individual, 'Individual/Joint'],
  [ContactType.Sharers, 'Multi/Sharer'],
  [ContactType.CompanyContact, 'Company Contact']
]);
export interface ContactGroupsType {
  id: string;
  name: string;
}
export enum CompanyTypeId {
  Company = 1,
  OtherAgent = 2,
  PropertyDeveloper = 16,
  ReloAgent = 4,
  Tradesmen = 8
}
export interface CompanyContactDetails {
  telephone: string;
  fax: string;
  website: string;
  email: string;
}
export interface CompanyContactGroupAutoCompleteData extends ResultData {
  result: CompanyAutoCompleteResult[];
}
export interface ContactGroupAutoCompleteData extends ResultData {
  result: ContactGroupAutoCompleteResult[];
}
export interface SignerAutoCompleteData extends ResultData {
  result: Signer[];
}
export interface SignerData extends ResultData {
  result: Signer;
}
export interface PeopleAutoCompleteData extends ResultData {
  result: PeopleAutoCompleteResult[];
}
export interface PeopleAutoCompleteData2 extends ResultData {
  result: PotentialDuplicateResult;
}
export interface PotentialDuplicateResult {
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  matches: PeopleAutoCompleteResult[];
}
export interface CompanyData extends ResultData {
  result: Company;
}
export interface ContactGroupData extends ResultData {
  result: ContactGroup;
}
export interface BasicContactGroupData extends ResultData {
  result: BasicContactGroup[];
}
export interface PersonSummaryFiguresData extends ResultData {
  result: PersonSummaryFigures;
}

export interface PersonContactData extends ResultData {
  result: Person;
}
export interface ContactNoteData extends ResultData {
  result: ContactNote[];
}
export interface PersonNoteData extends ResultData {
  result: PersonNote[];
}

