import { Component, OnInit } from '@angular/core';
import { ContactGroup, BasicContactGroup, PersonSummaryFigures } from '../shared/contact-group';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/core/models/person';

@Component({
  selector: 'app-contactgroups-detail',
  templateUrl: './contactgroups-detail.component.html',
  styleUrls: ['./contactgroups-detail.component.scss']
})
export class ContactgroupsDetailComponent implements OnInit {
  searchedPersonContactGroups: BasicContactGroup[];
  contactGroupDetails: ContactGroup;
  searchedPersonDetails: Person;
  searchedPersonContactGroupId: number;
  searchedPersonCompanyName: string;
  contactGroupId: number;
  personId = 0;
  isNewContactGroup = false;
  isCollapsed: boolean;
  summaryTotals: PersonSummaryFigures;
  constructor(private contactGroupService: ContactGroupsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // this.route.params.subscribe(params => {this.contactGroupId = params['id']; });
    this.route.params.subscribe(params => {
      this.personId = params['personId'] || 0;
      this.searchedPersonDetails = null;
      this.searchedPersonContactGroups = null;
      this.init();
    });
    this.init();
  }

  init() {
    // this.getContactGroupById(this.contactGroupId);
    this.getSearchedPersonDetails(this.personId);
    this.getSearchedPersonContactGroups(this.personId);
    this.getSearchedPersonSummaryInfo(this.personId);
  }

  getContactGroupById(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      this.contactGroupDetails = data;
      this.searchedPersonCompanyName = data.companyName;
    });
  }

  getSearchedPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.searchedPersonDetails = data;
      console.log(this.searchedPersonDetails);
    });
  }
  getSearchedPersonSummaryInfo(personId: number) {
    this.contactGroupService.getPersonInfo(personId).subscribe(data => {
      this.summaryTotals = data;
      console.log('summary info', data);
    });
  }

  getSearchedPersonContactGroups(personId: number) {
    this.contactGroupService.getPersonContactGroups(personId).subscribe(data => {
      console.log(data);
      this.searchedPersonContactGroups = data;
    });
  }


  createNewContactGroup(){
    this.isNewContactGroup = true;
  }

  ngOnDestroy(){

  }
}
