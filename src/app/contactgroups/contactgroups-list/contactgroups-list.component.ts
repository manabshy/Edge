import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { ContactGroupAutoCompleteResult } from '../shared/contact-group';
import { AppUtils } from 'src/app/core/shared/utils';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from '../shared/contact-groups.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-contactgroups-list',
  templateUrl: './contactgroups-list.component.html',
  styleUrls: ['./contactgroups-list.component.scss']
})
export class ContactgroupsListComponent implements OnInit, OnChanges {
  @Input() originalContactGroups: ContactGroupAutoCompleteResult[];
  @Input() searchTerm: string;
  @Input() pageNumber: number;
  @Input() bottomReached: boolean;
  contactGroups: ContactGroupAutoCompleteResult[] = [];
  contactPhoneNumbers = [];
  page: number;

  constructor(private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.page = this.pageNumber;
    if (this.originalContactGroups) {
      this.contactGroups = this.originalContactGroups;
    }
  }

  onScrollDown() {
    this.onWindowScroll();
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.innerHeight + window.scrollY === document.body.scrollHeight && !this.bottomReached) {
      this.page ++;
      this.contactGroupService.pageNumberChanged(this.page);
      console.log('bottom here...', this.page);
 }
  }
}
