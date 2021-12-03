import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewChecked,
  OnDestroy,
  ViewEncapsulation
} from '@angular/core'
import {
  CalendarEvent,
  CalendarDateFormatter,
  CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent,
  DAYS_OF_WEEK,
  CalendarEventTitleFormatter,
  CalendarMonthViewBeforeRenderEvent
} from 'angular-calendar'
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
  getDaysInMonth,
  subDays,
  differenceInDays,
  eachDayOfInterval
} from 'date-fns'
import { CustomDateFormatter } from '../custom-date-formatter.provider'
import { Observable, fromEvent, of, combineLatest, merge, Subscription } from 'rxjs'
import { DiaryEvent, BasicEventRequest, Staff, DiaryProperty } from '../../diary/shared/diary'
import { DiaryEventService } from '../../diary/shared/diary-event.service'
import { tap, map, takeUntil, finalize } from 'rxjs/operators'
import { CustomEventTitleFormatter } from '../custom-event-title-formatter.provider'
import { WeekViewHourSegment } from 'calendar-utils'
import * as _ from 'lodash'
import { StorageMap } from '@ngx-pwa/local-storage'
import { InfoDetail, DropdownListInfo } from 'src/app/core/services/info.service'
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member'
import { Router, ActivatedRoute } from '@angular/router'
import { CalendarView } from '../shared/calendar-shared'
import { isSame } from 'ngx-bootstrap/chronos/public_api'
import { SharedService } from 'src/app/core/services/shared.service'

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision
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
  @Input() staffMemberId: number
  @Input() myCalendarOnly: boolean
  @Input() isSelectingDate: boolean
  @Input() isOnlyShowPurposes: boolean
  // todo for release purposes
  forReleaseClosed = true
  @Output() selectedDate = new EventEmitter<any>()
  @ViewChild('calendarContainer', { static: true })
  calendarContainer: ElementRef
  @Input() view: CalendarView | 'month' | 'week' | 'threeDays' | 'day'
  daysInWeek
  @Input() selectedStaffMemberId: number
  @Input() tooltipPlacement: string = 'auto'
  @Input() baseClass: string

  private _viewDate: Date = new Date()
  @Input()
  get viewDate(): Date {
    return this._viewDate
  }
  set viewDate(value: Date) {
    if (value != this._viewDate) {
      this._viewDate = value
      if (this.selectedStaffMemberId > 0) {
        this.diaryEvents = []
        this.staffEvents = []
        if (this.secondStaffMemberId && this.secondStaffMemberId > 0) this.getCurrentDiaryEvents(null, true)
        this.getCurrentDiaryEvents()
      }
    }
  }

  private _secondStaffMemberId: number
  @Input()
  get secondStaffMemberId(): number {
    return this._secondStaffMemberId
  }
  set secondStaffMemberId(value: number) {
    if (value != this._secondStaffMemberId) {
      this._secondStaffMemberId = value
      if (this._secondStaffMemberId && this._secondStaffMemberId > 0) {
        this.getCurrentDiaryEvents(false, true)
      }
    }
  }

  weekStartsOn = DAYS_OF_WEEK.MONDAY
  clickedDate: Date
  clickedColumn: number

  events$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>
  myEvents$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>
  diaryEvents: CalendarEvent[]
  activeDayIsOpen: boolean
  viewingArrangements: InfoDetail[]
  id: number

  // draggable
  newEvents: CalendarEvent[] = []
  dragToCreateActive = false
  diaryEvents$: Observable<Array<CalendarEvent<{ diaryEvent: DiaryEvent }>>>

  dairyEventSubscription: Subscription
  movedToView = false
  requestedTimeframe: { start: number; end: number }
  scrollPosition = 0
  staffEvents: CalendarEvent[] = []

  constructor(
    private diaryEventService: DiaryEventService,
    private renderer: Renderer2,
    private storage: StorageMap,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService
  ) {
    if (!this.view) {
      this.view = CalendarView.Week
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.selectedStaffMemberId = this.isOnlyShowPurposes ? this.selectedStaffMemberId : +params['staffMemberId'] || 0
      console.log('id in calendar', this.selectedStaffMemberId)
      if (params['selectedDate']) {
        this.viewDate = new Date(+params['selectedDate'])
        this.view = params['calendarView']
        this.scrollPosition = params['scrollPos']
      }
      this.getCurrentDiaryEvents()
    })

    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.viewingArrangements = data.viewingArrangements
      }
    })

    if (window.innerWidth < 1024) {
      this.view = CalendarView.ThreeDays
    }
    this.diaryEvents = []
    console.log(this.viewDate)
  }

  ngAfterViewChecked() {
    const calContainer = this.calendarContainer.nativeElement
    let gap = 20
    if (window.innerWidth < 576) {
      gap += 50
    }
    const maxHeight = `${window.innerHeight - calContainer.getBoundingClientRect().top - gap}px`
    this.renderer.setStyle(calContainer, 'max-height', maxHeight)

    this.cdr.detectChanges()
  }

  ngOnChanges() {
    // if (this.staffMemberId) {
    //   this.id = this.staffMemberId;
    //   this.getCurrentDiaryEvents()
    // }
  }

  passDateToRouter() {
    this.scrollPosition = this.calendarContainer.nativeElement.scrollTop
    this.router.navigate(['/'], {
      queryParams: {
        selectedDate: this.viewDate.getTime(),
        calendarView: this.view,
        scrollPos: this.scrollPosition
      },
      queryParamsHandling: 'merge'
    })
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent) {
    this.weekStartsOn = DAYS_OF_WEEK.MONDAY
    const date = getDaysInMonth(this.viewDate)
    this.daysInWeek = date
  }

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    if (this.view === CalendarView.ThreeDays) {
      this.daysInWeek = 3
      this.weekStartsOn = null
    } else {
      this.daysInWeek = null
      this.weekStartsOn = DAYS_OF_WEEK.MONDAY
    }
  }

  beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
    this.daysInWeek = 1
  }

  currentTimeIntoView() {
    const calHourSegments = document.getElementsByClassName('cal-hour-segment')
    setTimeout(() => {
      if (!this.scrollPosition) {
        if (calHourSegments && calHourSegments.length && calHourSegments.length > 22) {
          if (window.innerWidth >= 1024) {
            calHourSegments[23].scrollIntoView({ block: 'center' })
          } else {
            calHourSegments[22].scrollIntoView({ block: 'center' })
          }
        }
      } else {
        this.calendarContainer.nativeElement.scrollTop = this.scrollPosition
      }
    })
  }

  getSelectedStaffMemberDiaryEvents(staffMemberId: number) {
    // this.id = staffMemberId;
    this.selectedStaffMemberId = staffMemberId
    this.getCurrentDiaryEvents(true)
    console.log('get selected id from output event', staffMemberId)
  }

  getCurrentDiaryEvents(isLoaderVisible?: boolean, isSecondStaffMember?: boolean) {
    function startOfThreeDays(date: Date) {
      return new Date(date)
    }
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      threeDays: startOfThreeDays,
      day: startOfDay
    }[this.view]
    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      threeDays: endOfWeek,
      day: endOfDay
    }[this.view]

    const request = {
      staffMemberId: isSecondStaffMember ? this.secondStaffMemberId : this.selectedStaffMemberId || this.id || 0,
      startDate: format(getStart(this.viewDate), 'yyyy-MM-dd'),
      endDate: format(getEnd(this.viewDate), 'yyyy-MM-dd')
    } as BasicEventRequest

    if (this.view === CalendarView.ThreeDays) {
      request.startDate = format(this.viewDate, 'yyyy-MM-dd')
      request.endDate = format(addDays(this.viewDate, 3), 'yyyy-MM-dd')
    } else if (this.view === CalendarView.Week) {
      request.startDate = format(addDays(getStart(this.viewDate), 1), 'yyyy-MM-dd')
      request.endDate = format(addDays(getEnd(this.viewDate), 1), 'yyyy-MM-dd')
    }
    this.getDiaryEvents(request, isLoaderVisible)

    /**
     * This code is for only calling the api if the user navigates away from the already loaded timeframe
     * it prevents excessive api calls
     */
    // const monthStart = startOfMonth(getStart(this.viewDate)).getTime()
    // let monthEnd = endOfMonth(getEnd(this.viewDate)).getTime()

    // if (this.view === CalendarView.Week || this.view === CalendarView.ThreeDays) {
    //   monthEnd = endOfMonth(addDays(getEnd(this.viewDate), 1)).getTime()
    // }
    // if (this.requestedTimeframe == undefined ||
    //   (this.requestedTimeframe?.start > monthStart || this.requestedTimeframe?.end < monthEnd) ||
    //   this.selectedStaffMemberId !== this.id) {
    //   this.requestedTimeframe = {
    //     start: monthStart,
    //     end: monthEnd
    //   }
    //   this.id = this.selectedStaffMemberId
    //   const request = {
    //     staffMemberId: this.selectedStaffMemberId || this.id || 0,
    //     startDate: format(monthStart, 'yyyy-MM-DD'),
    //     endDate: format(monthEnd, 'yyyy-MM-DD'),
    //   }
    //   this.getDiaryEvents(request, isLoaderVisible)
    // }
  }

  getDiaryEvents(request, isLoaderVisible?: boolean) {
    this.dairyEventSubscription = this.diaryEventService
      .getDiaryEvents(request, isLoaderVisible)
      .subscribe((result) => {
        this.diaryEvents = []
        if (!(this.secondStaffMemberId && this.secondStaffMemberId > 0)) this.staffEvents = []
        // when the events arrive the view needs to scroll to 8AM
        this.currentTimeIntoView()
        result.map((diary) => {
          if (!diary.isCancelled) {
            this.staffEvents.push(this.setCalendarEvent(diary, request))
            if (diary.allDay) {
              const allEvents = this.getMultiAlldayEvents(diary)
              allEvents?.forEach((event) => {
                if (event) {
                  this.staffEvents.push(this.setCalendarEvent(event, request))
                }
              })
            }
          }
        })
        this.diaryEvents = [...this.staffEvents]
        console.log(request.staffMemberId)
        console.log('deneme')
        console.log(this.diaryEvents)
      })
  }

  setCalendarEvent(diary: DiaryEvent, request) {
    const title = diary.subject || diary.eventType
    const start = new Date(diary.startDateTime)
    const end = diary.allDay ? null : new Date(diary.endDateTime)
    const allDay = diary.allDay
    const meta = diary
    this.setViewingArrangement(diary.properties)
    const members = this.getStaff(meta.staffMembers)
    let cssClass = ''
    cssClass += meta.isCancelled ? 'is-cancelled' : ''
    cssClass += meta.isHighImportance ? ' is-important' : ''
    cssClass += meta.isConfirmed ? ' is-confirmed' : ''

    if (this.isOnlyShowPurposes) {
      if (request.staffMemberId == this.secondStaffMemberId) {
        cssClass += ' lettingsEvent'
      } else if (this.secondStaffMemberId && this.secondStaffMemberId > 0) {
        cssClass += ' salesEvent'
      } else {
        cssClass += ' ' + this.baseClass
      }
    }
    return {
      title,
      start,
      end,
      allDay,
      meta,
      members,
      cssClass
    } as CalendarEvent
  }

  getMultiAlldayEvents(event: DiaryEvent): DiaryEvent[] {
    let allDays = []
    const allEvents: DiaryEvent[] = []
    if (differenceInDays(event.endDateTime, event.startDateTime) > 0) {
      allDays = eachDayOfInterval({
        start: new Date(event.startDateTime),
        end: new Date(event.endDateTime)
      })
      const starts = allDays.splice(1)

      starts.forEach((start) => {
        const newEvent = { ...event, startDateTime: start }
        if (newEvent) {
          allEvents.push(newEvent)
        }
      })
      console.log(differenceInDays(event.endDateTime, event.startDateTime), {
        starts
      })
      return allEvents
    }
  }

  eventClicked({ event }: { event: CalendarEvent }) {
    const clickedEvent = { ...event.meta } as DiaryEvent
    this.scrollPosition = this.calendarContainer.nativeElement.scrollTop
    this.diaryEventService.newEventDates({
      startDate: new Date(clickedEvent.startDateTime),
      endDate: new Date(clickedEvent.endDateTime)
    })
    if (this.isOnlyShowPurposes) return
    if (this.forReleaseClosed) return
    if (!clickedEvent.isBusy) {
      if (+clickedEvent.eventTypeId === 8 || +clickedEvent.eventTypeId === 2048) {
        this.router.navigate(['/valuations/detail', clickedEvent.properties[0].propertyEventId, 'edit'], {
          queryParams: {
            scrollPos: this.scrollPosition,
            selectedDate: this.viewDate.getTime(),
            calendarView: this.view
          }
        })
      } else {
        this.router.navigate(['/diary/edit', clickedEvent.diaryEventId], {
          queryParams: {
            staffMemberId: this.id || this.selectedStaffMemberId,
            graphEventId: clickedEvent.exchangeGUID,
            scrollPos: this.scrollPosition,
            selectedDate: this.viewDate.getTime(),
            calendarView: this.view
          }
        })
      }
    }
  }

  getClickedDate(date: Date) {
    if (date) {
      this.selectedDate.emit(date)
      console.log('clicked date', date)
    }
  }

  getDateChange(date) {
    this.viewDate = date
    this.passDateToRouter()
  }

  changeDay(date: Date) {
    this.viewDate = date
    this.view = CalendarView.Day
  }

  getStaff(members: BaseStaffMember[]) {
    if (members && members.length > 5) {
      return _.take(members, 5)
    }
    return members
  }

  setViewingArrangement(properties: DiaryProperty[]) {
    if (this.viewingArrangements && properties && properties.length) {
      const values = Object.values(this.viewingArrangements)
      for (const property of properties) {
        values.forEach((x) => {
          if (x.id === property.viewingArragementId) {
            property.viewingArragement = x.value
          }
        })
      }
    }
  }

  trackByFn(index, item: DiaryEvent) {
    if (!item) {
      return null
    }
    return item.diaryEventId
  }

  // New draggable here....
  startDragToCreate(segment: WeekViewHourSegment, mouseDownEvent: MouseEvent, segmentElement: HTMLElement) {
    if (this.isOnlyShowPurposes) return
    if (this.forReleaseClosed) return
    if (!this.isSelectingDate) {
      const dragToSelectEvent: CalendarEvent = {
        id: this.diaryEvents.length,
        title: 'New event',
        start: segment.date,
        meta: {
          tmpEvent: true
        }
      }
      this.diaryEvents = [...this.diaryEvents, dragToSelectEvent]
      const segmentPosition = segmentElement.getBoundingClientRect()
      this.dragToCreateActive = true
      const endOfView = endOfWeek(this.viewDate, {
        weekStartsOn: this.weekStartsOn
      })

      fromEvent(document, 'mousemove')
        .pipe(
          finalize(() => {
            delete dragToSelectEvent.meta.tmpEvent
            this.dragToCreateActive = false
            this.createNewEvent()
            this.refresh()
          }),
          takeUntil(fromEvent(document, 'mouseup'))
        )
        .subscribe((mouseMoveEvent: MouseEvent) => {
          const minutesDiff = ceilToNearest(mouseMoveEvent.clientY - segmentPosition.top, 30)

          const daysDiff =
            floorToNearest(mouseMoveEvent.clientX - segmentPosition.left, segmentPosition.width) / segmentPosition.width

          const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff)
          if (newEnd > segment.date && newEnd < endOfView) {
            dragToSelectEvent.end = newEnd
          }
          this.refresh()
        })
    }
  }

  private refresh() {
    this.diaryEvents = [...this.diaryEvents]
    this.cdr.detectChanges()
  }

  createNewEvent() {
    if (!this.isOnlyShowPurposes) {
      this.scrollPosition = this.calendarContainer.nativeElement.scrollTop
      const newEvent = this.diaryEvents[this.diaryEvents.length - 1]
      if (newEvent.id >= 0) {
        if (newEvent.end === undefined) {
          newEvent.end = addHours(newEvent.start, 1)
        }
        this.diaryEventService.newEventDates({
          startDate: newEvent.start,
          endDate: newEvent.end
        })
        this.router.navigate(['/diary/edit', 0], {
          queryParams: {
            staffMemberId: this.id || this.selectedStaffMemberId,
            isNewEvent: true,
            isFromCalendar: true,
            scrollPos: this.scrollPosition,
            selectedDate: this.viewDate.getTime(),
            calendarView: this.view
          }
        })
      }
    }
  }

  ngOnDestroy() {
    if (this.dairyEventSubscription) {
      this.dairyEventSubscription.unsubscribe()
    }
  }
}
