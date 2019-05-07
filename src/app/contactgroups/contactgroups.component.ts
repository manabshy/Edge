import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from './shared/contact-groups.service';
import { ContactGroupAutoCompleteResult } from './shared/contact-group';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from '../core/shared/utils';

@Component({
  selector: 'app-contactgroups',
  templateUrl: './contactgroups.component.html',
  styleUrls: ['./contactgroups.component.scss']
})
export class ContactGroupsComponent implements OnInit {
  private _searchTerm: string;
  advSearchCollapsed = false;
  isMessageVisible = false;
  isHintVisible = false;
  isLoading = false;
  set searchTerm(val: string) {
    this._searchTerm = val;
  }
  get searchTerm(): string {
    return this._searchTerm;
  }
  contactGroups: ContactGroupAutoCompleteResult[];
  contactGroupDetails: ContactGroupAutoCompleteResult[];
  contactPeople: any[];
  contactGroupId: number;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.params.subscribe(params => {this.contactGroupId = params['id']; });
    this.searchTerm = this.route.snapshot.queryParamMap.get('searchTerm') || AppUtils.searchTerm || '';
    this.contactGroupsAutocomplete(this.searchTerm);
  }

  contactGroupsAutocomplete(searchTerm: string) {
    this.contactGroupService.getAutocompleteContactGroups(searchTerm).subscribe(result => {
        this.contactGroups = result;
        this.isLoading = false;
        console.log(result);
        this.getHiddenContactGroups();

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
    AppUtils.searchTerm = this.searchTerm;

    if (this.searchTerm && this.searchTerm.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.contactGroups && !this.contactGroups.length) {
        this.isHintVisible = true;
      }
    }
  }

  private getHiddenContactGroups() {
   if (this.contactGroups !== null) {
    for (let i = 0; i < this.contactGroups.length; i++) {
      for (let j = 0; j < this.contactGroups[i].contactGroups.length; j++) {
        const subContact = this.contactGroups[i].contactGroups[j];
        const subPeople = subContact.contactPeople;
        let visibleFlag = 0;
        if (subPeople && subPeople.length && !visibleFlag) {
          this.contactGroups[i]['indexVisibleContactGroup'] = j;
          this.contactGroups[i]['hiddenContactGroups'] = this.contactGroups[i].contactGroups.length - j - 1;
          visibleFlag++;
        }
      }
    }
   }
  }
}
