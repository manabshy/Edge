import { ResultData } from "src/app/shared/result-data";
import { Address } from "src/app/shared/models/address";

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
  staffMember: BasicStaffMember;
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
export interface BasicStaffMember {
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
  status: "Let";
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

export enum Tiles {
  AllInstructions = "All Instructions",
  Applicants = "All applicants",
  BusinessDevelopment = "Business Development",
  Exchanges = "Exchanges",
  Instructions = "Instructions",
  LiveTenancies = "Live Tenancies",
  Managed = "Managed",
  NewInstructions = "New Instructions",
  OffersAgreed = "Offers Agreed",
  OffersReceived = "Offers Received",
  Pipeline = "Pipeline",
  ReletInstructions = "Relet Instructions",
  Valuations = "Valuations",
  Viewings = "Viewings",
}

export enum InstructionStatus {
  All = "All",
  Relet = "ReLet",
  New = "New",
}

export enum OfferStatus {
  All = "All",
  OffersAgreed = "OffersAgreed",
  OffersReceived = "OffersReceived",
}

/**
 * Tiles available to the sales manager
 */
export const SalesManagerTiles = [
  [Tiles.Valuations, Tiles.Instructions],
  [Tiles.BusinessDevelopment, Tiles.AllInstructions],
  [Tiles.Exchanges, Tiles.Pipeline],
];

/**
 * Available team metrics for the sales manager
 */
export const SalesManagerTeamTiles = [
  Tiles.Valuations,
  Tiles.Instructions,
  Tiles.BusinessDevelopment,
  Tiles.AllInstructions,
  Tiles.Exchanges,
  Tiles.Pipeline,
];

/**
 * Tiles available to the lettings manager
 */
export const LettingsManagerTiles = [
  [Tiles.Valuations, Tiles.NewInstructions, Tiles.ReletInstructions],
  [Tiles.BusinessDevelopment, Tiles.AllInstructions],
  [Tiles.Exchanges, Tiles.Pipeline],
  [Tiles.LiveTenancies],
];

/**
 * Available metrics for the lettings manager
 */
export const LettingsManagerTeamTiles = [
  Tiles.Valuations,
  Tiles.NewInstructions,
  Tiles.ReletInstructions,
  Tiles.BusinessDevelopment,
  Tiles.AllInstructions,
  Tiles.Exchanges,
  Tiles.Pipeline,
  Tiles.LiveTenancies,
];

/**
 * Tiles available to the negotiator
 */
export const NegotiatorTiles = [
  [Tiles.Applicants, Tiles.Viewings],
  [Tiles.OffersReceived, Tiles.OffersAgreed],
  [Tiles.Exchanges, Tiles.Pipeline],
];

/**
 * Available metrics for the lettings manager
 */
export const NegotiatorTeamTiles = [
  Tiles.Applicants,
  Tiles.Viewings,
  Tiles.OffersReceived,
  Tiles.OffersAgreed,
  Tiles.Exchanges,
  Tiles.Pipeline,
];

export interface ReportingMonth {
  endDate: Date;
  month: number;
  startDate: Date;
  year: number;
}

export enum PeriodsEnum {
  Today = "Today",
  ThisWeek = "ThisWeek",
  ThisMonth = "ThisMonth",
  ThisQuarter = "ThisQuarter",
  ThisYear = "ThisYear",
  Custom = "Custom",
}

export const Periods = new Map([[PeriodsEnum.ThisWeek, "This Week"]]);

export const PeriodList = [
  { value: "Today", name: "Today" },
  { value: "ThisWeek", name: "This Week" },
  { value: "ThisMonth", name: "This Month" },
  { value: "ThisQuarter", name: "This Quarter" },
  { value: "ThisYear", name: "This Year" },
  { value: "Custom", name: "Custom" },
];

export const roleOptions = [
  { value: "10", name: "Sales" },
  { value: "11", name: "Lettings" },
  { value: "60", name: "CS" },
];

export const Roles = [
  { value: 1, name: "Manager" },
  { value: 2, name: "Broker" },
  { value: 3, name: "Negotiator" },
];

export enum LeaderboardRankingViewEnum {
  DefaultView = 0,
  ManagerView = 1,
  BrokerView = 2,
  NegView = 3,
}

export enum OfferLettingStatus {
  OfferReceived = 1,
  OfferNotAgreed = 2,
  OfferAgreed = 4,
  FallenThrough = 8,
  Exchanged = 12,
  Let = 16,
  LetEnded = 32,
}
export enum OfferSaleStatus {
  OfferReceived = 1,
  OfferNotAgreed = 2,
  SaleAgreed = 4,
  SaleAgreedCR = 8,
  SaleFallenThrough = 16,
  Exchanged = 32,
  Completed = 64,
  FailedToComplete = 128,
}
