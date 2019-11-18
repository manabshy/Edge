import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarDateFormatter, CalendarView, CalendarWeekViewBeforeRenderEvent, CalendarDayViewBeforeRenderEvent } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
} from 'date-fns';
import { CustomDateFormatter } from '../shared/custom-date-formatter.provider';
import { Observable } from 'rxjs';
import { DiaryEvent, BasicEventRequest } from '../shared/diary';
import { DiaryEventService } from '../shared/diary-event.service';
import { tap, map } from 'rxjs/operators';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    }
  ]
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Week;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];
  events$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>;
  myEvents$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>;
  diaryEvents: DiaryEvent[];
  activeDayIsOpen: boolean;

  constructor(private diaryEventService: DiaryEventService) { }

  ngOnInit() {
    this.getDiaryEvents();
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    this.currentTimeIntoView();
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    this.currentTimeIntoView();
  }

  currentTimeIntoView() {
    const marker = document.getElementsByClassName('cal-current-time-marker');

    setTimeout(()=>{
      if(marker && marker.length) {
        marker[0].scrollIntoView({ block: 'center' });
      }
    });
  }


  getDiaryEvents() {
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay
    }[this.view];

    const request = {
      startDate: format(getStart(this.viewDate), 'YYYY-MM-DD'),
      endDate: format(getEnd(this.viewDate), 'YYYY-MM-DD'),
      staffMemberId: 2523
    } as BasicEventRequest;
    console.log('request here.....', request);
    this.events$ = this.diaryEventService.getDiaryEvents(request)
      .pipe(
        tap(data => { this.diaryEvents = data, console.log('calender events', data); }),
        map(result => {
          return result.map(diary => {
            const title = `${diary.eventType} - ${diary.notes}`;
            const start = new Date(diary.startDateTime);
            const allDay = diary.allDay;
            const meta = diary;
            return { title, start, allDay, meta } as CalendarEvent;
          });
        }),
      );
  }

  dayClicked({
    date,
    events
  }: {
    date: Date;
    events: Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>;
  }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

  // eventClicked(event: CalendarEvent<{ diaryEvent: DiaryEvent }>): void {
  //  if(event) {
  //     window.open(
  //       `https://www.themoviedb.org/movie/${event.meta.film.id}`,
  //       '_blank'
  //     );
  //  }
  // }
}


function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, '0');
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
  const direction = timezoneOffset > 0 ? '-' : '+';

  return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}
