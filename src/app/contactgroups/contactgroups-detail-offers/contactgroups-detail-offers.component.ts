import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-contactgroups-detail-offers',
  templateUrl: './contactgroups-detail-offers.component.html',
  styleUrls: ['./contactgroups-detail-offers.component.scss']
})
export class ContactgroupsDetailOffersComponent implements OnInit {
  navPlaceholder: string;

  constructor() { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
  }

}
