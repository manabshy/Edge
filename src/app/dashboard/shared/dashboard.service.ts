import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map, tap} from 'rxjs/operators';
import { DashboardResult, TeamDashboardResult, PipelineResult,
        InstructionResult, ApplicantResult, Dashboard, Pipeline, Instruction, Valuation } from './dashboard';
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
    return this.get(staffMemberId, role, 'pipeline', period );
  }

  getDashboardInstructions(staffMemberId: number, role: string, period?: string, pageSize?: number): Observable<Instruction[]> {
   return this.get(staffMemberId, role, 'instructions', period, pageSize ).pipe(tap(data => console.log(JSON.stringify(data))));
  }
  getDashboardValuations(staffMemberId: number, role: string, period?: string, pageSize?: number): Observable<Valuation[]> {
   return this.get(staffMemberId, role, 'valuations', period, pageSize ).pipe(tap(data => console.log(JSON.stringify(data))));
  }

  getDashboardApplicants(staffMemberId: number, role: string): Observable<ApplicantResult> {
    const url = `${AppConstants.baseUrl}/dashboard/applicants?role=${role}&staffMemberId=${staffMemberId}`;
    return this.http.get<ApplicantResult>(url);
  }

 private get(staffMemberId: number, role: string, endpoint: string, period?: string, pageSize: number= 10): Observable<any> {
    const url = `${AppConstants.baseUrl}/dashboard/${endpoint}?period=${period}&role=${role}&staffMemberId=${staffMemberId}&pageSize=${pageSize}`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }
}
