export interface Instruction {
  valuationEventId: number;
  instructionType: string;
  askingPrice?: number;
  askingRentLongLet?: number;
  askingRentShortLet?: number;
  askingRentLongLetMonthly?: number;
  askingRentShortLetMonthly?: number;
}
