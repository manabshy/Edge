import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { UserResult, User } from '../core/models/user';
import { StaffMemberService } from '../core/services/staff-member.service';

import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { AppUtils } from '../core/shared/utils';
import { StaffMember } from '../core/models/staff-member';
import { SharedService, DropdownListInfo } from '../core/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CompanyDetailComponent } from '../company/company-detail/company-detail.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  info: DropdownListInfo;
  // get currentStaffMember(): StaffMember {
  //   return this.staffMemberService.currentStaffMember;
  // }
  currentStaffMember: StaffMember;
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  selectedTab = 0;
  containerClass = '';
  @ViewChild('homeTabs') homeTabs: TabsetComponent;

  constructor(private authService: AuthService,
              private staffMemberService: StaffMemberService,
              private sharedService: SharedService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.staffMemberService.getCurrentStaffMember().subscribe(data => this.currentStaffMember = data);
    this.sharedService.getDropdownListInfo().subscribe(data => this.info = data);
    // this.sharedService.getDropdownListInfo().subscribe();
    // console.log('info detail in home component', this.info );
    this.route.queryParams.subscribe(params =>  {
      if (params['selectedTab']) {
        AppUtils.homeSelectedTab = params['selectedTab'];
      }
      this.selectedTab = AppUtils.homeSelectedTab || 0;
      console.log(this.selectedTab);
      if (this.homeTabs.tabs[this.selectedTab]) {
        this.homeTabs.tabs[this.selectedTab].active = true;
      }
    });
  }

  onSelect(data: TabDirective): void {
    setTimeout(() => {
      this.router.navigate(['/']);
      this.selectedTab = data.tabset.tabs.findIndex(item => item.active);
      if (this.selectedTab >= 0) {
        AppUtils.homeSelectedTab = this.selectedTab;
      }
      AppUtils.isDiarySearchVisible = false;
      if (this.selectedTab === 1) {
        this.sharedService.scrollTodayIntoView();
        this.sharedService.scrollCurrentHourIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
  }
}
