import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { StaffMember, Impersonation } from '../core/models/staff-member';
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

  // get currentStaffMember(): StaffMember {
  //   return this.staffMemberService.currentStaffMember;
  // }

  constructor(public router: Router,
    public _location: Location,
    public authService: AuthService,
    private storage: StorageMap,
    private toastr: ToastrService,
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
        this.showImpersonateBanner(this.impersonatedStaffMember, true);
      }
    });
    this.staffMemberService.impersonatedStaffMember$.subscribe(data => {
      if (data) {
        this.impersonatedStaffMember = data;
        console.log('person', data);
        this.showImpersonateBanner(this.impersonatedStaffMember);
      }
    });
  }

  showImpersonateBanner(member: Impersonation, existing?:boolean) {
    if(!existing){
      this.toastr.clear(this.impersonateToastr.toastId);
    }
    this.impersonateToastr = this.toastr.warning('<div class="row align-items-center"><div class="col">You\'re acting on behalf of <b>' + member.fullName + '</b></div><div class="col-auto"><a class="btn btn-danger text-white ml-2">Stop</a></div>', '', {
      disableTimeOut: true
    });
    this.impersonateToastr
      .onTap
      .pipe(take(1))
      .subscribe(() => {
        console.log('unimpersonate');
      });
  }

  backClicked() {
    this.navbarCollapsed = false;
  }

  logOut() {
    this.authService.signout();
  }

}
