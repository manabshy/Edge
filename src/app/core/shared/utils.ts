import { format, isDate } from 'date-fns';
import { Company } from 'src/app/contact-groups/shared/contact-group.interfaces';
import { Person } from '../../shared/models/person';
import { StaffMember } from '../../shared/models/staff-member';
import { DetachedRouteHandle } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { CustomQueryEncoderHelper } from './custom-query-encoder-helper';
import { LeadSearchInfo } from 'src/app/leads/shared/lead';


export interface IRouteConfigData {
  shouldDetach: boolean;
}

export interface ICachedRoute {
  handle: DetachedRouteHandle;
  data: IRouteConfigData;
}
export interface RequestOption {
  isNameSearch: boolean;
  searchTerm: string;
  searchType: number;
  pageSize?: number;
  page?: number;
}

export class AppUtils {
  public static prevRoute = '';
  public static prevRouteBU = '';
  public static deactivateRoute = '';
  public static homeSelectedTab: number;
  public static dashboardSelectedTab: number;
  public static isDiarySearchVisible = false;
  public static parentRoute = '';
  public static searchTerm: string;
  public static companySearchTerm: any;
  public static newSignerId: number;
  public static holdingSelectedCompany: Company;
  public static holdingSelectedPeople: Person[];
  public static holdingRemovedPeople: number[];
  public static holdingContactType: number;
  public static holdingCompany: Company;
  public static holdingCloned: boolean;
  public static leadSearchTerm: string;
  static firstContactPerson: Person;
  static propertySearchTerm: string;
  static openedWindows: any[] = [];
  static contactInfoForNotes: any;
  static routeCache = new Map<string, ICachedRoute>();
  static currentStaffMemberGlobal: StaffMember;
  static navPlaceholder: string;
  static leadSearchInfo: LeadSearchInfo;


  public static setQueryParams(requestOption: RequestOption) {
    if (!requestOption.page) {
      requestOption.page = 1;
    }
    if (requestOption.pageSize == null) {
      requestOption.pageSize = 10;
    }

    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        searchTerm: requestOption.searchTerm,
        searchType: requestOption.searchType ? requestOption.searchType.toString() : '',
        pageSize: requestOption.pageSize.toString(),
        page: requestOption.page.toString()
      }
    });
    return options;
  }

  /**
   * Format a date/time into a string
   */
  public static getMomentDate(date?: Date): string {
    const moDate = isDate(date) ? date : (date);
    return null;
    // return format(moDate ? null : 'YYYY-MM-DD');
  }

  /**
   * Format a time into a string
   */
  public static getMomentTime(date?: Date): string {
    const moDate = isDate(date) ? date : (date);
    return format(moDate, 'HH:mm');
  }
  public static capitaliseFirstLetter(value: string): string {
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
