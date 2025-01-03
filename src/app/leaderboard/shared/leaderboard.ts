export interface Leaderboard {
  staffMemberId: number;
  fullName: string;
  totalFees: number;
  totalCount: number;
  managedCount: number;
}

export interface LeaderboardResult {
  result: Leaderboard[];
  resultCount: number;
  resultDescription: [];
  returnCode: number;
  status: true;
  page: number;
  totalPages: number;
  totalResultCount: number;
}
export enum LeaderboardSort {
  Fees,
  TotalCount
}
export enum Period {
  ThisWeek,
  ThisMonth,
  ThisQuarter,
  ThisYear,
}
// export enum Period {
//   ThisWeek = 'This Week',
//   ThisMonth = 'This Month',
//   ThisQuarter = 'This Quarter',
//   ThisYear = 'This Year',
// }

export const PeriodMap = new Map([
  [Period.ThisWeek, 'This Week'],
  [Period.ThisMonth, 'This Month'],
  [Period.ThisQuarter, 'This Quarter'],
  [Period.ThisYear, 'This Year'],
]);

export enum LeaderboardColumns {
  Exchanges = 'Exchanges',
  Instructions = 'Instructions',
  Managed = 'Managed',
  Pipeline = 'Pipeline',
  ViewingsCompleted = 'Viewings Completed'
}

const shared = [LeaderboardColumns.Pipeline, LeaderboardColumns.Exchanges];

/**
 * Columns available to the sales manager
 */
export const SalesManagerColumns = [
  LeaderboardColumns.Instructions,
  ...shared
];

/**
 * Columns available to the sales manager
 */
export const LettingsManagerColumns = [
  ...SalesManagerColumns,
  LeaderboardColumns.Managed
];

/**
 * Columns available to the sales manager
 */
export const NegotiatorColumns = [
  LeaderboardColumns.ViewingsCompleted,
  ...shared
];

