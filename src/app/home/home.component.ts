import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { UserResult, User } from '../core/models/user';
import { StaffMemberService } from '../core/services/staff-member.service';

import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';
import { AppUtils } from '../core/shared/utils';
import { StaffMember } from '../core/models/staff-member';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentStaffMember: StaffMember;
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  selectedTab = 0;
  containerClass = '';

  @ViewChild('homeTabs') homeTabs: TabsetComponent;

  constructor(private authService: AuthService, private userService: StaffMemberService) { }

  ngOnInit() {
    this.getCurrentStaffMember();
    if (AppUtils.homeSelectedTab) {
      this.homeTabs.tabs[AppUtils.homeSelectedTab].active = true;
    }
  }
  getCurrentStaffMember(): void {
    this.userService.getCurrentStaffMember()
      .subscribe(data => {
        this.currentStaffMember = data;
        console.log(this.currentStaffMember);
        console.log(this.currentStaffMember.staffMemberId);
      },
        err => console.log(err)
      );
  }

  onSelect(data: TabDirective): void {
    setTimeout(() => {
      this.selectedTab = data.tabset.tabs.findIndex(item => item.active);
      AppUtils.homeSelectedTab = this.selectedTab;
      AppUtils.isDiarySearchVisible = false;
      if (window.innerWidth < 576) {
        if (document.getElementById('today') && this.selectedTab === 1) {
          document.getElementById('today').scrollIntoView({block: 'center'});
        } else {
          window.scrollTo(0, 0);
        }
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
