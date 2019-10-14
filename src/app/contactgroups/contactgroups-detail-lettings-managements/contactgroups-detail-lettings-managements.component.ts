import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-contactgroups-detail-lettings-managements',
  templateUrl: './contactgroups-detail-lettings-managements.component.html',
  styleUrls: ['./contactgroups-detail-lettings-managements.component.scss']
})
export class ContactgroupsDetaillettingsManagementsComponent implements OnInit {
  navPlaceholder: string;

  constructor() { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
  }

}
