import { SubNavItem, SubNav } from "src/app/shared/subnav";
import { Address } from "src/app/shared/models/address";

export const LeadEditSubNav = [
  "properties",
  "leads",
  "valuations",
  "instructions",
  "searches",
  "offers",
  "lettings-managements",
  "home-helpers",
];

export const LeadEditSubNavItems: SubNavItem[] = LeadEditSubNav.map((x) => ({
  link: x,
  label: SubNav.subNavLabel(x),
  value: SubNav.subNavValue(x),
  params: [],
}));

export interface Lead {
  leadId: number;
  personId: number;
  person: string;
  ownerId: number;
  owner: string;
  nextChaseDate?: Date;
  dateClosed?: any;
  closedById?: any;
  closedBy?: any;
  leadTypeId: number;
  leadTypeIds?: number[];
  leadType: string;
  relatedProperty: LeadProperty;
  isPropertyOwner?: boolean;
  officeId: number;
  officeIds?: number[];
  createdDate: Date;
  createdBy: number;
  updatedDate: Date;
  updatedBy: number;
  isChecked?: boolean;
  isClosed?: boolean;
  leadsQueryCount?: number;
}

export interface LeadSearchInfo {
  leadTypeId?: number;
  leadTypeIds?: number[];
  ownerId?: number;
  personId?: number;
  officeId?: number;
  officeIds?: number[];
  dateFrom?: Date;
  dateTo?: Date;
  listingType?: number;
  includeClosedLeads?: boolean;
  page: number;
  includeUnassignedLeadsOnly?: boolean;
  startLeadId?: number;
  leadSearchTerm?: any;
  allowPaging?: boolean;
}

export interface LeadProperty {
  propertyId: number;
  address: Address;
}

export enum ListingType {
  MyLeads = 1,
  OtherUserLeads = 2,
  UnassignedLeads = 4,
}
