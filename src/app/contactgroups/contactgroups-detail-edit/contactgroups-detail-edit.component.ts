import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-contactgroups-detail-edit',
  templateUrl: './contactgroups-detail-edit.component.html',
  styleUrls: ['./contactgroups-detail-edit.component.scss']
})
export class ContactgroupsDetailEditComponent implements OnInit {

  constructor(public sharedService: SharedService) { }

  ngOnInit() {
  }

  cancel() {
    this.sharedService.back();
  }

}
