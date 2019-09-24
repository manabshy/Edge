import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ContactGroupAutoCompleteResult } from '../shared/contact-group';
import { AppUtils } from 'src/app/core/shared/utils';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-contactgroups-list',
  templateUrl: './contactgroups-list.component.html',
  styleUrls: ['./contactgroups-list.component.scss']
})
export class ContactgroupsListComponent implements OnInit, OnChanges {
  @Input() originalContactGroups: ContactGroupAutoCompleteResult[];
  @Input() searchTerm: string;
  contactGroups: ContactGroupAutoCompleteResult[];
  contactPhoneNumbers = [];

  constructor(private sharedService: SharedService) { }

  ngOnInit() {
    if (this.originalContactGroups) {
      this.contactGroups = this.originalContactGroups.slice(0, 10);
      this.setSmsFlag();
   }
  }

  ngOnChanges() {
  //  if (this.originalContactGroups) {
  //     this.contactGroups = this.originalContactGroups.slice(0, 10);
  //     this.setSmsFlag();
  //  }
    // remove duplicate phone numbers
    // this.contactPhoneNumbers = [...new Map(this.output.map(item => [item.personId, item])).values()];
  }

  setSmsFlag() {
    let sendSMS: boolean;
    let result;
    if (this.originalContactGroups) {
      this.originalContactGroups.forEach(c => {
        this.sharedService.isUKMobile(c.phoneNumbers[0]) ? sendSMS = true : sendSMS = false;
        result = {
          personId: c.personId,
          sendSMS: sendSMS,
          number: c.phoneNumbers[0]
        };
        this.contactPhoneNumbers.push(result);
      });
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
