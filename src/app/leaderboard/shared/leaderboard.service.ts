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

  getStaffMemberPipeline(params?: any): Observable<Leaderboard[] | any> {
    if (params == null) { params = 20; }
    const url = `${AppConstants.leaderboardBaseUrl}/pipeline?pageSize=${params}`;
    return this.http.get<LeaderboardResult>(url)
    .pipe(map(response => response.result));
  }

  getStaffMemberExchanges(period: any): Observable<Leaderboard[] | any> {
    return this.getLeaderboard(period, 'exchanges');
  }

  getStaffMemberInstructions(period: any, params?: any): Observable<Leaderboard[] | any> {
    return this.getLeaderboard(period, 'instructions', params);
  }

  getStaffMemberViewingsCompleted(period: any, params?: any): Observable<Leaderboard[] | any> {
    return this.getLeaderboard(period, 'viewings', params);
  }

  getStaffMemberManagedTenancies(period: any, params?: any): Observable<Leaderboard[] | any> {
    return this.getLeaderboard(period, 'propertyLettings', params);
  }

  private getLeaderboard(period: any, endPoint: string, params?: any) {
    if (params == null) { params = 20; }
    const url = `${AppConstants.leaderboardBaseUrl}/${endPoint}?period=${period}&pageSize=${params}`;
    return this.http.get<LeaderboardResult>(url).pipe(map(response => response.result));
  }
}
