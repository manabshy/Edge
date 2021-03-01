export interface CacheStatus {
  info: Date;
  offices: Date;
  staffMembers: Date;
}

export interface ResultData {
  status: true;
  returnCode: number;
  requestId: string;
  message: string;
  technicalDetails: string;
  result: any;
  cacheStatus: CacheStatus;
  resultCount?: number;
  page?: number;
  totalPages?: number;
  totalResultCount?: number;
}

