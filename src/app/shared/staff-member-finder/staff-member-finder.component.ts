import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseStaffMember } from '../models/base-staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';

@Component({
  selector: 'app-staff-member-finder',
  templateUrl: './staff-member-finder.component.html',
  styleUrls: ['./staff-member-finder.component.scss']
})
export class StaffMemberFinderComponent implements OnInit {
  @Input() staffMember: BaseStaffMember;
  @Output() selectedStaffMemberId = new EventEmitter<number>();
  staffMembers$ = new Observable<any>();
  constructor(private staffMemberService: StaffMemberService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.getStaffMembers();
  }

  onStaffMemberChange(staffMember: BaseStaffMember) {
    if (staffMember) {
      this.selectedStaffMemberId.emit(staffMember.staffMemberId);
      console.log('selected', staffMember);
    } else {
      this.selectedStaffMemberId.emit(0);
    }

  }
  private getStaffMembers() {
    this.storage.get('allListers').subscribe(data => {
      if (data) {
        this.staffMembers$ = of(data as BaseStaffMember[]);
      } else {
        this.staffMemberService.getValuers().subscribe();
      }
    });
  }
}
