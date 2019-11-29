import { Component, OnInit } from '@angular/core';
import { StaffMemberService } from '../core/services/staff-member.service';
import { Impersonation, StaffMember } from '../shared/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-impersonate-member',
  templateUrl: './impersonate-member.component.html',
  styleUrls: ['./impersonate-member.component.scss']
})
export class ImpersonateMemberComponent implements OnInit {
  impersonationList: Impersonation[];

  constructor(private staffMemberService: StaffMemberService, private storage: StorageMap) { }

  ngOnInit() {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.impersonationList = data.impersonations;
      }
      console.log('impersonation list', this.impersonationList);
    });

  }

  selectStaffMember(person: Impersonation) {
    if (person) {
      this.storage.set('impersonatedStaffMember', person).subscribe();
      this.staffMemberService.impersonatedStaffMemberChanged(person);
    }
  }
}
