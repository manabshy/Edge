import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember } from '../core/models/staff-member';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})
export class MainmenuComponent implements OnInit {
  navbarCollapsed = false;
  isLoggedIn: boolean;
  currentStaffMember: StaffMember;
  // get currentStaffMember(): StaffMember {
  //   return this.staffMemberService.currentStaffMember;
  // }

  constructor(public router: Router,
              public _location: Location,
              public authService: AuthService,
              public staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.staffMemberService.getCurrentStaffMember().subscribe(data => {
      if (data) {
        this.currentStaffMember = data;
      }
    });
  }

  backClicked() {
    this.navbarCollapsed = false;
  }

  logOut() {
    this.authService.signout();
  }

}
