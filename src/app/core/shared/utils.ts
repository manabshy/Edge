import {format, compareAsc, isDate} from 'date-fns';
export class AppUtils{
  /**
   * Format a date/time into a string
   */
  public static getMomentDate(date?: Date): string {
    const moDate = isDate(date) ? date : (date);
    return format(moDate ? null : 'YYYY-MM-DD');
  }

  /**
   * Format a time into a string
   */
  public static getMomentTime(date?: Date): string {
    const moDate = isDate(date) ? date : (date);
    return format(moDate, 'HH:mm');
  }

  public static prevRoute: string;
  public static prevRouteBU: string;
}
