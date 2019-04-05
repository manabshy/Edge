import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  isHomeBtnVisible = true;
  parentRoute: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.parentRoute = '';

    const current = this.activatedRoute.snapshot;
    const parent = current.parent;

    if (parent) {
      if (current.url.length && parent.url.length) {
        if (parent.parent.url.length) {
          this.parentRoute = parent.parent.url[0].path;
        }
        this.parentRoute = this.parentRoute + '/' + parent.url[0].path;
        this.isHomeBtnVisible = false;
      } else if (parent.parent.url.length) {
        this.parentRoute = parent.parent.url[0].path;
        this.isHomeBtnVisible = false;
      }
    }

  }

  backClicked() {
    if (this.parentRoute) {
      this.router.navigate(['../../' + this.parentRoute], {queryParamsHandling: 'preserve'});
    } else {
      this.router.navigate(['/home']);
    }
  }

}
