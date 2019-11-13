import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  @Input() title: string;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
  }

  backClicked() {
    this.sharedService.back();
  }

}
