import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ContactGroupAutoCompleteResult } from '../shared/contact-group';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-contactgroups-list',
  templateUrl: './contactgroups-list.component.html',
  styleUrls: ['./contactgroups-list.component.scss']
})
export class ContactgroupsListComponent implements OnInit, OnChanges {
  @Input() originalContactGroups: ContactGroupAutoCompleteResult[];
  @Input() searchTerm: string;
  contactGroups: ContactGroupAutoCompleteResult[];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
   if (this.originalContactGroups) {
      this.contactGroups = this.originalContactGroups.slice(0, 10);
   }
  }

  onScrollDown() {
    AppUtils.setupInfintiteScroll(this.originalContactGroups, this.contactGroups);
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }
}
