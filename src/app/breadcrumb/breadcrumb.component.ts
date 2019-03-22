import { Component, OnInit } from '@angular/core';
import { SharedService } from '../core/services/shared.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  constructor(private sharedService: SharedService) { }

  ngOnInit() {
  }

  backClicked() {
    this.sharedService.back();
  }

}
