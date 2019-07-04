import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../shared/app-constants';
import { map, tap } from 'rxjs/operators';
import { StaffMember, StaffMemberResult } from '../models/staff-member';

@Injectable({
  providedIn: 'root'
})
export class StaffMemberService {
  get currentStaffMember() {
    const member = localStorage.getItem('currentUser');
    return JSON.parse(member);
  }
  constructor(private http: HttpClient, private authService: AuthService) { }

  public getCurrentStaffMember(): Observable<StaffMember> {
    return this.http.get<StaffMemberResult>(`${AppConstants.baseUrl}/currentUser`)
    .pipe(
      map(response => response.result),
      tap(data => localStorage.setItem('currentUser', JSON.stringify(data)))
   );
  }
}
