import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LeaderboardResult } from './leaderboard';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private http: HttpClient) {}

  getStaffMemberPipeline(role: string): Observable<LeaderboardResult> {
    const url = `${AppConstants.leaderboardBaseUrl}/pipeline?role=${role}`;
    return this.http.get<LeaderboardResult>(url);
  }

  getStaffMemberExchanges(role: string, period: string): Observable<LeaderboardResult> {
    return this.getLeaderboard(role, period, 'exchanges');
  }

  getStaffMemberInstructions(role: string, period: string, params?: any): Observable<LeaderboardResult> {
    return this.getLeaderboard(role, period, 'instructions', params);
  }

  private getLeaderboard(role: string, period: string, endPoint: string, params?: any) {
    if (params == null) { params = 10; }
    const url = `${AppConstants.leaderboardBaseUrl}/${endPoint}?role=${role}&period=${period}&pageSize=${params}`;
    return this.http.get<LeaderboardResult>(url);
  }
}

export class ApiParams {
  pageNumber = 1;
  pageSize = 10;
  searchTerm: string;
  constructor(pageNumber: number, pageSize: number, searchTerm: string) {
    this.pageNumber = pageNumber;
    this.pageSize = pageSize,
    this.searchTerm = searchTerm;
  }
}
