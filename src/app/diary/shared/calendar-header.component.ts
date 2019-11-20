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
  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  label: string;
  excludeDays = [];
  diaryHeaderForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.diaryHeaderForm = this.fb.group({
      viewMode: this.view
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
