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

  constructor(private http: HttpClient, private authService: AuthService) { }

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
  // public getCurrentStaffMember(): Observable<StaffMember> {
  //   if (this.staffMember) {
  //     console.log('current user from cache', this.staffMember);
  //     return of(this.staffMember);
  //   }
  //   return this.http.get<StaffMemberResult>(`${AppConstants.baseUrl}/currentUser`)
  //     .pipe(
  //       map(response => response.result),
  //       tap(data => this.staffMember = data),
  //       shareReplay(1)
  //       // publishReplay(1),
  //       // refCount(),
  //       // take(1),
  //       // tap((data)=>console.log('current user from db', data)),
  //     );
  // }
}
