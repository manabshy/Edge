import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ChangeDetectorRef, ViewChild, ElementRef, Renderer2, AfterViewChecked, OnDestroy } from '@angular/core';
import {
  CalendarEvent, CalendarDateFormatter, CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent, DAYS_OF_WEEK, CalendarEventTitleFormatter, CalendarMonthViewBeforeRenderEvent
} from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  addDays,
  addMinutes,
  isSameMinute,
  addHours,
  getDaysInMonth
} from 'date-fns';
import { CustomDateFormatter } from '../custom-date-formatter.provider';
import { Observable, fromEvent, of, combineLatest, merge, Subscription } from 'rxjs';
import { DiaryEvent, BasicEventRequest, Staff, DiaryProperty } from '../../diary/shared/diary';
import { DiaryEventService } from '../../diary/shared/diary-event.service';
import { tap, map, takeUntil, finalize } from 'rxjs/operators';
import { CustomEventTitleFormatter } from '../custom-event-title-formatter.provider';
import { WeekViewHourSegment } from 'calendar-utils';
import * as _ from 'lodash';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail, DropdownListInfo } from 'src/app/core/services/info.service';
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarView } from '../shared/calendar-shared';
import { isSame } from 'ngx-bootstrap/chronos/public_api';


function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}
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
export class CalendarComponent implements OnInit, OnChanges, AfterViewChecked, OnDestroy {
  @Input() staffMemberId: number;
  @Input() myCalendarOnly: boolean;
  @Input() isSelectingDate: boolean;
  @Output() selectedDate = new EventEmitter<any>();
  @ViewChild('calendarContainer', { static: true }) calendarContainer: ElementRef;
  view: CalendarView | 'month' | 'week' | 'threeDays' | 'day' = CalendarView.Week;
  daysInWeek;
  viewDate: Date = new Date();
  weekStartsOn = DAYS_OF_WEEK.MONDAY;
  clickedDate: Date;
  clickedColumn: number;

  events$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>;
  myEvents$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>;
  diaryEvents: CalendarEvent[];
  activeDayIsOpen: boolean;
  viewingArrangements: InfoDetail[];
  id: number;
  selectedStaffMemberId: number;

  // draggable
  newEvents: CalendarEvent[] = [];
  dragToCreateActive = false;
  diaryEvents$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>;

  dairyEventSubscription: Subscription;
  movedToView=false

  constructor(private diaryEventService: DiaryEventService,
    private renderer: Renderer2,
    private storage: StorageMap,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.selectedStaffMemberId = +params['staffMemberId'] || 0;
      console.log('id in calendar', this.selectedStaffMemberId);
      if(params['selectedDate']){
        this.viewDate =  new Date(+params['selectedDate']);
        this.view = params['calendarView'];
      }
      this.getDiaryEvents();
      
    });

    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) { this.viewingArrangements = data.viewingArrangements; }
    });

    if (window.innerWidth < 1024) {
      this.view = CalendarView.ThreeDays;
    }
    // this.getDiaryEvents();
  }

  ngAfterViewChecked() {

    const calContainer = this.calendarContainer.nativeElement;
    let gap = 20;
    if (window.innerWidth < 576) {
      gap += 50;
    }
    const maxHeight = `${window.innerHeight - calContainer.getBoundingClientRect().top - gap}px`;
    this.renderer.setStyle(calContainer, 'max-height', maxHeight);

    this.cdr.detectChanges();
  }

  ngOnChanges() {
    if (this.staffMemberId) {
      this.id = this.staffMemberId;
      this.getDiaryEvents();
    }
  }

  passDateToRouter() {
    this.router.navigate(['/'], {
      queryParams: { selectedDate: this.viewDate.getTime(), calendarView: this.view },
      queryParamsHandling: 'merge'
    });
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent) {
    this.weekStartsOn = DAYS_OF_WEEK.MONDAY;
    const date = getDaysInMonth(this.viewDate);
    this.daysInWeek = date;
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    if (this.view === CalendarView.ThreeDays) {
      this.daysInWeek = 3;
      this.weekStartsOn = null;
    } else {
      this.daysInWeek = null;
      this.weekStartsOn = DAYS_OF_WEEK.MONDAY;
    }
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    this.daysInWeek = 1;
  }

  currentTimeIntoView() {
    const calHourSegments = document.getElementsByClassName('cal-hour-segment');

    setTimeout(() => {
      if (calHourSegments && calHourSegments.length) {
        if (window.innerWidth >= 1024) {
          calHourSegments[23].scrollIntoView({ block: 'center' });
        } else {
          calHourSegments[22].scrollIntoView({ block: 'center' });
        }
      }
    });
  }

  getSelectedStaffMemberDiaryEvents(staffMemberId: number) {
    // this.id = staffMemberId;
    // this.getDiaryEvents();
    console.log('get selected id from output event', staffMemberId);
  }

  getDiaryEvents(isCancelledVisible?: boolean, date?: Date) {
    function startOfThreeDays(date:Date){
      return new Date(date)
    }
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      threeDays: startOfThreeDays,
      day: startOfDay
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      threeDays: endOfWeek,
      day: endOfDay
    }[this.view];
    const request = {
      staffMemberId: this.selectedStaffMemberId || this.id,
      startDate: format(getStart(this.viewDate), 'YYYY-MM-DD'),
      endDate: format(getEnd(this.viewDate), 'YYYY-MM-DD'),
    } as BasicEventRequest;
    if (date) {
      request.startDate = format(getStart(date), 'YYYY-MM-DD');
      request.endDate = format(getStart(date), 'YYYY-MM-DD');
    }
    if(this.view === CalendarView.ThreeDays){
      request.endDate=format((addDays(this.viewDate,3)), 'YYYY-MM-DD')
    }
    this.dairyEventSubscription = this.diaryEventService.getDiaryEvents(request).subscribe(result => {
      this.diaryEvents = [];
      //when the events arrive the view needs to scroll to 8AM
      this.currentTimeIntoView()
      return result.map(diary => {
        const title = diary.subject || diary.eventType;
        const start = new Date(diary.startDateTime);
        const end = diary.allDay ? null : new Date(diary.endDateTime);
        const allDay = diary.allDay;
        const meta = diary;
        this.setViewingArrangement(diary.properties);
        const members = this.getStaff(meta.staffMembers);
        let cssClass = '';
        cssClass += meta.isCancelled ? 'is-cancelled' : '';
        cssClass += meta.isHighImportance ? ' is-important' : '';
        cssClass += meta.isConfirmed ? ' is-confirmed' : '';
        if (!meta.isCancelled || isCancelledVisible) {
          this.diaryEvents.push({ title, start, end, allDay, meta, members, cssClass } as CalendarEvent
          );
        }
      });
    });
  }

  eventClicked({ event }: { event: CalendarEvent }) {
    const clickedEvent = { ...event.meta } as DiaryEvent;
    if (!clickedEvent.isBusy) {
      if (+clickedEvent.eventTypeId === 8 || +clickedEvent.eventTypeId === 2048) {
        this.router.navigate(['/valuations-register/detail', clickedEvent.properties[0].propertyEventId, 'edit']);
      } else {
        this.router.navigate(['/diary/edit', clickedEvent.diaryEventId],
          {
            queryParams: { staffMemberId: this.id || this.selectedStaffMemberId, graphEventId: clickedEvent.exchangeGUID }
          });
      }
    }
  }

  getClickedDate(date: Date) {
    if (date) {
      this.selectedDate.emit(date);
      console.log('clicked date', date);
    }
  }

  getDateChange(date) {
    this.viewDate = date;
    this.passDateToRouter()
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
    }
  }

  trackByFn(index, item: DiaryEvent) {
    if (!item) { return null; }
    return item.diaryEventId;
  }

  // New draggable here....
  startDragToCreate(segment: WeekViewHourSegment, mouseDownEvent: MouseEvent, segmentElement: HTMLElement) {
    if (!this.isSelectingDate) {
      const dragToSelectEvent: CalendarEvent = {
        id: this.diaryEvents.length,
        title: 'New event',
        start: segment.date,
        meta: {
          tmpEvent: true
        }
      };
      this.diaryEvents = [...this.diaryEvents, dragToSelectEvent];
      const segmentPosition = segmentElement.getBoundingClientRect();
      this.dragToCreateActive = true;
      const endOfView = endOfWeek(this.viewDate, {
        weekStartsOn: this.weekStartsOn
      });

      fromEvent(document, 'mousemove')
        .pipe(
          finalize(() => {
            delete dragToSelectEvent.meta.tmpEvent;
            this.dragToCreateActive = false;
            this.refresh();
          }),
          takeUntil(fromEvent(document, 'mouseup'))
        )
        .subscribe((mouseMoveEvent: MouseEvent) => {
          const minutesDiff = ceilToNearest(
            mouseMoveEvent.clientY - segmentPosition.top,
            30
          );

          const daysDiff =
            floorToNearest(
              mouseMoveEvent.clientX - segmentPosition.left,
              segmentPosition.width
            ) / segmentPosition.width;

          const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
          if (newEnd > segment.date && newEnd < endOfView) {
            dragToSelectEvent.end = newEnd;
          }
          this.refresh();
        });
    }
  }


  private refresh() {
    this.diaryEvents = [...this.diaryEvents];
    this.cdr.detectChanges();
  }

  createNewEvent() {
    const newEvent = this.diaryEvents[this.diaryEvents.length - 1];
    if (newEvent.id>=0) {
      if (newEvent.end === undefined) {
        newEvent.end = addHours(newEvent.start, 1);
      }
      this.diaryEventService.newEventDates({ startDate: newEvent.start, endDate: newEvent.end });
      this.router.navigate(['/diary/edit', 0],
        {
          queryParams: { staffMemberId: this.id || this.selectedStaffMemberId, isNewEvent: true, isFromCalendar: true }
        });
    }
  }

  ngOnDestroy() {
    if (this.dairyEventSubscription) {
      this.dairyEventSubscription.unsubscribe();
    }
  }
}



