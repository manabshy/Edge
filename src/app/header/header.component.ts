import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthService } from '../core/services/auth.service';
import { HeaderService } from '../core/services/header.service';
import { BaseComponent } from '../shared/models/base-component';
import { BaseStaffMember } from '../shared/models/base-staff-member';
import { StaffMember } from '../shared/models/staff-member';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent implements OnInit {
  currentStaffMember: StaffMember;
  navTitle: string;
  headerLabel: string;
  showImpersonation = false;
  impersonatedStaffMember: BaseStaffMember;
  ref: DynamicDialogRef;
  isImpersonating = false;

  constructor(public authService: AuthService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
    this.setRouteTitle();
  }

  private setRouteTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const childRoute = this.getChildRoute(this.route);
      childRoute.data.subscribe((route) => {
        console.log('title and route', route);
        this.navTitle = route?.title;
      });
    });
  }

  ngOnInit(): void {
    this.getLabel();
  }

  getChildRoute(route: ActivatedRoute): ActivatedRoute {
    if (route.firstChild) {
      return this.getChildRoute(route.firstChild);
    } else { return route; }
  }

  getLabel() {
    this.headerService.label$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(label => this.headerLabel = label);
  }

}
