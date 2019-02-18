import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Dashboard } from './dashboard';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  private baseUrl = 'http://localhost:51130/v1/staffMembers';

  getStaffMemberDashboard(staffMemberId: number): Observable<Dashboard> {
    const url = `${this.baseUrl}/${staffMemberId}/dashboard`;
    return this.http.get<Dashboard>(url);
  }

  getTeamMemberDashboard(staffMemberId: number): Observable<Dashboard> {
    const url = `${this.baseUrl}/${staffMemberId}/teammembers/dashboard`;
    return this.http.get<Dashboard>(url);
  }
}
