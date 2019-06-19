import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppUtils } from '../shared/utils';
import { Location } from '@angular/common';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  get prevRoute() {
    return AppUtils.prevRoute;
  }

  constructor(private _location: Location, private router: Router) { }

  ngOnInit() {
  }

  backClicked() {
    if(!this.prevRoute) {
      this.router.navigate(['/home']);
    } else {
      this._location.back();
    }
  }

}
