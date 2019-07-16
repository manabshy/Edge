import { Component, OnInit, Input } from '@angular/core';
import { ContactGroupAutoCompleteResult } from '../shared/contact-group';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-contactgroups-list',
  templateUrl: './contactgroups-list.component.html',
  styleUrls: ['./contactgroups-list.component.scss']
})
export class ContactgroupsListComponent implements OnInit {
@Input()  contactGroups: ContactGroupAutoCompleteResult[];
@Input() searchTerm: string;
listInfo: any;
warnings: any;

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.getDropdownListInfo().subscribe(data=>{
      this.listInfo = data;
      this.warnings = this.listInfo.result.personWarningStatuses;
    });
  }

  showWarning(id):any {
    return this.sharedService.showWarning(id, this.warnings);
  }

}
