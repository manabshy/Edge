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

export enum Period {
  ThisWeek = 'ThisWeek',
  ThisMonth = 'ThisMonth',
  ThisQuarter = 'ThisQuarter',
  ThisYear = 'ThisYear',
}
