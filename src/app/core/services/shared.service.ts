import { Injectable } from '@angular/core';
import { AppUtils } from '../shared/utils';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../shared/app-constants';
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

  getDropdownListInfo(): Observable<DropdownListInfo> {
  return  this.http.get<DropdownListInfo>(AppConstants.baseInfoUrl)
  .pipe(
    tap(data => console.log(JSON.stringify(data))),
    tap(data => localStorage.setItem('dropdownListInfo', JSON.stringify(data))));
  }

}

export interface DropdownListInfo {
 Countries: Record<number, string>;
 Titles: Record<number, string>;
 TelephoneTypes: Record<number, string>;
}
