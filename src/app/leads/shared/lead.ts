import { SubNavItem, SubNav } from "src/app/shared/subnav";
import { Address } from "src/app/shared/models/address";

export const LeadEditSubNav = ['properties','instructions', 'offers', 'searches', 'lettings-managements', 'home-helpers'];

export const LeadEditSubNavItems: SubNavItem[] = LeadEditSubNav.map(x => ({
  link: x,
  label: SubNav.subNavLabel(x),
  value: SubNav.subNavValue(x),
  params: []
}));

export interface Lead {
    leadId: number;
    personId: number;
    person: string;
    ownerId: number;
    owner: string;
    nextChaseDate?: any;
    dateClosed?: any;
    closedById?: any;
    closedBy?: any;
    leadTypeId: number;
    leadType: string;
    relatedProperty: LeadProperty;
    officeId: number;
    createdDate: Date;
    createdBy: number;
    updatedDate: Date;
    updatedBy: number;
}

export interface LeadSearchInfo {
    leadTypeId?: number;
    ownerId?: number;
    personId?: number;
    officeId?: number;
    dateFrom?: Date;
    dateTo?: Date;
    includeClosedLeads?: boolean;
    page: number;
    includeUnassignedLeadsOnly?: boolean;
    startLeadId?: number;
    leadSearchTerm?: any;
    allowPaging?: boolean;
}

export interface LeadProperty{
  propertyId: number;
  address: Address;
}
