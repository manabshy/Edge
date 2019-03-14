import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DashboardResult, TeamDashboardResult, Pipeline, PipelineResult } from './dashboard';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getStaffMemberDashboard( staffMemberId: number, role: string, period?: string): Observable<DashboardResult> {
    const url = `${AppConstants.baseUrl}/dashboard?period=${period}&role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<DashboardResult>(url);
  }

  getTeamMembersDashboard(staffMemberId: number, role: string, period?: string): Observable<TeamDashboardResult> {
    const url = `${AppConstants.baseUrl}/teammembers/dashboard?period=${period}&role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<TeamDashboardResult>(url);
  }
  getDashboardPipeline(staffMemberId: number, role: string, period?: string): Observable<PipelineResult> {
    const url = `${AppConstants.baseUrl}/dashboard/pipeline?period=${period}&role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<PipelineResult>(url).pipe();
  }
}
