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
  groupsLength: number;

  constructor(private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.page = this.pageNumber;
    if (this.originalContactGroups) {
      this.contactGroups = this.originalContactGroups;
    }
    if(this.groupsLength !== this.contactGroups.length - 1) {
      setTimeout(()=>{
        this.groupsLength = this.contactGroups.length - 1;
        this.itemIntoView(this.groupsLength);
      });
    }
  }

  itemIntoView(index: number) {
    const items = document.querySelectorAll('.list-group-item');

    let observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          setTimeout(()=>{
            this.onWindowScroll();
            observer.unobserve(entry.target);
          })
        }
      });
    });

    if(index > 0) {
      observer.observe(items[index]);
    }
  }
  
  onWindowScroll() {
    if (!this.bottomReached) {
      this.page ++;
      this.contactGroupService.pageNumberChanged(this.page);
      console.log('bottom here...', this.page);
    }
  }
}
