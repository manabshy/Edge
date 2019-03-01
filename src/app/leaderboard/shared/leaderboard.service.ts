import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from 'src/app/core/services/auth.service';
import { LeaderboardResult } from './leaderboard';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private baseUrl = 'http://localhost:57211/v1/staffmembers/leaderboard';
  constructor(private http: HttpClient, private authService: AuthService) {}
  getStaffMemberPipeline(role: string): Observable<LeaderboardResult> {
    const url = `${this.baseUrl}/pipeline?role=${role}`;
    const auth_token = this.authService.getToken();
    const headers: HttpHeaders = new HttpHeaders();
    headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    headers.set('Authorization', `Bearer${auth_token}`);

    return this.http.get<LeaderboardResult>(url, { headers: headers });
  }
  getStaffMemberExchanges(role: string, period: string): Observable<LeaderboardResult> {
    const url = `${this.baseUrl}/exchanges?role=${role}&period=${period}`;
    return this.http.get<LeaderboardResult>(url);
  }

  getStaffMemberInstructions(role: string, period: string): Observable<LeaderboardResult> {
    const url = `${this.baseUrl}/instructions?role=${role}&period=${period}`;
    return this.http.get<LeaderboardResult>(url);
  }
}
