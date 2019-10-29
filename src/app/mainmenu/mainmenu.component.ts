import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember, Impersonation } from '../core/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';

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

  // get currentStaffMember(): StaffMember {
  //   return this.staffMemberService.currentStaffMember;
  // }

  constructor(public router: Router,
    public _location: Location,
    public authService: AuthService,
    private storage: StorageMap,
    public staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.staffMemberService.getCurrentStaffMember().subscribe(data => {
      if (data) {
        this.currentStaffMember = data;
      }
    });

    this.storage.get('impersonatedStaffMember').subscribe((staffMember: Impersonation) => {
      if (staffMember) {
        this.impersonatedStaffMember = staffMember;
        console.log('selected id:', staffMember);
      }
    });
    this.staffMemberService.impersonatedStaffMember$.subscribe(data => {
      if (data) {
        this.impersonatedStaffMember = data;
        console.log('person', data);

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
