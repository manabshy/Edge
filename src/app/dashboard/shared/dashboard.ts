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

export interface Offer {
  propertyId: number;
  propertyLettingId: number;
  propertySaleId: number;
  valuationId: number;
  propertyAddress: Address;
  valuationDate: Date;
  salesValue: number;
  longLetValue: number;
  shortLetValue: number;
}
