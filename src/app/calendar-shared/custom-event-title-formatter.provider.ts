import { LOCALE_ID, Inject, Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  constructor(@Inject(LOCALE_ID) private locale: string) {
    super();
  }

  // you can override any of the methods defined in the parent class

  month(event: CalendarEvent): string {
    return `<span class="d-none d-lg-inline">${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}</span class="d-none d-lg-inline"> ${event.title}`;
  }

  week(event: CalendarEvent): string {
    return `<span class="d-none d-lg-inline">${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}</span class="d-none d-lg-inline"> ${event.title}`;
  }

  day(event: CalendarEvent): string {
    return `<span class="d-none d-lg-inline">${new DatePipe(this.locale).transform(
      event.start,
      'HH:mm',
      this.locale
    )}</span class="d-none d-lg-inline"> ${event.title}`;
  }
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}
