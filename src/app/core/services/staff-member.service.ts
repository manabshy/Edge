import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../shared/app-constants';
import { map, shareReplay, tap } from 'rxjs/operators';
import { StaffMember, StaffMemberResult, Impersonation, StaffMemberListResult } from '../models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';

const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class StaffMemberService {
  private currentStaffMemberSubject = new BehaviorSubject<StaffMember | null>(null);
  private staffMember$: Observable<StaffMember>;
  private staffMembers$: Observable<StaffMember[]>;
  private impersonationSubject = new BehaviorSubject<Impersonation | null>(null);
  impersonatedStaffMember$ = this.impersonationSubject.asObservable();
  currentStaffMember$ = this.currentStaffMemberSubject.asObservable();

  constructor(private http: HttpClient, private storage: StorageMap) { }

  impersonatedStaffMemberChanged(person: Impersonation) {
    this.impersonationSubject.next(person);
  }

  public getCurrentStaffMember(): Observable<StaffMember> {
    if (!this.staffMember$) {
      this.staffMember$ = this.requestCurrentStaffMember().pipe(shareReplay(CACHE_SIZE));
    }
    return this.staffMember$;
  }

  private requestCurrentStaffMember(): Observable<StaffMember> {
    return this.http.get<StaffMemberResult>(`${AppConstants.baseUrl}/currentUser`)
      .pipe(
        map(response => response.result),
        tap(data => {
          if (data) {
            this.storage.set('currentUser', data).subscribe();
          }
        })
      );
  }

  currentStaffMemberChange(staffMember: StaffMember) {
    this.currentStaffMemberSubject.next(staffMember);
  }

  getAllStaffMembers() {
    if (!this.staffMembers$) {
      this.staffMembers$ = this.requestAllStaffMembers().pipe(shareReplay(CACHE_SIZE));
    }
    return this.staffMembers$;
  }

  requestAllStaffMembers() {
    return this.http.get<StaffMemberListResult>(`${AppConstants.baseUrl}/all`).pipe(
      map(response => response.result),
      tap(data => {
        if (data) {
          this.storage.set('allstaffmembers', data).subscribe();
        }
      }));
  }

}
