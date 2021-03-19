import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { HeaderService } from '../core/services/header.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { ImpersonateMemberComponent } from '../impersonate-member/impersonate-member.component';
import { BaseStaffMember } from '../shared/models/base-staff-member';
import { StaffMember } from '../shared/models/staff-member';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentStaffMember: StaffMember;
  navTitle: string;
  headerLabel: string;
  showImpersonation = false;
  impersonatedStaffMember: BaseStaffMember;
  ref: DynamicDialogRef;
  isImpersonating = false;

  constructor(public authService: AuthService,
    private storage: StorageMap,
    private staffMemberService: StaffMemberService,
    private dialogService: DialogService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router) {
    this.setRouteTitle();
  }

  private setRouteTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      // this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const childRoute = this.getChildRoute(this.route);
      childRoute.data.subscribe((route) => {
        console.log('title and route', route);
        this.navTitle = route?.title;
      });
    });
  }

  ngOnInit(): void {
     this.storage.get('impersonatedStaffMember').subscribe((staffMember: BaseStaffMember) => {
      if (staffMember) {
        this.impersonatedStaffMember = staffMember;
        this.isImpersonating = true;
        console.log('selected id:', staffMember);
      }
    });

    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe(res => this.currentStaffMember = res);
      }
      console.log('current user from storage in main menu....', this.currentStaffMember);
    });

    this.getLabel();
  }

  logOut() {
    this.authService.logout();
  }

  getChildRoute(route: ActivatedRoute): ActivatedRoute {
    if (route.firstChild) {
      return this.getChildRoute(route.firstChild);
    } else {
      return route;
    }
  }

  getLabel() {
    this.headerService.label$.subscribe(label => {
      this.headerLabel = label; console.log({ label });
    });
  }

  impersonate(stop = false) {
    console.log({ stop });
    if (stop) {
      this.showImpersonation = false;
      this.isImpersonating = false;
      this.storage.delete('impersonatedStaffMember').subscribe();
    } else {
      this.showImpersonation = true;
    }
    // if (!stop) {
    //   this.showImpersonation = true;
    //   // this.ref = this.dialogService.open(ImpersonateMemberComponent,{styleClass: 'dialog dialog--medium', header:'Select Staff Member'})
    // }
  }

  getSelectedStaffMember(member: BaseStaffMember) {
    console.log({ member });
    this.impersonatedStaffMember = member;
  }

  startImpersonation() {
    this.isImpersonating = true;
    this.showImpersonation = false;
    // this.currentStaffMember.fullName = this.impersonatedStaffMember.fullName;
    // this.currentStaffMember.photoUrl = null;
    this.storage.set('impersonatedStaffMember', this.impersonatedStaffMember).subscribe();
    this.staffMemberService.impersonatedStaffMemberChanged(this.impersonatedStaffMember);
  }
}
