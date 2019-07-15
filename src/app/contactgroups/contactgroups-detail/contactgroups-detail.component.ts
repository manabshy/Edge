import { Component, OnInit } from '@angular/core';
import { ContactGroup, BasicContactGroup, PersonSummaryFigures } from '../shared/contact-group';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/core/models/person';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-contactgroups-detail',
  templateUrl: './contactgroups-detail.component.html',
  styleUrls: ['./contactgroups-detail.component.scss']
})
export class ContactgroupsDetailComponent implements OnInit {
  listInfo: any;
  warnings: any;
  warning: any;
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
              private sharedService: SharedService,
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
    // this.listInfo = this.sharedService.dropdownListInfo;
    this.sharedService.getDropdownListInfo().subscribe(data=> this.listInfo = data);
    this.warnings = this.listInfo.result.personWarningStatuses;
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
      if(this.searchedPersonDetails.warningStatusId !== 1) {
        this.warnings.forEach(x=>{
          if(x.id === this.searchedPersonDetails.warningStatusId) {
            this.warning = x;
          }
        })
      }
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

  addNote() {
    event.stopPropagation();
    const data = {
      person: this.searchedPersonDetails
    }
    this.sharedService.addNote(data);
  }

  ngOnDestroy(){

  }
}
