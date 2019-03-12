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
    const url = `${AppConstants.leaderboardBaseUrl}/exchanges?role=${role}&period=${period}`;
    return this.http.get<LeaderboardResult>(url);
  }

  getStaffMemberInstructions(role: string, period: string): Observable<LeaderboardResult> {
    const url = `${AppConstants.leaderboardBaseUrl}/instructions?role=${role}&period=${period}`;
    return this.http.get<LeaderboardResult>(url);
  }
}
