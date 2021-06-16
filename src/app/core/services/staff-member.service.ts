import { RoleDepartment } from "./../../shared/models/staff-member";
import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppConstants } from "../shared/app-constants";
import { map, shareReplay, tap } from "rxjs/operators";
import {
  StaffMember,
  StaffMemberResult,
  Impersonation,
  StaffMemberListResult,
} from "../../shared/models/staff-member";
import { StorageMap } from "@ngx-pwa/local-storage";
import { BaseStaffMember } from "src/app/shared/models/base-staff-member";
import { DashboardMember } from "src/app/shared/models/dashboard-member";
import { result } from "lodash";
import { enumDepartments } from "../shared/departments";
import { LeaderBoardRanking } from "src/app/shared/models/leader-board-ranking";
import { LeaderboardRankingViewEnum } from "src/app/dashboard/shared/dashboard";

const CACHE_SIZE = 1;
@Injectable({
  providedIn: "root",
})
export class StaffMemberService {
  private currentStaffMemberSubject = new BehaviorSubject<StaffMember | null>(
    null
  );
  private staffMember$: Observable<StaffMember>;
  private staffMembers$: Observable<StaffMember[] | any>;
  private activeStaffMembers$: Observable<StaffMember[] | any>;
  private signature$: Observable<string | any>;
  private impersonationSubject = new Subject<BaseStaffMember | null>();
  private clearSelectedSubject = new Subject<boolean>();
  impersonatedStaffMember$ = this.impersonationSubject.asObservable();
  currentStaffMember$ = this.currentStaffMemberSubject.asObservable();
  clearSelectedStaffMember$ = this.clearSelectedSubject.asObservable();

  constructor(private http: HttpClient, private storage: StorageMap) {}

  impersonatedStaffMemberChanged(person: BaseStaffMember) {
    this.impersonationSubject.next(person);
  }

  public getCurrentStaffMember(): Observable<StaffMember> {
    if (!this.staffMember$) {
      this.staffMember$ = this.requestCurrentStaffMember().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.staffMember$;
  }

  private requestCurrentStaffMember(): Observable<StaffMember> {
    return this.http
      .get<StaffMemberResult>(`${AppConstants.baseUrl}/currentUser`)
      .pipe(
        map((response) => response.result),
        tap((data) => {
          if (data) {
            this.storage.set("currentUser", data).subscribe();
          }
        })
      );
  }

  currentStaffMemberChange(staffMember: StaffMember) {
    this.currentStaffMemberSubject.next(staffMember);
  }

  getActiveStaffMembers() {
    if (!this.activeStaffMembers$) {
      this.activeStaffMembers$ = this.requestActiveStaffMembers().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.activeStaffMembers$;
  }

  requestActiveStaffMembers() {
    return this.http
      .get<StaffMemberListResult | any>(`${AppConstants.baseUrl}/active`)
      .pipe(
        map((response) => response),
        tap((data) => {
          if (data) {
            console.log("active staff members in service:", data);
            this.storage.set("activeStaffmembers", data.result).subscribe();
            this.storage.set("cacheStatus", data.cacheStatus).subscribe();
          }
        })
      );
  }

  getAllStaffMembers() {
    if (!this.staffMembers$) {
      this.staffMembers$ = this.requestAllStaffMembers().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.staffMembers$;
  }

  requestAllStaffMembers() {
    return this.http
      .get<StaffMemberListResult | any>(`${AppConstants.baseUrl}/all`)
      .pipe(
        map((response) => response),
        tap((data) => {
          if (data) {
            console.log("all staff members in servuce:", data);
            this.storage.set("allstaffmembers", data.result).subscribe();
            this.storage.set("cacheStatus", data.cacheStatus).subscribe();
          }
        })
      );
  }

  getValuers(): Observable<StaffMember[]> {
    return this.http.get<any>(`${AppConstants.baseUrl}/listers`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data) {
          this.storage.set("allListers", data).subscribe();
        }
      })
    );
  }

  getRankings(rankingType: any): Observable<LeaderBoardRanking[]> {
    if (rankingType?.name == "Sales")
      return this.http
        .get<any>(
          `${AppConstants.leaderboardRankingBaseUrl}/sales/ranking?rankingView=${LeaderboardRankingViewEnum.DefaultView}`
        )
        .pipe(
          map((response) => response.result),
          tap((data) => {
            if (data) {
              this.storage.set("rankings", data).subscribe();
            }
          })
        );
    else
      return this.http
        .get<any>(
          `${AppConstants.leaderboardRankingBaseUrl}/lettings/ranking?rankingView=${LeaderboardRankingViewEnum.DefaultView}`
        )
        .pipe(
          map((response) => response.result),
          tap((data) => {
            if (data) {
              this.storage.set("rankings", data).subscribe();
            }
          })
        );
  }

  getDashboardMembers(
    currenStaffMember: StaffMember,
    departmentId?: number
  ): Observable<DashboardMember[]> {
    if (
      departmentId
        ? departmentId == enumDepartments.sales
        : currenStaffMember.departmentId === enumDepartments.sales
    ) {
      return this.http
        .get<any>(`${AppConstants.baseDashboardUrl}/sales/members`)
        .pipe(
          map((response) => response.result),
          tap((data) => {
            if (data) {
              this.storage.set("dashboardMembers", data).subscribe();
            }
          })
        );
    } else if (
      departmentId
        ? departmentId == enumDepartments.lettings
        : currenStaffMember.departmentId === enumDepartments.lettings
    ) {
      return this.http
        .get<any>(`${AppConstants.baseDashboardUrl}/lettings/members`)
        .pipe(
          map((response) => response.result),
          tap((data) => {
            if (data) {
              this.storage.set("dashboardMembers", data).subscribe();
            }
          })
        );
    } else if (
      departmentId
        ? departmentId == enumDepartments.corporate_services
        : currenStaffMember.departmentId === enumDepartments.corporate_services
    ) {
      return this.http
        .get<any>(`${AppConstants.baseDashboardUrl}/cs/members`)
        .pipe(
          map((response) => response.result),
          tap((data) => {
            if (data) {
              this.storage.set("dashboardMembers", data).subscribe();
            }
          })
        );
    }
    return this.requestActiveStaffMembers();
  }

  getValuationAttendees(): Observable<BaseStaffMember[]> {
    return this.http.get<any>(`${AppConstants.baseUrl}/attendees`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data) {
          this.storage.set("allAttendees", data).subscribe();
        }
      })
    );
  }

  getStaffMemberSuggestions(searchTerm): Observable<any> {
    console.log("search Term:", searchTerm);
    return this.http
      .get<StaffMemberResult>(
        `${AppConstants.baseUrl}/suggestions?SearchTerm=${searchTerm}`,
        {
          headers: { ignoreLoadingBar: "" },
        }
      )
      .pipe(
        map((response) => response.result),
        tap((data) => {
          if (data) {
            console.log("suggestions:", data);
          }
        })
      );
  }

  getStaffMembersForCalendar(): Observable<BaseStaffMember[]> {
    return this.http.get<any>(`${AppConstants.baseUrl}/calendars`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data && data.length) {
          this.storage.set("calendarStaffMembers", data).subscribe();
        }
      })
    );
  }

  getCurrentStaffMemberSignature(): Observable<string> {
    if (!this.signature$) {
      this.signature$ = this.requestStaffMemberSignature().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.signature$;
  }

  requestStaffMemberSignature(): Observable<string> {
    return this.http.get<any>(`${AppConstants.baseUrl}/current/signature`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data) {
          this.storage.set("signature", data).subscribe();
        }
      })
    );
  }

  clearSelectedStaffMember = (clear: boolean) =>
    this.clearSelectedSubject.next(clear);
}
