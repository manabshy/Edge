import { Address } from 'src/app/core/models/address';
import { Person } from 'src/app/core/models/person';
import { ResultData } from 'src/app/core/shared/result-data';

export interface ContactGroup {
  contactType: string;
  contactGroupId: number;
  addressee: string;
  notes: ContactGroupsNote[];
  // notes?: string;
  people: Person[];
  title?: string;
  comments: string;
  salutation: string;
  companyId?: number;
  companyName: string;
  companyAddress: Address;
  relocationContactName?: string;
  relocationAgent?: ContactGroup;
  assignedContactType?: string;
  currentUserName?: string;
  currentStaffMemberId?: number;
  currentOfficeId?: number;
  rawData?: any;
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
  emailAddresses: string[];
  phoneNumbers: string[];
  outcode: string;
  incode: string;
  postCode: string;
  contactGroups: AutoCompleteContactGroup[];
}
export interface AutoCompleteContactGroup {
  contactGroupId: number;
  isCompany: boolean;
  companyId?: number;
  companyName: string;
  contactPeople: string[];
}

export interface ContactGroupAutoCompleteData extends ResultData {
  result: ContactGroupAutoCompleteResult[];
}

export interface ContactGroupMetaDeta{
  indexVisibleContactGroup?: any;
  hiddenContactGroups?: any;
}

