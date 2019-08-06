import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LeaderboardResult, Leaderboard } from './leaderboard';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private http: HttpClient) {}

  getStaffMemberPipeline(role: string): Observable<Leaderboard[] | any> {
    const url = `${AppConstants.leaderboardBaseUrl}/pipeline?role=${role}`;
    return this.http.get<LeaderboardResult>(url)
    .pipe(map(response => response.result));
  }

  getStaffMemberExchanges(role: string, period: any): Observable<Leaderboard[] | any> {
    return this.getLeaderboard(role, period, 'exchanges');
  }

  getStaffMemberInstructions(role: string, period: any, params?: any): Observable<Leaderboard[] | any> {
    return this.getLeaderboard(role, period, 'instructions', params);
  }
  
  getStaffMemberViewingsCompleted(role: string, period: any, params?: any): Observable<Leaderboard[] | any> {
    return this.getLeaderboard(role, period, 'viewings', params);
  }

  getStaffMemberManagedTenancies(role: string, period: any, params?: any): Observable<Leaderboard[] | any> {
    return this.getLeaderboard(role, period, 'propertyLettings', params);
  }

  private getLeaderboard(role: string, period: any, endPoint: string, params?: any) {
    if (params == null) { params = 10; }
    const url = `${AppConstants.leaderboardBaseUrl}/${endPoint}?role=${role}&period=${period}&pageSize=${params}`;
    return this.http.get<LeaderboardResult>(url).pipe(map(response => response.result));
  }
}
