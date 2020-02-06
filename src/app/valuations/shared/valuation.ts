import { Property, PropertyInfo } from 'src/app/property/shared/property';
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member';
import { DiaryEvent } from 'src/app/diary/shared/diary';
import { Person } from 'src/app/shared/models/person';
import { BaseRequestOption } from 'src/app/shared/models/base-request-option';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { BaseProperty } from 'src/app/shared/models/base-property';
import { StaffMember } from 'src/app/shared/models/staff-member';

export interface ValuationInfo {
  reason: string;
  timeFrame: string;
  marketChat: string;
  generalNotes: string;
}
export interface Valuation extends ValuationInfo {
  valuationEventId: number;
  valuationStatus: number;
  valuationStatusLabel: string;
  property: BaseProperty;
  valuer: BaseStaffMember;
  valuationDate?: Date;
  propertyOwner?: Signer;
  diaryEvent: DiaryEvent;
  bedrooms?: number;
  bathrooms?: number;
  receptions?: number;
  sqFt?: number;
  tenureId: number;
  approxLeaseExpiryDate: Date;
  outsideSpace: string;
  parking: string;
  propertyFeature: string;
  diaryEventId: number;
  startDateTime: Date;
  endDateTime: Date;
  startTime: string;
  totalHours: number;
  attendees: BaseStaffMember[];
  suggestedAskingPrice?: number;
  suggestedAskingRentLongLet?: number;
  suggestedAskingRentShortLet?: number;
  suggestedAskingRentLongLetMonthly?: number;
  suggestedAskingRentShortLetMonthly?: number;
  createdDate: Date;
  createdBy: BaseStaffMember;
  isActive?: boolean;
}

export interface ValuationRequestOption extends BaseRequestOption {
  status?: number;
  date?: string;
  valuerId?: number;
  officeId?: number;
}

export interface ValuationStatus {
  id: number;
  value: string;
}

export const ValuationStatuses = <ValuationStatus[]>[
  { id: 1, value: 'Incomplete' },
  { id: 2, value: 'Invited' },
  { id: 3, value: 'Valued' }
];

export enum ValuationStatusEnum {
  None = 0,
  Incomplete = 1,
  Invited = 2,
  Valued = 3
}

export function getValuationStatuses() {
  return Object.keys(ValuationStatusEnum).filter(
    (type) => isNaN(<any>type)
  );
}
