import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../core/services/shared.service';
import { AppUtils } from '../shared/utils';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  isHomeBtnVisible: boolean = false;
  parentRoute: string;

  constructor(private sharedService: SharedService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.parentRoute = '';

    if(AppUtils.prevRoute && AppUtils.prevRoute !== '/home') {
      this.isHomeBtnVisible = true;
    }

    if(this.activatedRoute.snapshot.parent){
      if(this.activatedRoute.snapshot.url.length && this.activatedRoute.snapshot.parent.url.length){
        this.parentRoute = this.activatedRoute.snapshot.parent.url[0].path;
      }
    }

  }

  backClicked() {
    if(this.parentRoute) {
      this.router.navigate(["../../" + this.parentRoute])
    } else {
      this.router.navigate(["/home"]);
    }
  }

}
