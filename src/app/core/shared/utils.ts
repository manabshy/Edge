import {format, compareAsc, isDate} from 'date-fns';
import { isArray, isPlainObject, mapValues, isNull, isUndefined, random  } from 'lodash';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { Person } from '../models/person';
export class AppUtils {
  public static prevRoute: string = '';
  public static prevRouteBU: string = '';
  public static homeSelectedTab: number;
  public static dashboardSelectedTab: number;
  public static isDiarySearchVisible: boolean = false;
  public static parentRoute: string = '';
  public static searchTerm: string;
  public static companySearchTerm: any;
  public static newSignerId: number;
  public static holdingSelectedPeople: Person[];
  public static holdingRemovedPeople: number[];
  public static holdingContactType: number;
  public static holdingCloned: boolean;
  static firstContactPerson: Person;
  static propertySearchTerm: string;

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
  public static capitaliseFirstLetter<T>(value: string): string{
    if (value) {
      const result = value.charAt(0).toLocaleUpperCase();
      return result.concat(value.substr(1));
    }
  }

  public static setupInfintiteScroll(originalArray: any[], slicedArray: any[]) {
    if (slicedArray.length < originalArray.length) {
      const len = slicedArray.length;

      for (let i = len; i <= len; i++) {
        slicedArray.push(originalArray[i]);
      }
    }
  }


}
