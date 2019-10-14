import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-contactgroups-detail-instructions',
  templateUrl: './contactgroups-detail-instructions.component.html',
  styleUrls: ['./contactgroups-detail-instructions.component.scss']
})
export class ContactgroupsDetailInstructionsComponent implements OnInit {
  navPlaceholder: string;

  constructor() { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
  }

}
