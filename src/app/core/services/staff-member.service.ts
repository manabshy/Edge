import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../shared/app-constants';
import { map, shareReplay, tap } from 'rxjs/operators';
import { StaffMember, StaffMemberResult, Impersonation } from '../models/staff-member';
import { Staff } from 'src/app/diary/shared/diary';
import { StorageMap } from '@ngx-pwa/local-storage';

const CACHE_SIZE = 1;
@Injectable({
  providedIn: 'root'
})
export class StaffMemberService {
  private currentStaffMemberSubject = new BehaviorSubject<StaffMember | null>(null);
  private staffMember$: Observable<StaffMember>;
  private impersonationList$: Observable<Impersonation[]>;
  currentStaffMember$ = this.currentStaffMemberSubject.asObservable();

  constructor(private http: HttpClient, private storage: StorageMap) { }

  public getCurrentStaffMember(): Observable<StaffMember> {
    if (!this.staffMember$) {
      this.staffMember$ = this.requestCurrentStaffMember().pipe(shareReplay(CACHE_SIZE));
    }
    return this.staffMember$;
  }
  public getImpersonationList(): Observable<Impersonation[]> {
    if (!this.impersonationList$) {
      this.impersonationList$ = this.requestImpersonationList().pipe(shareReplay(CACHE_SIZE));
    }
    return this.impersonationList$;
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

  private requestImpersonationList(): Observable<Impersonation[]> {
    return this.http.get<any>(`${AppConstants.baseUrl}/impersonation`)
      .pipe(
        map(response => response.result)
      );
  }

  currentStaffMemberChange(staffMember: StaffMember) {
    this.currentStaffMemberSubject.next(staffMember);
  }
}
