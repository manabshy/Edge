import { Signer } from "src/app/contactgroups/shared/contact-group";
import { DiaryEvent } from "src/app/diary/shared/diary";
import { BaseProperty } from "src/app/shared/models/base-property";
import { BaseRequestOption } from "src/app/shared/models/base-request-option";
import { BaseStaffMember } from "src/app/shared/models/base-staff-member";
import { Property } from "src/app/property/shared/property";
import { Office } from "src/app/shared/models/staff-member";

export interface ValuationInfo {
  reason: string;
  timeFrame: string;
  generalNotes: string;
}
export interface Valuation extends ValuationInfo {
  valuationEventId: number;
  valuationStatus: number;
  officeId: number;
  valuationStatusLabel: string;
  property: Property;
  salesValuer?: BaseStaffMember;
  lettingsValuer?: BaseStaffMember;
  valuationDate?: Date;
  propertyOwner?: Signer;
  diaryEvent: DiaryEvent;
  bedrooms?: number;
  bathrooms?: number;
  receptions?: number;
  sqFt?: number;
  tenureId: number;
  originId: number;
  approxLeaseExpiryDate: Date;
  outsideSpace: string;
  parking: string;
  propertyFeature: string;
  diaryEventId: number;
  startDateTime: Date;
  endDateTime: Date;
  startTime: string;
  totalHours: number;
  suggestedAskingPrice?: number;
  suggestedAskingRentLongLet?: number;
  suggestedAskingRentShortLet?: number;
  suggestedAskingRentLongLetMonthly?: number;
  suggestedAskingRentShortLetMonthly?: number;
  createdDate: Date;
  createdBy: BaseStaffMember;
  isActive?: boolean;
  isExpired?: boolean;
  section21StatusId?: number;
  declarableInterest?: boolean;
}

export interface ValuationPropertyInfo {
  propertyId: number;
  bedrooms: number;
  bathrooms: number;
  receptions: number;
  sqFt: number;
  tenureId: number;
  approxLeaseExpiryDate?: any;
  parking?: any;
  outsideSpace?: any;
  propertyFeature?: any;
  valuers: BaseStaffMember[];
}
export interface OfficeMember {
  office: Office;
  staffMembers: BaseStaffMember[];
}

export interface Valuer {
  sales: OfficeMember[];
  lettings: OfficeMember[];
}
export interface ValuationStaffMembersCalanderEvents {
  thisWeek: Date[];
  nextWeek: Date[];
  next2Weeks: Date[];
}
export interface CalendarAvailibility {
  availableDates: ValuationStaffMembersCalanderEvents[];
}
export interface ValuersAvailabilityOption extends BaseRequestOption {
  fromDate?: string;
  staffMemberId1?: number;
  staffMemberId2?: number;
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
  { id: 2, value: "Booked" },
  { id: 3, value: "Valued" },
  { id: 4, value: "Instructed" },
  { id: 5, value: "Cancelled" },
];

export enum ValuationStatusEnum {
  None = 0,
  Booked = 2,
  Valued = 3,
  Instructed = 4,
  Cancelled = 5,
}

export function getValuationStatuses() {
  return Object.keys(ValuationStatusEnum).filter((type) => isNaN(<any>type));
}
