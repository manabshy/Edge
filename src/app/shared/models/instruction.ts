export interface Instruction {
  valuationEventId: number;
  agencyType: string;
  askingPrice?: number;
  askingRentLongLet?: number;
  askingRentShortLet?: number;
  askingRentLongLetMonthly?: number;
  askingRentShortLetMonthly?: number;
}
