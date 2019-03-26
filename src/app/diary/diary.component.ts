import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { DiaryEvent, newEventForm, DiaryEventTypesEnum, newPropertyForm } from './shared/diary';
import { AppUtils } from '../core/shared/utils';
import { addHours, isToday, getDaysInMonth } from 'date-fns';
import { daysInMonth } from 'ngx-bootstrap/chronos/units/month';
import { formatDate } from '@angular/common';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
  isDropup = false;
  public diaryEventForm: FormGroup;
  diaryEvent: DiaryEvent;
  days: any[];
  today = dayjs();
  todayMonth = this.today.month();
  todayYear = this.today.year();
  viewedDate = this.today;
  viewedMonth = this.todayMonth;
  viewedYear = this.todayYear;
  viewMode = "week";
  monthLabel = dayjs().month(this.viewedMonth).format('MMMM');

  constructor(protected fb: FormBuilder) { }

  ngOnInit() {
    this.setDropup();
    this.diaryEventForm = newEventForm();
    this.patchDateTime();
    this.setToday();
  }

  setDropup() {
    if (window.innerWidth < 576) {
      this.isDropup = true;
    } else {
      this.isDropup = false;
    }
  }

  makeDayObj(date) {
    let dayObj = new Object();
    let day = date;
    
    if (day.year() == this.todayYear) {
      dayObj['label'] = day.format('ddd D MMM');
    } else {
      dayObj['label'] = day.format('ddd D MMM YYYY');
    }
    dayObj['isWeekend'] = day.day() == 0;
    dayObj['isToday'] = day.date() == this.today.date() && day.month() == this.todayMonth && day.year() == this.todayYear;
    dayObj['spanClass'] = 'span-' + day.day();
    dayObj['events'] = this.getEvents();

    return dayObj;
  }

  getDaysInMonth(month, year) {
    let days = [];
    let date = dayjs(new Date(year, month, 1));

    this.viewedMonth = month;
    this.viewedYear = year;
    this.viewedDate = date;
    this.monthLabel = date.month(month).format('MMMM YYYY');

    while (date.month() === month) {
      date = date.add(1,'day');
      days.push(this.makeDayObj(date));
    }
    return days;
  }

  getDaysInWeek(date) {
    let curr = date;
    var week = new Array();
    this.viewedDate = curr;
    this.viewedMonth = curr.month();
    this.viewedYear = curr.year();
    this.monthLabel = curr.month(this.viewedMonth).format('MMMM YYYY');

    for (var i = 0; i < 7; i++) {
      let first = curr.date() - curr.day() + i;
      let firstDate = curr.date(first);
      if(this.viewedMonth !== firstDate.month()) {
        if(this.viewedYear <= firstDate.year()) {
          this.monthLabel = this.viewedDate.format('MMM YYYY') + ' - ' + firstDate.format('MMM YYYY');
        } else {
          this.monthLabel = firstDate.format('MMM YYYY') + ' - ' + this.viewedDate.format('MMM YYYY');
        }
      }
      week.push(
        this.makeDayObj(firstDate)
      )
    }
    return week;
  }

  prevMonth() {
    if(this.viewMode == "month") {
      if (this.viewedMonth === 0) {
        this.days = this.getDaysInMonth(11, this.viewedYear - 1);
      } else {
        this.days = this.getDaysInMonth(this.viewedMonth - 1, this.viewedYear);
      }
    } else {
      this.days = this.getDaysInWeek(this.viewedDate.subtract(7,'day'));
    }
    window.scrollTo(0,0);
  }

  nextMonth() {
    if(this.viewMode == "month") {
      if (this.viewedMonth === 11) {
        this.days = this.getDaysInMonth(0, this.viewedYear + 1);
      } else {
        this.days = this.getDaysInMonth(this.viewedMonth + 1, this.viewedYear);
      }
    } else {
      this.days = this.getDaysInWeek(this.viewedDate.add(7,'day'));
    }
    window.scrollTo(0,0);
  }

  setToday() {
    this.viewedDate = this.today;
    this.viewedMonth = this.todayMonth;
    this.viewedYear = this.todayYear;
    
    if (window.innerWidth < 576) {
      this.viewMode = 'month';
      setTimeout(() => {
        document.getElementById('today').scrollIntoView({block: 'center'});
      })
    }

    this.changeView();
  }

  changeView() {
    if(this.viewMode == 'month') {
      this.days = this.getDaysInMonth(this.viewedMonth, this.viewedYear);
    } else {
      this.days = this.getDaysInWeek(this.viewedDate);
    }
  }

  getEvents() {
    let events = [];
    let counter = Math.floor(Math.random() * Math.floor(3) + 1);

    for (let i = 1; i < counter; i++) {
      let event = new Object;
      let counter1 = Math.floor(Math.random() * Math.floor(2));
      event['type'] = counter1;
      event['time'] = "00:00";
      event['title'] = "This is the event title";

      events.push(event);

    }

    return events;
  }


  get contactGroups(): FormArray {
    return this.diaryEventForm.get('contactGroups') as FormArray;
  }

  get eventType(): string {
    return this.diaryEventForm.get('eventType').value as string;
  }

  get staffMembers(): FormArray {
    return this.diaryEventForm.get('staffMembers') as FormArray;
  }

  get properties(): FormArray {
    return this.diaryEventForm.get('properties') as FormArray;
  }
  // Patch the date/time to the next available hour
  protected patchDateTime() {

    this.diaryEventForm.patchValue({
      startDateTime: AppUtils.getMomentDate(addHours(new Date(), 1)),
      endDateTime: AppUtils.getMomentDate(addHours(new Date(), 2))
    });
  }
  get canSeeProperty(): boolean {
    const allowed = [
      DiaryEventTypesEnum.ViewingSales,
      DiaryEventTypesEnum.ViewingLettings,
      DiaryEventTypesEnum.ValuationSales,
      DiaryEventTypesEnum.ValuationLettings,
      DiaryEventTypesEnum.PropertyManagement,
    ];
    return (allowed as any[]).indexOf(this.eventType) !== -1;
  }

  /**
   * Set the first control in the array with the supplied value.
   * @param data The contact group Id to set.
   */
  set propertyCtrl(data: any) {
    this.properties.setControl(data.index, this.fb.group({
      propertyId: data.propertyId,
      propertySaleId: data.propertySaleId,
      propertyLettingId: data.propertyLettingId,
      address: data.address
    }));

  }
  // Add a new, empty property
  public addProperty(): void {
    this.properties.push(newPropertyForm());
  }

  /**
   * Delete a property at a given index
   * @param {number} index The index to delete at.
   */
  public deleteProperty(index: number): void {
    this.properties.removeAt(index);
  }

  // Delete all empty properties
  deleteEmptyProperties() {

    for (let i = this.properties.length; i--;) {
      const ctrl = this.properties.at(i);
      const id = ctrl && ctrl.get('propertyId').value;
      if (id === 0) {
        this.properties.removeAt(i);
      }
    }
  }

  public setValidatorByEventType(): void {
    switch (this.diaryEvent.eventType) {
      case DiaryEventTypesEnum.ViewingSales:
      case DiaryEventTypesEnum.ViewingLettings:
      case DiaryEventTypesEnum.ValuationSales:
      case DiaryEventTypesEnum.ValuationLettings:
      case DiaryEventTypesEnum.PropertyManagement:

        // A property and contactGroup is required
        this.diaryEventForm.controls['properties'].setValidators([Validators.required]);
        this.diaryEventForm.controls['properties'].updateValueAndValidity();
        this.diaryEventForm.controls['contactGroups'].setValidators([Validators.required]);
        this.diaryEventForm.controls['contactGroups'].updateValueAndValidity();
        break;
      default:
        // -->Set: properties validators
        this.diaryEventForm.controls['properties'].setValidators([]);
        this.diaryEventForm.controls['properties'].updateValueAndValidity();
        // -->Set: contact groups validators
        this.diaryEventForm.controls['contactGroups'].setValidators([]);
        this.diaryEventForm.controls['contactGroups'].updateValueAndValidity();
        break;
    }
  }
}
