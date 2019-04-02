import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { DashboardResult, TeamDashboardResult, PipelineResult,
        InstructionResult, ApplicantResult, Dashboard, Pipeline, Instruction } from './dashboard';
import { AppConstants } from 'src/app/core/shared/app-constants';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getStaffMemberDashboard( staffMemberId: number, role: string, period?: string): Observable<Dashboard> {
    const url = `${AppConstants.baseUrl}/dashboard?period=${period}&role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<DashboardResult>(url).pipe(map(response => response.result));
  }

  getTeamMembersDashboard(staffMemberId: number, role: string, period?: string): Observable<Dashboard[]> {
    const url = `${AppConstants.baseUrl}/teammembers/dashboard?period=${period}&role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<TeamDashboardResult>(url).pipe(map(response => response.result));
  }
  getDashboardPipeline(staffMemberId: number, role: string, period?: string): Observable<Pipeline[]> {
    const url = `${AppConstants.baseUrl}/dashboard/pipeline?period=${period}&role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<PipelineResult>(url).pipe(map(response => response.result));
  }
  getDashboardInstructions(staffMemberId: number, role: string, period?: string): Observable<Instruction[]> {
    const url = `${AppConstants.baseUrl}/dashboard/instructions?period=${period}&role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<InstructionResult>(url).pipe(map(response => response.result));
  }
  getDashboardApplicants(staffMemberId: number, role: string): Observable<ApplicantResult> {
    const url = `${AppConstants.baseUrl}/dashboard/applicants?role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<ApplicantResult>(url);
  }
}
