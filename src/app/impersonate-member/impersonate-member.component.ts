import { Component, OnInit } from '@angular/core';
import { StaffMemberService } from '../core/services/staff-member.service';
import { Impersonation } from '../core/models/staff-member';

@Component({
  selector: 'app-impersonate-member',
  templateUrl: './impersonate-member.component.html',
  styleUrls: ['./impersonate-member.component.scss']
})
export class ImpersonateMemberComponent implements OnInit {
  impersonationList: Impersonation[];

  constructor(private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.staffMemberService.getImpersonationList().subscribe(data => {
      if (data) {
        this.impersonationList = data;
      }
      console.log('impersonation list', this.impersonationList);
    });
  }

}
