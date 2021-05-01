import { CalendarDateFormatter, DateFormatterParams, getWeekViewPeriod } from 'angular-calendar';
import { DatePipe, formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class

  public monthViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE', locale);
  }

  public monthViewTitle({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'MMM y', locale);
  }

  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'E', locale);
  }

  public weekViewColumnSubHeader({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'd', locale);
  }

  public dayViewHour({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'HH:mm', locale);
  }

  public weekViewHour({ date, locale }: DateFormatterParams): string {
    return this.dayViewHour({ date, locale });
  }

  public threeDaysViewTitle({
    date,
    locale,
    weekStartsOn,
    excludeDays,
    daysInWeek
  }: DateFormatterParams): string {
    const { viewStart, viewEnd } = getWeekViewPeriod(
      this.dateAdapter,
      date,
      weekStartsOn,
      excludeDays,
      daysInWeek
    );
    const format = (dateToFormat: Date, showYear: boolean) =>
      formatDate(dateToFormat, 'MMM d' + (showYear ? ', yyyy' : ''), locale);
    return `${format(
      viewStart,
      viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear()
    )} - ${format(viewEnd, true)}`;
  }

  public dayViewTitle({ date, locale }: DateFormatterParams): string {
    return new DatePipe(locale).transform(date, 'EEE d MMM, y', locale);
  }
}
