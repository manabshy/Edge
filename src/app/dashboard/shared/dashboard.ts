import { ResultData } from 'src/app/core/shared/result-data';
import { Address } from 'src/app/core/models/address';

export interface Dashboard {
  period: string;
  periodStartDate: Date;
  periodEndDate: Date;
  valuations: DashboardNumbers;
  instructions: DashboardNumbers;
  applicants: DashboardNumbers;
  viewings: DashboardNumbers;
  offersAgreed: DashboardNumbers;
  offersReceived: DashboardNumbers;
  businessDevelopment: DashboardNumbers;
  exchanges: DashboardNumbers;
  pipeline: DashboardNumbers;
  liveTenancies: DashboardNumbers;
  staffMember: StaffMember;
}
export interface DashboardNumbers {
  periodCount?: number;
  periodFees?: number;
  periodPropertyCount?: number;
  periodReLetCount?: number;
  periodNewCount?: number;
  totalCount?: number;
  totalManagedCount?: number;
  totalFees?: number;
  totalPropertyCount?: number;
}
export interface StaffMember {
  staffMemberId: number;
  staffMemberFullName: string;
}
export interface DashboardResult extends ResultData {
  result: Dashboard;
}
export interface TeamDashboardResult extends ResultData {
  result: Dashboard[];
}

export interface DashboardTotals {
  applicants: number;
  viewings: number;
  offersAgreed: number;
  offersReceived: number;
  exchanges: number;
  pipeline: number;
}

export interface OffersResult extends ResultData {
  result: Offer[];
}
export interface PipelineResult extends ResultData {
  result: Pipeline[];
}
export interface InstructionResult extends ResultData {
  result: Instruction[];
}
export interface ApplicantResult extends ResultData {
  result: Applicant[];
}
// export interface Offer {
//   propertyId: number;
//   propertyLettingId: number;
//   propertySaleId: number;
//   valuationId: number;
//   propertyAddress: Address;
//   valuationDate: Date;
//   salesValue: number;
//   longLetValue: number;
//   shortLetValue: number;
// }

export enum InstructionStatus {
  All = 'All',
  Relet = 'ReLet',
  New = 'New'
}

export enum OfferStatus {
  All = 'All',
  OffersAgreed = 'OffersAgreed',
  OffersReceived = 'OffersReceived'
}

export interface Applicant {
  contactGroupId: number;
  contactGroupAddressee: string;
  minBedrooms: number;
  priceRangeMin: number;
  priceRangeMax: number;
  lastContactDate: string;
  regions: { regionName: string }[];
}

export interface BusinessDevelopment {
  businessDevelopmentId: number;
  callbackReminder: BusinessDevelopmentCallbackReminder;
  contact: BusinessDevelopmentContact;
  property: BusinessDevelopmentProperty;
  propertyLettingId: number;
  propertySaleId: number;
  reason: string;
  status: 'Let';
}

export interface BusinessDevelopmentCallbackReminder {
  callReminderDiaryEventId: number;
  callReminderEndDateTime: string;
  callReminderStartDateTime: string;
  hasReminder: boolean;
}

export interface BusinessDevelopmentContact {
  contactGroupId: number;
  contactGroupAddressee: string;
  contactGroupTelephone: string;
}

export interface BusinessDevelopmentProperty {
  propertyId: number;
  propertyAddress: string;
}

export interface Exchange {
  commissionFees: number;
  contactGroupAddressee: string;
  contactGroupId: number;
  exchangedDate: string;
  offerLettingId: number;
  offerLettingValue: number;
  offerSaleId: number;
  offerSaleValue: number;
  propertyAddress: string;
  propertyId: number;
  propertyLettingId: number;
  propertySaleId: number;
  status: string;
}

export interface Instruction {
  propertyId: number;
  propertyLettingId: number;
  propertySaleId: number;
  propertyAddress: string;
  contactGroupId: null;
  contactGroupAddressee: null;
  instructedDate: string;
  status: string;
  salesValue: number;
  longLetValue: number;
  shortLetValue: number;
}

export interface Valuation {
  propertyId: number;
  propertyLettingId: number;
  propertySaleId: number;
  propertyAddress: string;
  valuationId: number;
  saleStatus: string;
  lettingStatus: string;
  valuationDate: string;
  salesValue: number;
  longLetValue: number;
  shortLetValue: number;
}

export interface Viewing {
  contactGroupAddressee: string;
  contactGroupId: number;
  diaryEventDate: string;
  diaryEventId: number;
  eventType: string;
  propertyAddress: string;
  propertyId: number;
}

export interface Offer {
  contactGroupAddressee: string;
  contactGroupId: number;
  offerDate: string;
  offerLettingId: number;
  offerLettingInstanceId: number;
  offerLettingsValue: number;
  offerSaleId: number;
  offerSaleInstanceId: number;
  offerSalesValue: number;
  propertyAddress: string;
  propertyId: number;
  propertyLettingId: number;
  propertySaleId: number;
  status: string;
}

export interface Pipeline {
  propertyId: number;
  propertyLettingId: number;
  propertySaleId: number;
  propertyAddress: string;
  contactGroupId: number;
  contactGroupAddressee: string;
  propertyStatus: string;
  offerSalesId: number;
  offerLettingsId: number;
  offerAgreedDate: string;
  offerSalesValue: number;
  offerLettingsValue: number;
  commissionFees: number;
}

export interface Tenancy {
  isManaged: boolean;
  propertyId: number;
  propertyLettingId: number;
  propertyAddress: string;
  contactGroupId: number;
  contactGroupAddressee: string;
  status: string;
  tenancyStartDate: string;
}

export interface BDTicketHistory {
  businessDevelopmentId: number;
  callReminderStartDateTime: string;
  contactGroupAddressee: string;
  isAssociated: boolean;
  isOpen: boolean;
  propertyId: number;
  propertyLettingId: number;
  propertyLettingStatus: string;
  propertySaleId: number;
  propertySaleStatus: string;
}

export enum ApiPeriods {
  Week = 'ThisWeek',
  Month = 'ThisMonth',
  Quarter = 'ThisQuarter',
  Year = 'ThisYear',
  All = 'All'
}

export enum OfferLettingStatus{
  OfferReceived = 1,
  OfferNotAgreed = 2,
  OfferAgreed = 4,
  FallenThrough = 8,
  Exchanged = 12,
  Let = 16,
  LetEnded = 32
}
export enum OfferSaleStatus{
  OfferReceived = 1,
  OfferNotAgreed = 2,
  SaleAgreed = 4,
  SaleAgreedCR = 8,
  SaleFallenThrough = 16,
  Exchanged = 32,
  Completed = 64,
  FailedToComplete = 128
}
