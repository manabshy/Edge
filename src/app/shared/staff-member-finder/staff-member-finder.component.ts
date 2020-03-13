import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseStaffMember } from '../models/base-staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-staff-member-finder',
  templateUrl: './staff-member-finder.component.html',
  styleUrls: ['./staff-member-finder.component.scss']
})
export class StaffMemberFinderComponent implements OnInit, OnChanges {
  @Input() staffMember: BaseStaffMember;
  @Input() staffMemberId: number;
  @Input() staffMemberIdList: number[];
  @Input() listType: string;
  @Input() isDisabled: boolean;
  @Input() isRequired: boolean;
  @Input() isMultiple: boolean;
  @Input() isReadOnly: boolean;
  @Output() selectedStaffMemberId = new EventEmitter<number>();
  @Output() selectedStaffMemberList = new EventEmitter<BaseStaffMember[] | any>();
  staffMembers$ = new Observable<any>();
  staffMemberFinderForm: FormGroup;
  selectedStaffMembers: BaseStaffMember[] = [];
  isClearable = true;
  constructor(private staffMemberService: StaffMemberService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.staffMemberFinderForm = new FormGroup({
      staffMemberId: new FormControl()
    });

    this.getStaffMembers();
  }

  ngOnChanges() {
    this.getStaffMembers(this.listType);
    if (this.staffMemberId) {
      this.staffMemberFinderForm.patchValue({
        staffMemberId: this.staffMemberId
      });
    }
    if (this.staffMemberIdList && this.staffMemberIdList.length) {
      console.log('staff ids', this.staffMemberIdList)
      this.isClearable = false;
      this.staffMemberFinderForm.patchValue({
        staffMemberId: this.staffMemberIdList
      });
    }
  }

  onStaffMemberChange(staffMember: BaseStaffMember) {
    if (staffMember) {
      this.selectedStaffMemberId.emit(staffMember.staffMemberId);
      this.selectedStaffMemberList.emit(staffMember);
      console.log('selected', staffMember);
    } else {
      this.selectedStaffMemberId.emit(0);
    }
  }

  private getStaffMembers(listType?: string) {
    switch (listType) {
      case 'allValuers':
        this.getAllValuers();
        break;
      case 'calendarStaffMembers':
        this.getAllCalendarStaffMembers();
        break;
      default:
        this.getAllStaffMembers();
    }
  }

  getAllStaffMembers() {
    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers$ = of(data as BaseStaffMember[]);
      } else {
        this.staffMemberService.getAllStaffMembers().subscribe(res => this.staffMembers$ = of(res));
      }
    });
  }
  getAllCalendarStaffMembers() {
    this.storage.get('calendarStaffMembers').subscribe(data => {
      if (data) {
        this.staffMembers$ = of(data as BaseStaffMember[]);
      } else {
        this.staffMemberService.getStaffMembersForCalendar().subscribe(res => this.staffMembers$ = of(res));
      }
    });
  }

  private getAllValuers() {
    this.storage.get('allListers').subscribe(data => {
      if (data) {
        this.staffMembers$ = of(data as BaseStaffMember[]);
      } else {
        this.staffMemberService.getValuers().subscribe(res => this.staffMembers$ = of(res));
      }
    });
  }
}
