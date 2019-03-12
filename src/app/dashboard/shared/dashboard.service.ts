import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DashboardResult, TeamDashboardResult } from './dashboard';
import { AppConstants } from 'src/app/core/shared/app-constants';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getStaffMemberDashboard( staffMemberId: number, role: string, period?: string): Observable<DashboardResult> {
    const url = `${AppConstants.baseUrl}/${staffMemberId}/dashboard?period=${period}&role=${role}`;
    return this.http.get<DashboardResult>(url);
  }

  getTeamMembersDashboard(staffMemberId: number, role: string, period?: string): Observable<TeamDashboardResult> {
    const url = `${AppConstants.baseUrl}/${staffMemberId}/teammembers/dashboard?period=${period}&role=${role}`;
    return this.http.get<TeamDashboardResult>(url);
  }
}
