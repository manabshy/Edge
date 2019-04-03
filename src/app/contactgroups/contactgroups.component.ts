import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from './shared/contact-groups.service';
import { ContactGroupAutoCompleteResult } from './shared/contact-group';

@Component({
  selector: 'app-contactgroups',
  templateUrl: './contactgroups.component.html',
  styleUrls: ['./contactgroups.component.scss']
})
export class ContactGroupsComponent implements OnInit {

  searchResultCollapsed = false;
  advSearchCollapsed = false;
  searchTerm: string;
  contactGroups: ContactGroupAutoCompleteResult[];
  contactPeople: any[];

  constructor(private contactGroupService: ContactGroupsService) { }

  ngOnInit() {
  }

  contactGroupsAutocomplete(searchTerm: string) {
    this.contactGroupService.getAutocompleteContactGroups(searchTerm).subscribe(result =>
      {this.contactGroups = result;
        console.log(result);
      });
  }

  searchContactGroup() {
    this.contactGroupsAutocomplete(this.searchTerm);
  }
}
