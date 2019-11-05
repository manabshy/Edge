export interface Lead {
    leadId: number;
    personId: number;
    ownerId: number;
    nextChaseDate?: any;
    dateClosed?: any;
    closedById?: any;
    leadTypeId: number;
    relatedPropertyEventId: number;
    officeId: number;
    createdDate: Date;
    createdBy: number;
    updatedDate: Date;
    updatedBy: number;
}
