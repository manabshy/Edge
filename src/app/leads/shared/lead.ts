import { SubNavItem, SubNav } from "src/app/core/shared/subnav";

export const LeadEditSubNav = ['instructions', 'offers', 'searches', 'lettings-managements', 'home-helpers'];

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
    relatedPropertyEventId: number;
    officeId: number;
    createdDate: Date;
    createdBy: number;
    updatedDate: Date;
    updatedBy: number;
}

export interface LeadSearchInfo {
    leadTypeId?: number;
    ownerId?: number;
    officeId?: number;
    dateFrom?: Date;
    dateTo?: Date;
    includeClosedLeads?: boolean;
    page: number;
    includeUnassignedLeadsOnly?: boolean;
    startLeadId?: number;
    searchTerm?: any;
}
