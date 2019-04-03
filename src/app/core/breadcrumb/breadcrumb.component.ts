import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../core/services/shared.service';
import { AppUtils } from '../shared/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  isHomeBtnVisible: boolean = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit() {
    if(AppUtils.prevRoute && AppUtils.prevRoute !== '/home') {
      this.isHomeBtnVisible = true;
    }
  }

  backHome() {
    this.router.navigate(["/home"]);
  }

  backClicked() {
    this.sharedService.back();
  }

}
