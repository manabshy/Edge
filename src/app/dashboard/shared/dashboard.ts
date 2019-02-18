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
