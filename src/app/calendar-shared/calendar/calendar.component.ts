import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { CalendarEvent, CalendarDateFormatter, CalendarView, CalendarWeekViewBeforeRenderEvent, CalendarDayViewBeforeRenderEvent, DAYS_OF_WEEK, CalendarEventTitleFormatter, CalendarMonthViewBeforeRenderEvent } from 'angular-calendar';
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
import { CustomDateFormatter } from '../custom-date-formatter.provider';
import { Observable } from 'rxjs';
import { DiaryEvent, BasicEventRequest, Staff, DiaryProperty } from '../../diary/shared/diary';
import { DiaryEventService } from '../../diary/shared/diary-event.service';
import { tap, map } from 'rxjs/operators';
import { CustomEventTitleFormatter } from '../custom-event-title-formatter.provider';
import * as _ from 'lodash';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail, DropdownListInfo } from 'src/app/core/services/info.service';
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter
    },
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ]
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() staffMemberId: number;
  @Input() myCalendarOnly: boolean;
  @Output() selectedDate = new EventEmitter<any>();
  view: CalendarView | 'month' | 'week' | 'threeDays' | 'day' = CalendarView.Week;
  daysInWeek;
  viewDate: Date = new Date();
  weekStartsOn = DAYS_OF_WEEK.MONDAY;
  clickedDate: Date;
  clickedColumn: number;

  events$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>;
  myEvents$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>;
  diaryEvents: DiaryEvent[];
  activeDayIsOpen: boolean;
  viewingArrangements: InfoDetail[];
  id: number;

  constructor(private diaryEventService: DiaryEventService, private storage: StorageMap) { }

  ngOnInit() {
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) { this.viewingArrangements = data.viewingArrangements; }
    });
    this.getDiaryEvents();
  }

  ngOnChanges() {
    if (this.staffMemberId) {
      this.id = this.staffMemberId;
      this.getDiaryEvents();
    }
  }
  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent) {
    this.weekStartsOn = DAYS_OF_WEEK.MONDAY;
    this.daysInWeek = null;
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    this.currentTimeIntoView();
    if (this.view === 'threeDays') {
      this.daysInWeek = 3;
      this.weekStartsOn = null;
    } else {
      this.daysInWeek = null;
      this.weekStartsOn = DAYS_OF_WEEK.MONDAY;
    }
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    this.currentTimeIntoView();
  }

  currentTimeIntoView() {
    const calHourSegments = document.getElementsByClassName('cal-hour-segment');

    setTimeout(() => {
      if (calHourSegments && calHourSegments.length) {
        if(window.innerWidth >= 1024) {

          console.log(calHourSegments[21])
          calHourSegments[23].scrollIntoView({ block: 'center' });
        } else {
          calHourSegments[19].scrollIntoView({ block: 'center' });
        }
      }
    });
  }


  getDiaryEvents(isCancelledVisible?: boolean) {
    console.log('id in calendar', this.staffMemberId)
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      threeDays: startOfWeek,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      threeDays: endOfWeek,
      day: endOfDay
    }[this.view];

    const request = {
      staffMemberId: this.id,
      startDate: format(getStart(this.viewDate), 'YYYY-MM-DD'),
      endDate: format(getEnd(this.viewDate), 'YYYY-MM-DD'),
    } as BasicEventRequest;
    this.events$ = this.diaryEventService.getDiaryEvents(request)
      .pipe(
        tap(data => this.diaryEvents = data),
        map(result => {
          return result.map(diary => {
            const title = diary.subject || diary.eventType;
            const start = new Date(diary.startDateTime);
            const end = new Date(diary.endDateTime);
            const allDay = diary.allDay;
            const meta = diary;
            this.setViewingArrangement(diary.properties);
            const members = this.getStaff(meta.staffMembers);
            let cssClass = '';
            cssClass += meta.isCancelled ? 'is-cancelled' : '';
            cssClass += meta.isHighImportance ? ' is-important' : '';
            cssClass += meta.isConfirmed ? ' is-confirmed' : '';
            if (!meta.isCancelled || isCancelledVisible) {
              return { title, start, end, allDay, meta, members, cssClass } as CalendarEvent;
            } else {
              return {} as CalendarEvent;
            }
          });
        }),
      );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  getClickedDate(date: Date) {
    if (date) {
      this.selectedDate.emit(date);
      console.log('clicked date', date);
    }
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

  getStaff(members: BaseStaffMember[]) {
    if (members && members.length > 5) {
      return _.take(members, 5);
    }
    return members;
  }

  setViewingArrangement(properties: DiaryProperty[]) {
    if (this.viewingArrangements && properties && properties.length) {
      const values = Object.values(this.viewingArrangements);
      for (const property of properties) {
        values.forEach(x => {
          if (x.id === property.viewingArragementId) {
            property.viewingArragement = x.value;
          }
        });
      }
      console.log('viewings arrangements', properties)
    }
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
