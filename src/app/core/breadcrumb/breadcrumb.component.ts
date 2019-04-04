import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  isHomeBtnVisible: boolean = true;
  parentRoute: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.parentRoute = '';

    let current = this.activatedRoute.snapshot;
    let parent = current.parent;

    if(parent){
      if(current.url.length && parent.url.length){
        if(parent.parent.url.length){
          this.parentRoute = parent.parent.url[0].path;
        }
        this.parentRoute = this.parentRoute + '/' + parent.url[0].path;
        this.isHomeBtnVisible = false;
      } else if(parent.parent.url.length) {
        this.parentRoute = parent.parent.url[0].path;
        this.isHomeBtnVisible = false;
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
