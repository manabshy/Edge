import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/core/services/auth.service';
import { Leaderboard } from './leaderboard';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private baseUrl = 'http://localhost:51130/v1/staffMembers/leaderboard';
  constructor(private http: HttpClient, private authService: AuthService) {}
  getStaffMemberPipeline(
    role: string
  ): Observable<Leaderboard[]> {
    const url = `${this.baseUrl}/dashboard?${role}`;
    const auth_token = this.authService.getToken();
    const headers: HttpHeaders = new HttpHeaders();
    headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded; charset=UTF-8'
    );
    headers.set('Authorization', `Bearer${auth_token}`);

    return this.http.get<Leaderboard[]>(url, { headers: headers });
  }
}
