import {format, compareAsc, isDate} from 'date-fns';
import { isArray, isPlainObject, mapValues, isNull, isUndefined, random  } from 'lodash';
export class AppUtils {
  public static prevRoute: string;
  public static prevRouteBU: string;
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

  /**
     * Resolver function for get params
     * @param queryOptions
     * @returns {string}
     */
  public static resolveGetParams<T>(queryOptions: T): string {
    // -->Init: param object serializer
    const params = new URLSearchParams();

    // -->Serialize: all parameters
    mapValues(queryOptions, (v, i) => {
      if (!isUndefined(v) && !isNull(v)) {
        params.set(i, v.toString());
      }
    });

    const strParams = params.toString();
    return strParams ? `?${strParams}` : '';
  }
  
  public static isDiarySearchVisible: boolean = false;
  
}
