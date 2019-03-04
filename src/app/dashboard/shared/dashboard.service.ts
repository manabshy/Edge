import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Dashboard, DashboardResult } from './dashboard';
import { AuthService } from 'src/app/core/services/auth.service';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:57211/v1/staffMembers';
  constructor(private http: HttpClient, private authService: AuthService) {}

  getStaffMemberDashboard( staffMemberId: number, role: string, period?: string): Observable<DashboardResult> {
    const url = `${this.baseUrl}/${staffMemberId}/dashboard?period=${period}&role=${role}`;
    const auth_token = this.authService.getToken();
    const headers: HttpHeaders = new HttpHeaders();
    headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    headers.set('Authorization', `Bearer${auth_token}`);

    return this.http.get<DashboardResult>(url, { headers: headers });
  }

  getTeamMemberDashboard(staffMemberId: number): Observable<DashboardResult> {
    const url = `${this.baseUrl}/${staffMemberId}/teammembers/dashboard`;
    return this.http.get<DashboardResult>(url);
  }
}
