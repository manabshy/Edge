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
}
