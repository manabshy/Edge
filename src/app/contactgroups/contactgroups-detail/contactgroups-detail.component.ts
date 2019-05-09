import { Component, OnInit, Input } from '@angular/core';
import { ContactGroupAutoCompleteResult, ContactGroup } from '../shared/contact-group';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/core/models/person';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-contactgroups-detail',
  templateUrl: './contactgroups-detail.component.html',
  styleUrls: ['./contactgroups-detail.component.scss']
})
export class ContactgroupsDetailComponent implements OnInit {
  searchedPersonContactGroups: ContactGroupAutoCompleteResult[];
  contactGroupDetails: ContactGroup;
  searchedPersonDetails: Person;
  searchedPersonCompanyName: string;
  contactGroupId: number;
  personId = 0;
  isCollapsed: boolean;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {this.contactGroupId = params['id']; });
    this.route.params.subscribe(params => {this.personId = params['personId'] || 0; });
    this.getContactGroupById(this.contactGroupId);
    this.getSearchedPersonDetails(this.contactGroupId, this.personId);
  }

  getContactGroupById(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      this.contactGroupDetails = data;
      this.searchedPersonCompanyName = data.companyName;
    });
  }

  getSearchedPersonDetails(contactGroupId: number, personId: number) {
    this.contactGroupService.getContactPerson(contactGroupId, personId).subscribe(data => {
      this.searchedPersonDetails = data;
      console.log('this is contact person details', this.searchedPersonDetails);
    });
  }

  getSearchedPersonContactGroups(personId: number) {
    let groups = this.searchedPersonContactGroups.filter(group=>group.personId == personId);
    console.log(groups);
  }
}
