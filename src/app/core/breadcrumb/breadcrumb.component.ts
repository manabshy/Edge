import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUtils } from '../shared/utils';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  
  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    AppUtils.parentRoute = '';

    const current = this.activatedRoute.snapshot;
    const parent = current.parent;

    if (parent) {
      if (current.url.length && parent.url.length) {
        if (parent.parent.url.length) {
          AppUtils.parentRoute = parent.parent.url[0].path;
        }
        AppUtils.parentRoute = AppUtils.parentRoute + '/' + parent.url[0].path;
        if(parent.params){
          AppUtils.parentRoute = AppUtils.parentRoute + '/' + parent.params.id;
        }
      } else if (parent.parent.url.length) {
        AppUtils.parentRoute = parent.parent.url[0].path;
      }
    }

  }

  backClicked() {
    if (AppUtils.parentRoute) {
      this.router.navigate(['../../' + AppUtils.parentRoute], {queryParamsHandling: 'preserve'});
    } else {
      this.router.navigate(['/home']);
    }
  }

}
