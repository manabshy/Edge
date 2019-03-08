import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { DashboardResult, TeamDashboardResult } from './dashboard';
import { AuthService } from 'src/app/core/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:57211/v1/staffMembers';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getStaffMemberDashboard( staffMemberId: number, role: string, period?: string): Observable<DashboardResult> {
    const url = `${this.baseUrl}/${staffMemberId}/dashboard?period=${period}&role=${role}`;
    return this.http.get<DashboardResult>(url);
  }

  getTeamMembersDashboard(staffMemberId: number,role: string, period?: string): Observable<TeamDashboardResult> {
    const url = `${this.baseUrl}/${staffMemberId}/teammembers/dashboard?period=${period}&role=${role}`;
    return this.http.get<TeamDashboardResult>(url);
  }
}
