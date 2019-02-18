export interface Dashboard {
  Period: string;
  PeriodStartDate: Date;
  PeriodEndDate: Date;
  Valuations: DashboardNumbers;
  Instructions: DashboardNumbers;
  Applicants: DashboardNumbers;
  Viewings: DashboardNumbers;
  OffersAgreed: DashboardNumbers;
  OffersReceived: DashboardNumbers;
  BusinessDevelopment: DashboardNumbers;
  Exchanges: DashboardNumbers;
  Pipeline: DashboardNumbers;
  LiveTenancies: DashboardNumbers;
}
export interface DashboardNumbers {
  PeriodCount?: number;
  PeriodFees?: number;
  PeriodPropertyCount?: number;
  PeriodReLetCount?: number;
  PeriodNewCount?: number;
  TotalCount?: number;
  TotalManagedCount?: number;
  TotalFees?: number;
  TotalPropertyCount?: number;
}
