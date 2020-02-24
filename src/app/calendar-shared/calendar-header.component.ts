import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseStaffMember } from '../shared/models/base-staff-member';
import { StaffMemberService } from '../core/services/staff-member.service';
import { Observable, of } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent implements OnInit, OnChanges {

  @Input() view: CalendarView | 'month' | 'week' | 'threeDays' | 'day';
  @Input() viewDate: Date;
  @Input() locale = 'en';
  @Input() weekStartsOn;
  @Input() daysInWeek;
  @Input() myCalendarOnly: boolean;
  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter();
  @Output() staffMemberChange: EventEmitter<number> = new EventEmitter();
  label: string;
  excludeDays = [];
  diaryHeaderForm: FormGroup;
  staffMembers$ = new Observable<BaseStaffMember[]>();

  constructor(private fb: FormBuilder, private storage: StorageMap, private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.diaryHeaderForm = this.fb.group({
      viewMode: this.view,
      showCancelled: false,
      staffMember: null
    });

    this.getStaffMembersForCalendar();
  }

  ngOnChanges() {
    if (this.view) {
      this.getLabel();
    }
  }

  getStaffMembersForCalendar() {
    this.storage.get('calendarStaffMembers').subscribe(staffMembers => {
      if (staffMembers) {
        this.staffMembers$ = of(staffMembers as BaseStaffMember[]);
      } else {
        this.staffMembers$ = this.staffMemberService.getStaffMembersForCalendar();
      }
    });
  }

  onStaffMemberChange(staffMember: BaseStaffMember) {
    this.staffMemberChange.emit(staffMember.staffMemberId);
    console.log('staff member Id', staffMember.staffMemberId);
  }
  getLabel() {
    switch (this.view) {
      case 'day':
        this.label = 'Today';
        break;
      case 'month':
        this.label = 'This Month';
        break;
      default:
        this.view = 'week';
        this.label = 'This Week';
    }
  }
}
