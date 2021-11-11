import { StaffMember } from './../../shared/models/staff-member'
import { DiaryEvent } from 'src/app/diary/shared/diary'
import { BaseRequestOption } from 'src/app/shared/models/base-request-option'
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member'
import { Property } from 'src/app/property/shared/property'
import { Office } from 'src/app/shared/models/staff-member'
import { EdgeFile } from 'src/app/shared/models/edgeFile'
import { BaseNote, Signer } from 'src/app/contact-groups/shared/contact-group'

export interface ValuationInfo {
  reason?: string
  timeFrame?: string
  generalNotes?: string
}
export interface Valuation extends ValuationInfo {
  valuationEventId?: number
  valuationStatus?: number
  valuationStatusDescription?: string
  officeId?: number
  valuationStatusLabel?: string
  property?: Property
  salesValuer?: BaseStaffMember
  lettingsValuer?: BaseStaffMember
  valuationDate?: Date
  propertyOwner?: Signer
  diaryEvent?: DiaryEvent
  bedrooms?: number
  bathrooms?: number
  receptions?: number
  sqFt?: number
  tenureId?: number
  originId?: number
  bookedBy?: StaffMember
  bookedById?: number
  originTypeId?: number
  approxLeaseExpiryDate?: Date
  outsideSpace?: any
  parking?: any
  propertyFeature?: number[]
  otherFeatures?: number[]
  diaryEventId?: number
  startDateTime?: Date
  endDateTime?: Date
  startTime?: string
  totalHours?: number
  suggestedAskingPrice?: number
  suggestedAskingRentLongLet?: number
  suggestedAskingRentShortLet?: number
  suggestedAskingRentLongLetMonthly?: number
  suggestedAskingRentShortLetMonthly?: number
  createdDate?: Date
  createdBy?: BaseStaffMember
  isActive?: boolean
  isExpired?: boolean
  section21StatusId?: number
  declarableInterest?: boolean
  meetingOwner?: boolean
  combinedValuationBooking?: ValuationBooking
  salesValuationBooking?: ValuationBooking
  lettingsValuationBooking?: ValuationBooking
  queryResultCount?: number
  isPowerOfAttorney?: boolean
  ccOwner?: boolean
  adminContact?: Signer
  eSignSignatureTob?: eSignTermsOfBusinessDoc
  valuationType?: ValuationTypeEnum
  dateRequestSent?: Date
  cancellationReason?: string
  cancelledBy?: StaffMember
  cancelledDate?: Date
  cancellationTypeId?: number
  valuationContactNote?: valuationNote
  ownerConfirmed?: number
  deedLandRegFiles?: EdgeFile[]
  leaseLandRegFiles?: EdgeFile[]
  nameChangeRegFiles?: EdgeFile[]
  userEnteredOwner?: string
  leaseExpiryDate?: Date
  complianceCheck?: ComplianceChecksStatus
  personDocuments?: any
  companyDocuments?: any
  lockDate?: Date
}

export interface eSignTermsOfBusinessDoc {
  toBLetting?: ToBDocument
  toBSale?: ToBDocument
  dateRequestSent: Date
}

export interface ToBDocument {
  isLongLetInstruction?: boolean
  isManagement?: boolean
  isShortLetInstruction?: boolean
  signatureFile: EdgeFile
  signedOn?: Date
  zeroDepositAccepted?: boolean
  instructionPriceDirection?: number
  salesAgencyTypeId?: number
  gasCertRequired: boolean
}

export interface ComplianceChecksStatus {
  compliancePassedByFullName: string
  compliancePassedDate: string
}

export interface ValuationPricingInfo {
  suggestedAskingRentLongLetMonthly?: number
  suggestedAskingRentShortLetMonthly?: number
}

export interface ValuationFile {
  blobFileTypeId: number
  fileLastModified: Date
  fileUri: string
}

export interface ValuationPropertyInfo {
  propertyId: number
  bedrooms: number
  bathrooms: number
  receptions: number
  sqFt: number
  tenureId: number
  approxLeaseExpiryDate?: any
  parking?: any
  outsideSpace?: any
  propertyFeature?: any
  valuers: BaseStaffMember[]
}

export interface OfficeMember {
  office: Office
  staffMembers: BaseStaffMember[]
}

export interface Valuer {
  sales: OfficeMember[]
  lettings: OfficeMember[]
}
export interface ValuationStaffMembersCalanderEvents {
  thisWeek: Date[]
  nextWeek: Date[]
  next2Weeks: Date[]
}
export interface CalendarAvailibility {
  availableDates: ValuationStaffMembersCalanderEvents[]
}
export interface ValuersAvailabilityOption extends BaseRequestOption {
  fromDate?: string
  lettingsValuerId?: number
  salesValuerId?: number
}
export interface ValuationRequestOption extends BaseRequestOption {
  status?: number[]
  date?: string
  valuerId?: number[]
  officeId?: number[]
}

export interface ValuationBooking {
  valuationBookingId?: number
  diaryEventId?: number
  name?: string
  emailAddress?: string
  contactNumber?: string
  associationId?: number
  meetingOwner?: boolean
  startDateTime?: Date
  totalHours?: number
}

export interface valuationNote extends BaseNote {
  dateLastUpdated?: Date
  lastUpdatedByFullName?: string
  contactGroupId?: number
  valuationEventId?: number
}

export interface CancelValuation {
  valuationEventId?: number
  typeId?: number
  reason?: string
}

export interface ValuationStatus {
  id: number
  value: string
}

export const ValuationStatuses = <ValuationStatus[]>[
  { id: 2, value: 'Booked' },
  { id: 3, value: 'Valued' },
  { id: 4, value: 'Instructed' },
  { id: 5, value: 'Cancelled' },
  { id: 6, value: 'Closed' }
]

export enum ValuationStatusEnum {
  None = 0,
  Booked = 2,
  Valued = 3,
  Instructed = 4,
  Cancelled = 5,
  Closed = 6
}

export enum ValuationCancellationReasons {
  Tenant_refusing_access = 1,
  Gone_with_another_agent = 2,
  No_show_no_contact = 3,
  Change_of_circumstance = 4,
  Agent_not_allowing_access = 5,
  Did_not_want_sales_or_lettings_val = 6,
  Other = 7
}

export enum ValuationTypeEnum {
  None = 0,
  Sales = 1,
  Lettings = 2
}

export enum ValuationActions {
  addAdmin = 0,
  removeAdmin = 1,
  salesTermsofBusiness = 2,
  lettingsTermsofBusiness = 3,
  landLordQuestionnaire = 4,
  vendorQuestionnaire = 5,
  cancelValuation = 6
}

export function getValuationStatuses() {
  return Object.keys(ValuationStatusEnum).filter((type) => isNaN(<any>type))
}

export enum SalesAgencyTypeEnum {
  Sole = 1,
  Multi = 4
}

export enum LettingsAgencyTypeEnum {
  Sole = 1,
  Multi = 2
}
