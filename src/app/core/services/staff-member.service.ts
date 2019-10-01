import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../shared/app-constants';
import { map, tap, shareReplay, publishReplay, refCount, take } from 'rxjs/operators';
import { StaffMember, StaffMemberResult } from '../models/staff-member';
import { Staff } from 'src/app/diary/shared/diary';

const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class StaffMemberService {
  staffMember: StaffMember;
  currentStaffMember$: Observable<StaffMember>;

  constructor(private http: HttpClient) { }

  public getCurrentStaffMember(): Observable<StaffMember> {
    if (!this.currentStaffMember$) {
      this.currentStaffMember$ = this.requestCurrentStaffMember().pipe(shareReplay(CACHE_SIZE));
    }
    return this.currentStaffMember$;
  }

  private requestCurrentStaffMember(): Observable<StaffMember> {
    return this.http.get<StaffMemberResult>(`${AppConstants.baseUrl}/currentUser`)
      .pipe(map(response => response.result));
  }
}
