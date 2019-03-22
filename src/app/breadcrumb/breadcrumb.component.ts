import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AppUtils } from '../core/shared/utils';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  constructor(private router: Router, private _location: Location) { }

  ngOnInit() {
  }

  backClicked() {
    if(AppUtils.prevRoute) {
      this.router.navigate([AppUtils.prevRoute]);
    } else {
      this.router.navigate(['/home']);
    }
  }

}
