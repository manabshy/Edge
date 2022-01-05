import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { ContactGroupAutoCompleteResult } from '../shared/contact-group.interfaces';
import { AppUtils } from 'src/app/core/shared/utils';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from '../shared/contact-groups.service';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-contact-groups-list',
  templateUrl: './contact-groups-list.component.html',
  styleUrls: ['./contact-groups-list.component.scss']
})
export class ContactGroupsListComponent implements OnInit, OnChanges {
  @Input() originalContactGroups: ContactGroupAutoCompleteResult[];
  @Input() searchTerm: string;
  @Input() pageNumber: number;
  @Input() bottomReached: boolean;
  contactGroups: ContactGroupAutoCompleteResult[] = [];
  contactPhoneNumbers = [];
  page: number;
  groupsLength: number;

  private readonly className = '.list-group-item';

  constructor(private contactGroupService: ContactGroupsService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    console.log('c:',this.originalContactGroups);
  }

  ngOnChanges() {
    this.page = this.pageNumber;
    if (this.originalContactGroups) {
      this.contactGroups = this.originalContactGroups;
    }
    if (this.groupsLength !== this.contactGroups.length - 1) {
      setTimeout(() => {
        this.groupsLength = this.contactGroups.length - 1;
        this.itemIntoView(this.groupsLength);
      });
    }
    console.log('changes:',this.originalContactGroups)
  }

  itemIntoView(index: number) {
    const tableRow = '#row-item';
    // const items = document.querySelectorAll(this.className);
    const items = document.querySelectorAll(tableRow);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.intersectionRatio > 0) {
          setTimeout(() => {
            this.onWindowScroll();
            observer.unobserve(entry.target);
          });
        }
      });
    });

    if (index > 0) {
      observer.observe(items[index]);
    }
  }

  onWindowScroll() {
    if (!this.bottomReached) {
      this.page++;
      this.contactGroupService.pageNumberChanged(this.page);
      console.log('bottom here...', this.page);
    }
  }

  navigateToDetail(id: number) {
    if (id) {
      this.router.navigate(['detail', id], { queryParams: { showNotes: true }, relativeTo: this.route });
    }
  }
}
