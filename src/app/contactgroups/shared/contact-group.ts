import { Address } from 'src/app/core/models/address';
import { Person } from 'src/app/core/models/person';

export interface ContactGroup {
  contactType: string;
  contactGroupId: number;
  addressee: string;
  notes: ContactGroupsNote[];
  companyAddress: Address;
  people: Person[];
  title?: string;
  comments: string;
  salutation: string;
  companyId: number;
  companyName: string;
  relocationContactName?: string;
  relocationAgent?: ContactGroup;
  currentUserName?: string;
  currentStaffMemberId?: number;
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
