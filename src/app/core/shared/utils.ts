import {format, compareAsc, isDate} from 'date-fns';
import { isArray, isPlainObject, mapValues, isNull, isUndefined, random  } from 'lodash';
export class AppUtils {
  public static prevRoute: string = '';
  public static prevRouteBU: string = '';
  public static homeSelectedTab: number;
  public static dashboardSelectedTab: number;

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

  public static setupInfintiteScroll(originalArray: any[], slicedArray: any[]) {
    if (slicedArray.length < originalArray.length) {
      const len = slicedArray.length;

      for (let i = len; i <= len; i++) {
        slicedArray.push(originalArray[i]);
      }
    }
  }
  
  public static isDiarySearchVisible: boolean = false;

  public static parentRoute: string = '';

  public static searchTerm: string;
  
}
