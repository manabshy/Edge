import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CalendarView } from 'angular-calendar';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  label: string;
  excludeDays = [];
  diaryHeaderForm: FormGroup;
  accounts = [
      { name: 'Adam', email: 'adam@email.com', age: 12, category: 'Preferred', child: { state: 'Active' } },
      { name: 'Homer', email: 'homer@email.com', age: 47, category: 'Preferred', child: { state: 'Active' } },
      { name: 'Samantha', email: 'samantha@email.com', age: 30, category: 'Preferred', child: { state: 'Active' } },
      { name: 'Amalie', email: 'amalie@email.com', age: 12, category: 'Others', child: { state: 'Active' } },
      { name: 'Estefanía', email: 'estefania@email.com', age: 21, category: 'Others', child: { state: 'Active' } },
      { name: 'Adrian', email: 'adrian@email.com', age: 21, category: 'Others', child: { state: 'Active' } },
      { name: 'Wladimir', email: 'wladimir@email.com', age: 30, category: 'Others', child: { state: 'Inactive' } },
      { name: 'Natasha', email: 'natasha@email.com', age: 54, category: 'Others', child: { state: 'Inactive' } },
      { name: 'Nicole', email: 'nicole@email.com', age: 43, category: 'Others', child: { state: 'Inactive' } },
      { name: 'Michael', email: 'michael@email.com', age: 15, category: 'Others', child: { state: 'Inactive' } },
      { name: 'Nicolás', email: 'nicole@email.com', age: 43, category: 'Others', child: { state: 'Inactive' } }
  ];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.diaryHeaderForm = this.fb.group({
      viewMode: this.view,
      showCancelled: false,
      staffMember: ['Adam']
    });
  }

  ngOnChanges() {
    if (this.view) {
      this.getLabel();
    }
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
