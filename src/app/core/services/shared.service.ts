import { Injectable } from '@angular/core';
import { AppUtils } from '../shared/utils';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor(private router: Router) { }

  back() {
    if(AppUtils.prevRoute) {
      this.router.navigate([AppUtils.prevRoute]);
    } else {
      this.router.navigate(['/home']);
    }
  }
}
