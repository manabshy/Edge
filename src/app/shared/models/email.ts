export interface PropertyLink {
  propertyId?: number;
  propertyEventId?: number;
  propertyEventType?: number;
}

export interface EmailInfo {
  contactId?: number;
  personId?: number;
  staffMemberId?: number;
  emailAddress?: string;
}

export interface Email {
  senderEmail: string;
  subject: string;
  body: string;
  propertyLink?: PropertyLink;
  recipientEmail: EmailInfo[];
  ccExternalEmail: EmailInfo[];
  ccInternalEmail: EmailInfo[];
}
