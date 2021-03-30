import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember, Impersonation, ApiRole, Permissions, Permission, PermissionEnum } from '../shared/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})
export class MainmenuComponent implements OnInit {
  navbarCollapsed = false;
  isLoggedIn: boolean;
  currentStaffMember: StaffMember;
  impersonatedStaffMember: Impersonation;
  impersonateToastr: any;
  isContactsCollapsed = true;
  isPropertiesCollapsed = true;

  collapsible: any = {
    contacts: true,
    properties: true
  };
  showMobileMenu = false;
  canSeeCsBoard = false;

  get isLeaderboardVisible() {
    if (this.currentStaffMember) {
      return this.currentStaffMember.dashboardMode !== ApiRole.NotApplicable;
    }
  }

  constructor(public router: Router,
    public _location: Location,
    public authService: AuthService,
    private storage: StorageMap,
    private toastr: ToastrService,
    public staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe(res => this.currentStaffMember = res);
      }
      this.setAdminPanelAccess(this.currentStaffMember?.permissions);
      console.log('current user from storage in main menu....', this.currentStaffMember);
    });
  }

  setAdminPanelAccess(permissions: Permission[]) {
    const csBoardAccess = permissions?.find(x => x.permissionId === PermissionEnum.CsBoardAccess);
    this.canSeeCsBoard = csBoardAccess ? true : false;
  }

  toggleNavCollapse() {
    if (window.innerWidth <= 1024) {
      this.navbarCollapsed = !this.navbarCollapsed;
    }
  }

  toggleCollapse(label: string) {
    Object.entries(this.collapsible).forEach(x => {
      if (x[0] === label) {
        this.collapsible[x[0]] = false;
      } else {
        this.collapsible[x[0]] = true;
      }
    });

    console.log(this.collapsible);
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  showImpersonateBanner(member: Impersonation, existing?: boolean) {
    if (!existing) {
      if (this.impersonateToastr) {
        this.toastr.clear(this.impersonateToastr.toastId);
      }
    }
    this.impersonateToastr = this.toastr.warning('<div class="row align-items-center"><div class="col">You\'re acting on behalf of <b>' + member.fullName + '</b></div><div class="col-auto"><a class="btn btn-danger text-white ml-2">Stop</a></div>', '', {
      disableTimeOut: true
    });
    this.impersonateToastr
      .onTap
      .pipe(take(1))
      .subscribe(() => {
        this.stopImpersonation();
        console.log('unimpersonate');
      });
  }

  stopImpersonation() {
    this.impersonatedStaffMember = null;
    if (!this.impersonatedStaffMember) {
      this.storage.delete('impersonatedStaffMember').subscribe();
    }
    console.log('stop now', this.impersonatedStaffMember);
  }

  logOut() {
    // this.authService.signout();
    this.authService.logout();
  }

}
