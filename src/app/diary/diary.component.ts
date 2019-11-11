import { Component, OnInit, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DiaryEvent, ViewMode } from './shared/diary';
import { AppUtils } from '../core/shared/utils';
import * as dayjs from 'dayjs';
import { SharedService } from '../core/services/shared.service';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { DiaryEventService } from './shared/diary-event.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit, AfterViewInit {
  isDropup = false;
  public diaryEventForm: FormGroup;
  diaryEvent: DiaryEvent;
  diaryEvents: DiaryEvent[];
  days: any[];
  today = dayjs();
  todayMonth = this.today.month();
  todayYear = this.today.year();
  viewedDate = this.today;
  viewedMonth = this.todayMonth;
  viewedYear = this.todayYear;
  viewMode = 'workingWeek';
  setTodayLabel = 'This ' + this.viewMode;
  monthLabel = dayjs().month(this.viewedMonth).format('MMM');
  hours: any[] = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  @ViewChildren(PopoverDirective) popovers: QueryList<PopoverDirective>;
  @ViewChildren(TooltipDirective) tooltips: QueryList<TooltipDirective>;

  appUtils = AppUtils;
  diaryHeaderForm: FormGroup;

  constructor(protected fb: FormBuilder,
    private diaryEventService: DiaryEventService,
    protected sharedService: SharedService) { }

  ngOnInit() {
    this.diaryHeaderForm = this.fb.group({
      viewMode: ['workingWeek']
    });
    this.setupForm();
    this.setDropup();
    this.setToday();
    this.getDiaryEvents();
    console.log('working week', ViewMode.workingWeek)
  }

  ngAfterViewInit() {
    this.popoverSubscribe();
  }

  // getEvents(diaryEvents:DiaryEvent[]) {

  //   const events = [];
  //   if(diaryEvents && diaryEvents.length) {
  //     diaryEvents.forEach((event)=>{
  //       event['type'] = event.eventType;
  //       event['time'] = '00:00';
  //       event['duration'] = Math.random() * Math.floor(6) * 2.085 + 2.085 + '%';
  //       event['position'] = Math.random() * Math.floor(36) * 2.085 + '%';
  //       event['title'] = event.eventType;
  //       event['notes'] = event.notes;
  //       event['color'] = event.eventColour;
  //       events.push(event);
  //       console.log('event',event )
  //     })
  //   }
  //   console.log('events',events )
  //   return events;
  // }
  getEvents() {
    const events = [];
    const counter = Math.floor(Math.random() * Math.floor(3) + 1);

    for (let i = 1; i < counter; i++) {
      const event = new Object;
      const counter1 = Math.floor(Math.random() * Math.floor(2));
      event['type'] = counter1;
      event['time'] = '00:00';
      event['duration'] = Math.random() * Math.floor(6) * 2.085 + 2.085 + '%';
      event['position'] = Math.random() * Math.floor(36) * 2.085 + '%';
      event['title'] = 'This is the event title';
      event['notes'] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      event['color'] = this.getRandomColor();

      events.push(event);

    }

    return events;
  }

  getDiaryEvents() {
    this.diaryEventService.getDiaryEvents('2018-10-01', '2019-11-08').subscribe(data => {
      this.diaryEvents = data;
      // this.getEvents(data);
      console.log('my diary here', data)
    });
  }
  setupForm() {
    this.diaryEventForm = this.fb.group({
      startDateTime: AppUtils.getMomentDate(new Date()),
      endDateTime: Date,
      eventType: [''],
      eventColour: [''],
      notes: [''],
      allDay: [false],
      isCancelled: [false],
      isConfirmed: [false],
      isHighImportance: [false],
      isOtherAgentViewing: [false],
    });
  }

  displayEvents(diaryEvent: DiaryEvent) {
    this.diaryEvent = diaryEvent;
    if (diaryEvent) {
      this.diaryEventForm.patchValue({
        startDateTime: diaryEvent.startDateTime,
        endDateTime: diaryEvent.endDateTime,
        eventType: diaryEvent.eventType,
        eventColour: diaryEvent.eventColour,
        notes: diaryEvent.notes,
        allDay: diaryEvent.allDay,
        isCancelled: diaryEvent.isCancelled,
        isConfirmed: diaryEvent.isConfirmed,
        isHighImportance: diaryEvent.isHighImportance,
        isOtherAgentViewing: diaryEvent.isOtherAgentViewing
      });
    }
  }

  popoverSubscribe() {
    this.popovers.forEach((popover: PopoverDirective) => {
      popover.onShown.subscribe(() => {
        this.popovers
          .filter(p => p !== popover)
          .forEach(p => p.hide());
        this.tooltips
          .forEach(t => t.hide());
      });
    });
  }

  setDropup() {
    if (window.innerWidth < 576) {
      this.isDropup = true;
    } else {
      this.isDropup = false;
    }
  }

  makeDayObj(date) {
    const dayObj = new Object();
    const day = date;

    dayObj['date'] = day;

    if (day.year() == this.todayYear) {
      dayObj['label'] = day.format('ddd D MMM');
    } else {
      dayObj['label'] = day.format('ddd D MMM YYYY');
    }
    dayObj['isWeekend'] = day.day() === 0;
    dayObj['isToday'] = day.isSame(this.today, 'day');
    dayObj['spanClass'] = 'span-' + day.day();
    dayObj['events'] = this.getEvents(this.diaryEvents);
    dayObj['isClickable'] = day.isSame(this.today, 'day') || day.isAfter(this.today, 'day');

    return dayObj;
  }

  getDaysInMonth(month, year) {
    const days = [];
    let date = dayjs(new Date(year, month, 1));

    this.viewedMonth = month;
    this.viewedYear = year;
    this.viewedDate = date;
    this.monthLabel = date.month(month).format('MMM YYYY');

    while (date.month() === month) {
      days.push(this.makeDayObj(date));
      date = date.add(1, 'day');
    }
    return days;
  }

  getDaysInWeek(date) {
    const curr = date;
    const week = new Array();
    this.viewedDate = curr;
    this.viewedMonth = curr.month();
    this.viewedYear = curr.year();
    this.monthLabel = curr.month(this.viewedMonth).format('MMM YYYY');

    for (let i = 0; i < 7; i++) {
      const first = curr.date() - curr.day() + i;
      const firstDate = curr.date(first);
      if (this.viewedMonth !== firstDate.month()) {
        if (this.viewedYear < firstDate.year()) {
          this.monthLabel = this.viewedDate.format('MMM YYYY') + ' - ' + firstDate.format('MMM YYYY');
        } else {
          this.monthLabel = firstDate.format('MMM YYYY') + ' - ' + this.viewedDate.format('MMM YYYY');
        }
      }
      week.push(
        this.makeDayObj(firstDate)
      );
    }

    this.sharedService.scrollCurrentHourIntoView();

    return week;
  }

  getDay(date) {
    let curr = date;
    let day = new Array();
    this.monthLabel = curr.format('MMM YYYY')
    day.push(this.makeDayObj(curr));
    this.viewedDate = curr;
    this.viewedMonth = curr.month();
    this.viewedYear = curr.year();

    this.sharedService.scrollCurrentHourIntoView();

    return day;
  }

  prevMonth() {
    switch (this.viewMode) {
      case 'month':
        if (this.viewedMonth === 0) {
          this.days = this.getDaysInMonth(11, this.viewedYear - 1);
        } else {
          this.days = this.getDaysInMonth(this.viewedMonth - 1, this.viewedYear);
        }
        break;
      case 'day':
        this.days = this.getDay(this.viewedDate.subtract(1, 'day'));
        break;
      default:
        this.days = this.getDaysInWeek(this.viewedDate.subtract(7, 'day'));
    }
    //window.scrollTo(0, 0);
    setTimeout(() => {
      this.popoverSubscribe();
    })
  }

  nextMonth() {
    switch (this.viewMode) {
      case 'month':
        if (this.viewedMonth === 11) {
          this.days = this.getDaysInMonth(0, this.viewedYear + 1);
        } else {
          this.days = this.getDaysInMonth(this.viewedMonth + 1, this.viewedYear);
        }
        break;
      case 'day':
        this.days = this.getDay(this.viewedDate.add(1, 'day'));
        break;
      default:
        this.days = this.getDaysInWeek(this.viewedDate.add(7, 'day'));
    }
    //window.scrollTo(0, 0);
    setTimeout(() => {
      this.popoverSubscribe();
    })
  }

  setToday() {
    this.viewedDate = this.today;
    this.viewedMonth = this.todayMonth;
    this.viewedYear = this.todayYear;

    this.changeView();
  }

  enterView(date, mode) {
    this.viewedDate = date || this.viewedDate;
    this.viewMode = mode;
    this.changeView();
    window.scrollTo(0, 0);
  }

  changeView(mode?: any) {
    this.viewMode = mode;
    if (window.innerWidth < 576) {
      if (this.viewMode !== 'day') {
        this.viewMode = 'month';

        this.sharedService.scrollTodayIntoView();
      }
    }

    switch (this.viewMode) {
      case 'month':
        this.days = this.getDaysInMonth(this.viewedMonth, this.viewedYear);
        this.setTodayLabel = 'This ' + this.viewMode;
        break;
      case 'day':
        this.days = this.getDay(this.viewedDate);
        this.setTodayLabel = 'Today';
        break;
      default:
        this.days = this.getDaysInWeek(this.viewedDate);
        this.setTodayLabel = 'This week';
    }
    setTimeout(() => {
      this.popoverSubscribe();
    })
  }

  toggleSearch() {
    AppUtils.isDiarySearchVisible = !AppUtils.isDiarySearchVisible;
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }






}
