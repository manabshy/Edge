import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-contactgroups-company-edit',
  templateUrl: './contactgroups-company-edit.component.html',
  styleUrls: ['./contactgroups-company-edit.component.scss']
})
export class ContactgroupsCompanyEditComponent implements OnInit {

  constructor(public sharedService:SharedService) { }

  ngOnInit() {
  }

  cancel() {
    this.sharedService.back();
  }

}
