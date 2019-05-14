import { Injectable } from '@angular/core';
import { AppUtils } from '../shared/utils';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../shared/app-constants';
import { map, fill } from 'lodash';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  get dropdownListInfo() {
    const listInfo = localStorage.getItem('dropdownListInfo');
    return JSON.parse(listInfo);
  }
  constructor(private router: Router, private http: HttpClient) { }

  back() {
    if (AppUtils.prevRoute) {
      this.router.navigate([AppUtils.prevRoute]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  scrollTodayIntoView() {
    setTimeout(() => {
      if (window.innerWidth < 576) {
        if (document.getElementById('today')) {
          document.getElementById('today').scrollIntoView({block: 'center'});
        } else {
          window.scrollTo(0, 0);
        }
      }
    });
  }

  scrollCurrentHourIntoView() {
    setTimeout(() => {
      const currentHour = dayjs().hour();
      const currentHourDivs = document.getElementsByClassName('hour-' + currentHour);
      if (currentHourDivs) {
        for (let i = 0; i < currentHourDivs.length; i++) {
          currentHourDivs[i].scrollIntoView({block: 'center'});
        }
      }
    });
  }
/**
   * Generate an array of exponential values for letting prices
   *
   * @returns {number[]}
   */
  public priceRangeLet(): number[] {
    let pv = 0;

    return map(fill((new Array(30)), 0), (v, i) => {
      v = pv;
      if (v < 1000) { v += 50; }
      else if (v >= 1000 && v < 2000) { v += 250; }
      else if (v >= 2000 && v < 5000) { v += 500; }
      pv = v;
      return pv;
    });
  }

  /**
   * Generate an array of exponential values for sale prices
   *
   * @returns {number[]}
   */
  public priceRangeSale(): number[] {
    let pv = 0;

    return map(fill((new Array(30)), 0), (vv, i) => {
      vv = pv;
      if (vv < 1000000) { vv += 50000; }
      else if (vv >= 1000000 && vv < 2000000) { vv += 250000; }
      else if (vv >= 2000000 && vv < 5000000) { vv += 500000; }
      pv = vv;
      return pv;
    });
  }
  getDropdownListInfo(): Observable<DropdownListInfo> {
  return  this.http.get<DropdownListInfo>(AppConstants.baseInfoUrl)
  .pipe(
    tap(data => console.log(JSON.stringify(data))),
    tap(data => localStorage.setItem('dropdownListInfo', JSON.stringify(data))));
  }

}

export interface DropdownListInfo {
 Countries: Country[];
 Titles: Record<number, string>;
 TelephoneTypes: Record<number, string>;
}

export interface Country {
  id: number;
  value: string;
}
