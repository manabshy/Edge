import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-contactgroups-detail-home-managements',
  templateUrl: './contactgroups-detail-home-managements.component.html',
  styleUrls: ['./contactgroups-detail-home-managements.component.scss']
})
export class ContactgroupsDetailHomeManagementsComponent implements OnInit {
  navPlaceholder: string;

  constructor() { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
  }

}
