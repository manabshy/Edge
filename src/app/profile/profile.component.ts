import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../core/services/auth.service';
import { HeaderService } from '../core/services/header.service';
import { StaffMemberService } from '../core/services/staff-member.service';
import { BaseStaffMember } from '../shared/models/base-staff-member';
import { StaffMember } from '../shared/models/staff-member';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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
    private router: Router) { }

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

  }


  logIn() {
    this.authService.login();
  }

  logOut() {
    this.authService.logout();
  }

  impersonate(stop = false) {
    console.log({ stop });
    if (stop) {
      this.showImpersonation = false;
      this.isImpersonating = false;
      this.storage.delete('signature').subscribe();
      localStorage.removeItem('impersonatedStaffMemberId');
      this.storage.delete('impersonatedStaffMember').subscribe();
      this.storage.get('originalUser').subscribe((data: StaffMember) => {
        if (data) {
          this.currentStaffMember = data;
          this.storage.set('currentUser', data).subscribe(() => {
            this.storage.delete('originalUser').subscribe();
            location.reload();
          });
        }
      });
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
    this.storage.set('originalUser', this.currentStaffMember).subscribe();
    this.storage.delete('currentUser').subscribe();
    this.storage.delete('signature').subscribe();
    this.isImpersonating = true;
    this.showImpersonation = false;

    // this.currentStaffMember.fullName = this.impersonatedStaffMember.fullName;
    // this.currentStaffMember.photoUrl = null;
    this.storage.set('impersonatedStaffMember', this.impersonatedStaffMember).subscribe();
    localStorage.setItem('impersonatedStaffMemberId', JSON.stringify(this.impersonatedStaffMember.staffMemberId));
    this.staffMemberService.impersonatedStaffMemberChanged(this.impersonatedStaffMember);
    // this.getCurrentUser();

  }

}
