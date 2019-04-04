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
        if(!this.contactGroups.length){
          this.isMessageVisible = true;
        }
      }, error => {
        this.contactGroups = [];
        this.isHintVisible = true;
      });
  }

  searchContactGroup() {
    this.contactGroups = [];
    this.contactGroupsAutocomplete(this.searchTerm);
  }

  onKeyup() {
    this.isMessageVisible = false;

    if(this.searchTerm.length > 2) {
      this.isHintVisible = false;
    }
  }
}
