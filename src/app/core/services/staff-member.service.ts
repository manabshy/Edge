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
  constructor(private http: HttpClient, private authService: AuthService) { }

  public getStaffMember(): Observable<StaffMember> {
    return this.http.get<StaffMemberResult>(`${AppConstants.baseUrl}/currentUser`)
    .pipe(
      map(response => response.result),
      tap(data => console.log(JSON.stringify(data)))
   );
  }
}
