export interface Instruction {
  valuationEventId: number;
  salesInstructionEventId?: number;
  lettingsInstructionEventId?: number;
  askingPrice?: number;
  askingRentLongLet?: number;
  askingRentShortLet?: number;
  askingRentLongLetMonthly?: number;
  askingRentShortLetMonthly?: number;
  agencyType: string;
}
