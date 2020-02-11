import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseStaffMember } from '../shared/models/base-staff-member';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent implements OnChanges {

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
  // accounts = [
  //     { name: 'Adam', email: 'adam@email.com', age: 12, category: 'Preferred', child: { state: 'Active' } },
  //     { name: 'Homer', email: 'homer@email.com', age: 47, category: 'Preferred', child: { state: 'Active' } },
  //     { name: 'Samantha', email: 'samantha@email.com', age: 30, category: 'Preferred', child: { state: 'Active' } },
  //     { name: 'Amalie', email: 'amalie@email.com', age: 12, category: 'Others', child: { state: 'Active' } },
  //     { name: 'Estefanía', email: 'estefania@email.com', age: 21, category: 'Others', child: { state: 'Active' } },
  //     { name: 'Adrian', email: 'adrian@email.com', age: 21, category: 'Others', child: { state: 'Active' } },
  //     { name: 'Wladimir', email: 'wladimir@email.com', age: 30, category: 'Others', child: { state: 'Inactive' } },
  //     { name: 'Natasha', email: 'natasha@email.com', age: 54, category: 'Others', child: { state: 'Inactive' } },
  //     { name: 'Nicole', email: 'nicole@email.com', age: 43, category: 'Others', child: { state: 'Inactive' } },
  //     { name: 'Michael', email: 'michael@email.com', age: 15, category: 'Others', child: { state: 'Inactive' } },
  //     { name: 'Nicolás', email: 'nicole@email.com', age: 43, category: 'Others', child: { state: 'Inactive' } }
  // ];
  staffMembers = [
    { staffMemberId: 2484, fullName: 'Gabor Remenyi', emailAddress: 'gremenyi@dng.co.uk', hasReminder: null },
    { staffMemberId: 2127, fullName: 'Matt Easley', emailAddress: 'measley@dng.co.uk', hasReminder: null },
    { staffMemberId: 2606, fullName: 'Elia Fulchignoni', emailAddress: 'efulchignoni@dng.co.uk' },
    { staffMemberId: 2523, fullName: 'Alexander Agyapong', emailAddress: 'aagyapong@dng.co.uk' },
    { staffMemberId: 2537, fullName: 'Mansoor Malik', emailAddress: 'mmalik@dng.co.uk', hasReminder: null }
  ];
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.diaryHeaderForm = this.fb.group({
      viewMode: this.view,
      showCancelled: false,
      staffMember: null
    });
  }

  ngOnChanges() {
    if (this.view) {
      this.getLabel();
    }
  }

  onStaffMemberChange(staffMember: BaseStaffMember){
    this.staffMemberChange.emit(staffMember.staffMemberId);
    console.log('staff member Id', staffMember.staffMemberId)
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
