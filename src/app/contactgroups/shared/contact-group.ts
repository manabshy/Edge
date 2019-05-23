import { Address } from 'src/app/core/models/address';
import { Person, BasicPerson } from 'src/app/core/models/person';
import { ResultData } from 'src/app/core/shared/result-data';

export interface ContactGroup {
  contactType: ContactType;
  contactGroupId: number;
  addressee: string;
  notes: ContactGroupsNote[];
  // notes?: string;
  contactPeople: Person[];
  title?: string;
  comments: string;
  salutation: string;
  companyId?: number;
  companyName: string;
  companyAddress: Address;
  referenceCount: number;
  relocationContactName?: string;
  isRelocationAgent: boolean;
  assignedContactType?: string;
  currentUserName?: string;
  currentStaffMemberId?: number;
  currentOfficeId?: number;
  rawData?: any;
}

export interface ContactAddress extends Address {
  postCode: string;
  countryId: number;
}
export interface ContactGroupsNote {
  contactGroupId: number;
  noteId: number;
  note: string;
  noteDateTime: string;
  noteType: string;
  isImportant: boolean;
  isPublic: boolean;
  currentUserName: string;
  currentStaffMemberId: number;
}

export interface AutoCompleteOption {
  isNameSearch: boolean;
  searchTerm: string;
  pageSize: number;
  page: number;
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

export interface ContactGroupAutoCompleteResult extends ContactGroupMetaDeta{
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
export const ContactGroupsTypes = new Map( [
  [ContactType.Individual,  'Individual/Joint'],
  [ContactType.Sharers,  'Multi/Sharer'],
  [ContactType.CompanyContact,  'Company Contact']
  // [ContactType.ReloContact,  'Relo Agent']
]);
export interface ContactGroupsType {
  id: string;
  name: string;
}
export interface ContactGroupAutoCompleteData extends ResultData {
  result: ContactGroupAutoCompleteResult[];
}
export interface PeopleAutoCompleteData extends ResultData {
  result: PeopleAutoCompleteResult[];
}
export interface ContactGroupData extends ResultData {
  result: ContactGroup;
}
export interface BasicContactGroupData extends ResultData {
  result: BasicContactGroup[];
}
export interface PersonContactData extends ResultData {
  result: Person;
}

export interface ContactGroupMetaDeta{
  indexVisibleContactGroup?: any;
  hiddenContactGroups?: any;
}

