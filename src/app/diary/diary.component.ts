import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { DiaryEvent, newEventForm, DiaryEventTypesEnum, newPropertyForm } from './shared/diary';
import { AppUtils } from '../core/shared/utils';
import { addHours, isToday, getDaysInMonth } from 'date-fns';
import { daysInMonth } from 'ngx-bootstrap/chronos/units/month';
import { formatDate } from '@angular/common';

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
  today = new Date(Date.now());
  todayMonth = this.today.getMonth();
  todayYear = this.today.getFullYear();
  viewedMonth = this.todayMonth;
  viewedYear = this.todayYear;

  months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

  constructor(protected fb: FormBuilder) { }

  ngOnInit() {
    this.setDropup();
    this.diaryEventForm = newEventForm();
    this.patchDateTime();
    this.days = this.getDaysInMonth(this.todayMonth,this.todayYear);
    this.setToday();
  }

  setDropup() {
    if (window.innerWidth < 576) {
      this.isDropup = true;
    } else {
      this.isDropup = false;
    }
  }

  getDaysInMonth(month, year) {
    let days = [];
    let date = new Date(year, month, 1);
    while(date.getMonth() === month){
      let dayObj = new Object();
      let day = new Date(date);
      date.setDate(date.getDate() + 1);
      if(day.getFullYear() == this.todayYear) {
        dayObj['label'] = formatDate(day, 'E d MMM', 'en-GB');
      } else {
        dayObj['label'] = formatDate(day, 'E d MMM y', 'en-GB');
      }
      dayObj['isWeekend'] = formatDate(day, 'E', 'en-GB') == "Sun";
      dayObj['isToday'] = day.getDate() == this.today.getDate() && day.getMonth() == this.todayMonth && day.getFullYear() == this.todayYear;
      dayObj['spanClass'] = 'span-'+ day.getDay();
      dayObj['events'] = this.getEvents();

      days.push(dayObj);
    }
    return days;
  }

  prevMonth() {
    if(this.viewedMonth === 0) {
      this.days = this.getDaysInMonth(11, this.viewedYear - 1);
      this.viewedMonth = 11;
      this.viewedYear = this.viewedYear - 1;
    } else {
      this.days = this.getDaysInMonth(this.viewedMonth - 1, this.viewedYear);
      this.viewedMonth = this.viewedMonth - 1;
    }
  }

  nextMonth() {
    if(this.viewedMonth === 11) {
      this.days = this.getDaysInMonth(0, this.viewedYear + 1);
      this.viewedMonth = 0;
      this.viewedYear = this.viewedYear + 1;
    } else {
      this.days = this.getDaysInMonth(this.viewedMonth + 1, this.viewedYear);
      this.viewedMonth = this.viewedMonth + 1;
    }
  }

  setToday() {
    this.days = this.getDaysInMonth(this.todayMonth, this.todayYear);
    this.viewedMonth = this.todayMonth;
    this.viewedYear = this.todayYear;

    if (window.innerWidth < 576) {
      document.getElementById('today').scrollIntoView();
    }
  }

  getEvents() {
    let events = [];
    let counter = Math.floor(Math.random() * Math.floor(3) + 1);

    for(let i = 1; i < counter; i++) {
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
