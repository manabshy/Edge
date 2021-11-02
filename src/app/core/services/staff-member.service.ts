import { Permission, RoleName } from './../../shared/models/staff-member'
import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject, Subject, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { AppConstants } from '../shared/app-constants'
import { map, shareReplay, tap } from 'rxjs/operators'
import { StaffMember, StaffMemberResult, StaffMemberListResult } from '../../shared/models/staff-member'
import { StorageMap } from '@ngx-pwa/local-storage'
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member'
import { DashboardMember } from 'src/app/shared/models/dashboard-member'
import { enumDepartments } from '../shared/departments'
import { LeaderBoardRanking } from 'src/app/shared/models/leader-board-ranking'
import { LeaderboardRankingViewEnum } from 'src/app/dashboard/shared/dashboard'
import { enumRoles } from '../shared/roles'

const CACHE_SIZE = 1
@Injectable({
  providedIn: 'root'
})
export class StaffMemberService {
  private currentStaffMemberSubject = new BehaviorSubject<StaffMember | null>(null)
  private staffMember$: Observable<StaffMember>
  private staffMembers$: Observable<StaffMember[] | any>
  private activeStaffMembers$: Observable<StaffMember[] | any>
  private signature$: Observable<string | any>
  private impersonationSubject = new Subject<BaseStaffMember | null>()
  private clearSelectedSubject = new Subject<boolean>()
  impersonatedStaffMember$ = this.impersonationSubject.asObservable()
  currentStaffMember$ = this.currentStaffMemberSubject.asObservable()
  clearSelectedStaffMember$ = this.clearSelectedSubject.asObservable()

  constructor(private http: HttpClient, private storage: StorageMap) {}

  impersonatedStaffMemberChanged(person: BaseStaffMember) {
    this.impersonationSubject.next(person)
  }

  public getCurrentStaffMember(): Observable<StaffMember> {
    if (!this.staffMember$) {
      this.staffMember$ = this.requestCurrentStaffMember().pipe(shareReplay(CACHE_SIZE))
    }
    return this.staffMember$
  }

  public hasCurrentUserValuationCreatePermission(): Observable<boolean> {
    let currentMember$ = this.getCurrentStaffMember()
    if (currentMember$)
      return currentMember$.pipe(
        map((staffMember) =>
          staffMember.permissions.findIndex((x: Permission) => x.permissionId == 63) > -1 ? true : false
        )
      )
    return of(false)
  }

  private requestCurrentStaffMember(): Observable<StaffMember> {
    return this.http.get<StaffMemberResult>(`${AppConstants.baseUrl}/currentUser`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data) {
          let roles = []
          if (data.securityRoles) {
            data.securityRoles.forEach((role) => {
              switch (role.securityRoleId) {
                case enumRoles.LettingsManager:
                case enumRoles.PropertyManager:
                case enumRoles.SalesManager:
                  roles.push({ roleId: role.securityRoleId, roleName: RoleName.Manager, departments: [] })
                  break

                case enumRoles.LettingsNegotiator:
                case enumRoles.SalesNegotiator:
                case enumRoles.SeniorNegotiator:
                  roles.push({ roleId: role.securityRoleId, roleName: RoleName.Negotiator, departments: [] })
                  break

                case enumRoles.BrokerFull:
                case enumRoles.BrokerLets:
                case enumRoles.BrokerSales:
                case enumRoles.NewHomesBroker:
                  roles.push({ roleId: role.securityRoleId, roleName: RoleName.Broker, departments: [] })
                  break

                case enumRoles.LettingsTeamAssistant:
                case enumRoles.PropertyTeamAssistant:
                case enumRoles.SalesTeamAssistant:
                  roles.push({ roleId: role.securityRoleId, roleName: RoleName.OfficeManager, departments: [] })
                  break
              }
            })
          }
          data.roles = roles
          this.storage.set('currentUser', data).subscribe()
        }
      })
    )
  }

  currentStaffMemberChange(staffMember: StaffMember) {
    this.currentStaffMemberSubject.next(staffMember)
  }

  getActiveStaffMembers() {
    if (!this.activeStaffMembers$) {
      this.activeStaffMembers$ = this.requestActiveStaffMembers().pipe(shareReplay(CACHE_SIZE))
    }
    return this.activeStaffMembers$
  }

  requestActiveStaffMembers() {
    return this.http.get<StaffMemberListResult | any>(`${AppConstants.baseUrl}/active`).pipe(
      map((response) => response),
      tap((data) => {
        if (data) {
          console.log('active staff members in service:', data)
          this.storage.set('activeStaffmembers', data.result).subscribe()
          this.storage.set('cacheStatus', data.cacheStatus).subscribe()
        }
      })
    )
  }

  getAllStaffMembers() {
    if (!this.staffMembers$) {
      this.staffMembers$ = this.requestAllStaffMembers().pipe(shareReplay(CACHE_SIZE))
    }
    return this.staffMembers$
  }

  requestAllStaffMembers() {
    return this.http.get<StaffMemberListResult | any>(`${AppConstants.baseUrl}/all`).pipe(
      map((response) => response),
      tap((data) => {
        if (data) {
          console.log('all staff members in servuce:', data)
          this.storage.set('allstaffmembers', data.result).subscribe()
          this.storage.set('cacheStatus', data.cacheStatus).subscribe()
        }
      })
    )
  }

  getDashboardData(
    departmentId: number,
    rankingView: number,
    startDate: string,
    endDate: string,
    staffMemberId?: number
  ): Observable<any> {
    if (staffMemberId) {
      return this.http.get<any>(
        `${AppConstants.baseDashboardUrl}?departmentId=${departmentId}&
        staffMemberId=${staffMemberId}&rankingView=${rankingView}
        &startDate=${startDate}&endDate=${endDate}`
      )
    } else {
      return this.http.get<any>(
        `${AppConstants.baseDashboardUrl}?departmentId=${departmentId}
          &rankingView=${rankingView}
          &startDate=${startDate}&endDate=${endDate}`
      )
    }
  }

  getValuers(): Observable<StaffMember[]> {
    return this.http.get<any>(`${AppConstants.baseUrl}/listers`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data) {
          this.storage.set('allListers', data).subscribe()
        }
      })
    )
  }

  getRankings(rankingType: any): Observable<LeaderBoardRanking[]> {
    if (rankingType?.name == 'Sales')
      return this.http
        .get<any>(
          `${AppConstants.leaderboardRankingBaseUrl}/sales/ranking?rankingView=${LeaderboardRankingViewEnum.DefaultView}`
        )
        .pipe(
          map((response) => response.result),
          tap((data) => {
            if (data) {
              this.storage.set('rankings', data).subscribe()
            }
          })
        )
    else
      return this.http
        .get<any>(
          `${AppConstants.leaderboardRankingBaseUrl}/lettings/ranking?rankingView=${LeaderboardRankingViewEnum.DefaultView}`
        )
        .pipe(
          map((response) => response.result),
          tap((data) => {
            if (data) {
              this.storage.set('rankings', data).subscribe()
            }
          })
        )
  }

  getDashboardMembers(currenStaffMember: StaffMember, departmentId?: number): Observable<DashboardMember[]> {
    if (
      departmentId ? departmentId == enumDepartments.sales : currenStaffMember.departmentId === enumDepartments.sales
    ) {
      return this.http.get<any>(`${AppConstants.baseDashboardUrl}/sales/members`).pipe(
        map((response) => response.result),
        tap((data) => {
          if (data) {
            this.storage.set('dashboardMembers', data).subscribe()
          }
        })
      )
    } else if (
      departmentId
        ? departmentId == enumDepartments.lettings
        : currenStaffMember.departmentId === enumDepartments.lettings
    ) {
      return this.http.get<any>(`${AppConstants.baseDashboardUrl}/lettings/members`).pipe(
        map((response) => response.result),
        tap((data) => {
          if (data) {
            this.storage.set('dashboardMembers', data).subscribe()
          }
        })
      )
    } else if (
      departmentId
        ? departmentId == enumDepartments.corporate_services
        : currenStaffMember.departmentId === enumDepartments.corporate_services
    ) {
      return this.http.get<any>(`${AppConstants.baseDashboardUrl}/cs/members`).pipe(
        map((response) => response.result),
        tap((data) => {
          if (data) {
            this.storage.set('dashboardMembers', data).subscribe()
          }
        })
      )
    }
    return this.requestActiveStaffMembers()
  }

  getCsStaffMembers(): Observable<StaffMember[]> {
    return this.getActiveStaffMembers().pipe(
      map((response) =>
        response.result.filter(
          (x) =>
            x.activeDepartments.findIndex(
              (y) => y.departmentId === enumDepartments.BDD || y.departmentId === enumDepartments.corporate_services
            ) > -1
        )
      )
    )
  }

  getValuationAttendees(): Observable<BaseStaffMember[]> {
    return this.http.get<any>(`${AppConstants.baseUrl}/attendees`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data) {
          this.storage.set('allAttendees', data).subscribe()
        }
      })
    )
  }

  getStaffMemberSuggestions(searchTerm): Observable<any> {
    console.log('search Term:', searchTerm)
    return this.http
      .get<StaffMemberResult>(`${AppConstants.baseUrl}/suggestions?SearchTerm=${searchTerm}`, {
        headers: { ignoreLoadingBar: '' }
      })
      .pipe(
        map((response) => response.result),
        tap((data) => {
          if (data) {
            console.log('suggestions:', data)
          }
        })
      )
  }

  getStaffMembersForCalendar(): Observable<BaseStaffMember[]> {
    return this.http.get<any>(`${AppConstants.baseUrl}/calendars`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data && data.length) {
          this.storage.set('calendarStaffMembers', data).subscribe()
        }
      })
    )
  }

  getCurrentStaffMemberSignature(): Observable<string> {
    if (!this.signature$) {
      this.signature$ = this.requestStaffMemberSignature().pipe(shareReplay(CACHE_SIZE))
    }
    return this.signature$
  }

  requestStaffMemberSignature(): Observable<string> {
    return this.http.get<any>(`${AppConstants.baseUrl}/current/signature`).pipe(
      map((response) => response.result),
      tap((data) => {
        if (data) {
          this.storage.set('signature', data).subscribe()
        }
      })
    )
  }

  clearSelectedStaffMember = (clear: boolean) => this.clearSelectedSubject.next(clear)
}
