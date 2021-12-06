import { AppUtils } from 'src/app/core/shared/utils'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { AuthService } from '../core/services/auth.service'
import { StaffMemberService } from '../core/services/staff-member.service'
import { StaffMember, Impersonation, ApiRole, Permission, PermissionEnum } from '../shared/models/staff-member'
import { StorageMap } from '@ngx-pwa/local-storage'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})
export class MainmenuComponent implements OnInit {
  appVersion:string = environment.version
  navbarCollapsed = false
  isLoggedIn: boolean
  currentStaffMember: StaffMember
  impersonatedStaffMember: Impersonation
  impersonateToastr: any
  isContactsCollapsed = true
  isPropertiesCollapsed = true
  collapsible: any = {
    contacts: true,
    properties: true
  }
  showMobileMenu = false
  canSeeCsBoard = false
  showMobileProfile: boolean
  isNonProdEnvironment: boolean

  get isLeaderboardVisible() {
    if (this.currentStaffMember) {
      return this.currentStaffMember.dashboardMode !== ApiRole.NotApplicable
    }
  }

  constructor(
    public router: Router,
    public _location: Location,
    public authService: AuthService,
    private storage: StorageMap,
    public staffMemberService: StaffMemberService
  ) {}

  ngOnInit() {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe((res) => (this.currentStaffMember = res))
      }
      this.setAdminPanelAccess(this.currentStaffMember?.permissions)
    })

    if (environment.production) {
      this.isNonProdEnvironment = location.href.includes('https://edge.dng.co.uk') ? false : true
    }
  }

  setAdminPanelAccess(permissions: Permission[]) {
    const csBoardAccess = permissions?.find((x) => x.permissionId === PermissionEnum.CsBoardAccess)
    this.canSeeCsBoard = csBoardAccess ? true : false
  }

  toggleNavCollapse() {
    if (window.innerWidth <= 1024) {
      this.navbarCollapsed = !this.navbarCollapsed
    }
  }

  toggleCollapse(label: string) {
    Object.entries(this.collapsible).forEach((x) => {
      if (x[0] === label) {
        this.collapsible[x[0]] = false
      } else {
        this.collapsible[x[0]] = true
      }
    })
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu
  }

  clearLocalStroge() {
    localStorage.removeItem('contactPeople')
    localStorage.removeItem('newCompany')
    AppUtils.holdingSelectedPeople = null
    AppUtils.holdingSelectedCompany = null
  }
}
