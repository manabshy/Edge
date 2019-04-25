import { Injectable } from '@angular/core';
import { AppUtils } from '../shared/utils';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private router: Router) { }

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
}
