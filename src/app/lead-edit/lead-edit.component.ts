import { Component, OnInit } from '@angular/core';
import { AppUtils } from '../core/shared/utils';

@Component({
  selector: 'app-lead-edit',
  templateUrl: './lead-edit.component.html',
  styleUrls: ['./lead-edit.component.scss']
})
export class LeadEditComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    AppUtils.parentRoute = AppUtils.prevRoute;

    console.log(AppUtils.parentRoute);
  }

}
