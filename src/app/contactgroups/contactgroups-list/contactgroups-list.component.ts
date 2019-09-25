import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { ContactGroupAutoCompleteResult } from '../shared/contact-group';
import { AppUtils } from 'src/app/core/shared/utils';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from '../shared/contact-groups.service';

@Component({
  selector: 'app-contactgroups-list',
  templateUrl: './contactgroups-list.component.html',
  styleUrls: ['./contactgroups-list.component.scss']
})
export class ContactgroupsListComponent implements OnInit, OnChanges {
  @Input() originalContactGroups: ContactGroupAutoCompleteResult[];
  @Input() searchTerm: string;
  @Input() pageNumber: number;
  contactGroups: ContactGroupAutoCompleteResult[];
  contactPhoneNumbers = [];
  page: number;
  
  constructor(private sharedService: SharedService, private contactGroupService: ContactGroupsService) { }
  
  ngOnInit() {
    if (this.originalContactGroups) {
      this.contactGroups = this.originalContactGroups.slice(0, 10);
      this.setSmsFlag();
   }
  }

  ngOnChanges() {
    this.page = this.pageNumber;
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
    this.onWindowScroll();
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.innerHeight + window.scrollY === document.body.scrollHeight) {
      this.page ++;
      this.contactGroupService.pageNumberChanged(this.page);
      console.log('bottom here...', this.page);
 }
  }
}
