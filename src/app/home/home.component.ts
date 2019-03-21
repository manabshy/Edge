import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { UserResult, User } from '../core/models/user';
import { UserService } from '../core/services/user.service';

import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoggedIn: boolean;
  email: string;
  firstName: string;
  staffMemberId: number;
  userResult: UserResult;
  user: User;
  selectedTab: number = 0;
  containerClass: string = '';

  @ViewChild('homeTabs') homeTabs: TabsetComponent;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    // if (this.authService.isLoggedIn()) {
    //   this.isLoggedIn = true;
    //   this.getUserByEmail(this.authService.getUsername());
    // }
  }
  getUserByEmail(username: string): void {
    this.userService.getUserByEmail(username)
      .subscribe(data => {
        this.userResult = data;
        this.email = data.result.email;
        this.staffMemberId = data.result.staffMemberId;
      },
        err => console.log(err)
      );
  }

  onSelect(data: TabDirective): void {
    setTimeout(() => {
      this.selectedTab = data.tabset.tabs.findIndex(item => item.active);
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

      if(event.isFinal) {
        this.containerClass = '';
      }
    }
  }

  navRightHint(event) {
    if (this.homeTabs.tabs[this.selectedTab + 1] && event.distance > (window.innerWidth * 0.5) && !this.containerClass) {
      this.containerClass = 'nav-right';

      if(event.isFinal) {
        this.containerClass = '';
      }
    }
  }

  onPanEnd(event) {
    if (event.distance > (window.innerWidth * 0.5)) {
      if (event.additionalEvent == "panleft") {
        this.navRight();
      } else if (event.additionalEvent == "panright") {
        this.navLeft();
      }
    }

    setTimeout(() => {
      this.containerClass = '';
    });
  }
}
