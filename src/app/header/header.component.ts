import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { HeaderService } from '../core/services/header.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember } from '../shared/models/staff-member';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentStaffMember: any;
  navTitle: string;
  headerLabel: string;

  constructor(public authService: AuthService,
    private storage: StorageMap,
    private staffMemberService: StaffMemberService,
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
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe(res => this.currentStaffMember = res);
      }
      console.log('current user from storage in main menu....', this.currentStaffMember);
    });

    this.getLabel();
    console.log('here......');

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
    this.headerService.label$.subscribe(label => {this.headerLabel = label; console.log({label});
    });
  }
}
