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
    setTimeout(()=>{
      //this.itemIntoView();
    });
  }

  onScrollDown() {
    this.onWindowScroll();
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

  // itemIntoView() {
  //   const items = document.querySelectorAll('.list-group-item-last');

  //   let observer = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.intersectionRatio > 0) {
  //         observer.unobserve(entry.target);
  //         this.onWindowScroll();
  //       }
  //     });
  //   });

  //   items.forEach(item => {
  //     observer.observe(item);
  //   });
  // }

  // @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (!this.bottomReached) {
      this.page ++;
      this.contactGroupService.pageNumberChanged(this.page);
      console.log('bottom here...', this.page);
    }
  }
}
