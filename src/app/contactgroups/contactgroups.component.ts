import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from './shared/contact-groups.service';
import { ContactGroupAutoCompleteResult } from './shared/contact-group';

@Component({
  selector: 'app-contactgroups',
  templateUrl: './contactgroups.component.html',
  styleUrls: ['./contactgroups.component.scss']
})
export class ContactGroupsComponent implements OnInit {
  advSearchCollapsed = false;
  isMessageVisible = false;
  isHintVisible = false;
  isLoading = false;
  searchTerm: string;
  contactGroups: ContactGroupAutoCompleteResult[];
  contactPeople: any[];

  constructor(private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
  }

  contactGroupsAutocomplete(searchTerm: string) {
    this.contactGroupService.getAutocompleteContactGroups(searchTerm).subscribe(result => {
        this.contactGroups = result;
        this.isLoading = false;
        console.log(result);

        for (let i = 0; i < this.contactGroups.length; i++) {
          for (let j = 0; j < this.contactGroups[i].contactGroups.length; j++) {
            const subContact = this.contactGroups[i].contactGroups[j];
            const subPeople = subContact.contactPeople;
            let visibleFlag = 0;
            if (subPeople && subPeople.length && !visibleFlag) {
              this.contactGroups[i]['indexVisibleContactGroup'] = j;
              this.contactGroups[i]['hiddenContactGroups'] = this.contactGroups[i].contactGroups.length - j - 1;
              visibleFlag ++;
            }
          }
        }

        if (this.searchTerm && this.searchTerm.length) {
          if (!this.contactGroups.length) {
            this.isMessageVisible = true;
          }
        } else {
          this.isHintVisible = true;
        }
      }, error => {
        this.contactGroups = [];
        this.isLoading = false;
        this.isHintVisible = true;
      });
  }

  searchContactGroup() {
    this.contactGroups = [];
    this.isLoading = true;
    this.contactGroupsAutocomplete(this.searchTerm);
  }

  onKeyup() {
    this.isMessageVisible = false;

    if (this.searchTerm && this.searchTerm.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.contactGroups && !this.contactGroups.length) {
        this.isHintVisible = true;
      }
    }
  }
}
