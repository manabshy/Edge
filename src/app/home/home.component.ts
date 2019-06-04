import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { UserResult, User } from '../core/models/user';
import { StaffMemberService } from '../core/services/staff-member.service';

import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { AppUtils } from '../core/shared/utils';
import { StaffMember } from '../core/models/staff-member';
import { SharedService } from '../core/services/shared.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  get currentStaffMember(): StaffMember {
    return this.staffMemberService.currentStaffMember;
  }
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  selectedTab = 0;
  containerClass = '';

  @ViewChild('homeTabs') homeTabs: TabsetComponent;

  constructor(private authService: AuthService, private staffMemberService: StaffMemberService, private sharedService: SharedService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('this is from the getter',this.sharedService.dropdownListInfo);
    console.log('current user', this.staffMemberService.currentStaffMember);
    this.sharedService.getDropdownListInfo().subscribe();
    this.staffMemberService.getCurrentStaffMember().subscribe();

    this.route.queryParams.subscribe(params =>  {
      this.selectedTab = params['selectedTab'] || AppUtils.homeSelectedTab || 0;
      this.homeTabs.tabs[this.selectedTab].active = true;
    });
  }

  onSelect(data: TabDirective): void {
    setTimeout(() => {
      this.router.navigate(['/home']);
      this.selectedTab = data.tabset.tabs.findIndex(item => item.active);
      AppUtils.homeSelectedTab = this.selectedTab;
      AppUtils.isDiarySearchVisible = false;
      if (this.selectedTab === 1) {
        this.sharedService.scrollTodayIntoView();
        this.sharedService.scrollCurrentHourIntoView();
      } else {
        window.scrollTo(0, 0);
      }
    });
  }

  navLeft() {
    if (this.homeTabs.tabs[this.selectedTab - 1]) {
      this.homeTabs.tabs[this.selectedTab - 1].active = true;
      this.containerClass = '';
    }
  }

  navRight() {
    if (this.homeTabs.tabs[this.selectedTab + 1]) {
      this.homeTabs.tabs[this.selectedTab + 1].active = true;
      this.containerClass = '';
    }
  }

  navLeftHint(event) {
    if (this.homeTabs.tabs[this.selectedTab - 1] && event.distance > (window.innerWidth * 0.5) && !this.containerClass) {
      this.containerClass = 'nav-left';

      if (event.isFinal) {
        this.containerClass = '';
      }
    }
  }

  navRightHint(event) {
    if (this.homeTabs.tabs[this.selectedTab + 1] && event.distance > (window.innerWidth * 0.5) && !this.containerClass) {
      this.containerClass = 'nav-right';

      if (event.isFinal) {
        this.containerClass = '';
      }
    }
  }

  onPanEnd(event) {
    if (event.distance > (window.innerWidth * 0.5)) {
      if (event.additionalEvent === 'panleft') {
        this.navRight();
      } else if (event.additionalEvent === 'panright') {
        this.navLeft();
      }
    }

    setTimeout(() => {
      this.containerClass = '';
    });
  }
}
