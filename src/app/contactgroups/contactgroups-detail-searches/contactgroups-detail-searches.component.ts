import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-contactgroups-detail-searches',
  templateUrl: './contactgroups-detail-searches.component.html',
  styleUrls: ['./contactgroups-detail-searches.component.scss']
})
export class ContactgroupsDetailSearchesComponent implements OnInit {
  navPlaceholder: string;

  constructor() { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
  }

}
