import { Component, OnInit } from '@angular/core';
import { ContactGroup, BasicContactGroup, PersonSummaryFigures, ContactGroupDetailsSubNav, ContactGroupDetailsSubNavItems, ContactNote } from '../shared/contact-group';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/core/models/person';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppUtils } from 'src/app/core/shared/utils';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-contactgroups-detail',
  templateUrl: './contactgroups-detail.component.html',
  styleUrls: ['./contactgroups-detail.component.scss']
})
export class ContactgroupsDetailComponent implements OnInit {
  listInfo: any;
  warnings: any;
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
  subNav = ContactGroupDetailsSubNavItems;
  importantPersonNotes: ContactNote[];

  constructor(private contactGroupService: ContactGroupsService,
              private sharedService: SharedService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.subNav);
    // this.route.params.subscribe(params => {this.contactGroupId = params['id']; });
    this.route.params.subscribe(params => {
      this.personId = params['personId'] || 0;
      this.searchedPersonDetails = null;
      this.searchedPersonContactGroups = null;
      this.init();
     
    });
  }

  init() {
    if(AppUtils.listInfo) {
      this.listInfo = AppUtils.listInfo;
      this.setDropdownLists();
    } else {
      this.sharedService.getDropdownListInfo().subscribe(data=> {
        this.listInfo = data;
        this.setDropdownLists();
      });
    }
    console.log('detail list info', this.listInfo);
    this.getSearchedPersonDetails(this.personId);
    this.getSearchedPersonContactGroups(this.personId);
    this.getSearchedPersonSummaryInfo(this.personId);
    console.log('contact groups on detail page....', this.searchedPersonContactGroups)
    if(this.searchedPersonContactGroups){
      AppUtils.contactInfoForNotes = this.searchedPersonContactGroups;
      // this.contactGroupService.contactInfoForNotes$.subscribe(data => console.log('contact groups on detail page....', data));
    }
  }

  setDropdownLists() {
    this.warnings = this.listInfo.result.personWarningStatuses;
  }

  setImportantPersonNotes(){
    console.log('person notes heree....', this.searchedPersonDetails.personNotes);
    this.importantPersonNotes = this.searchedPersonDetails.personNotes.filter(x=>x.isImportant && +x.personId === +this.personId);
  }
  // setContactGroupDetailsForNotes(){
  //   let groupInfo;
  //   if(this.searchedPersonDetails){
  //     groupInfo = this.searchedPersonContactGroups;
  //     AppUtils.contactInfoForNotes = groupInfo;
  //   }
  // }
  getContactGroupById(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      this.contactGroupDetails = data;
      this.searchedPersonCompanyName = data.companyName;
    });
  }

  getSearchedPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId).subscribe(data => {
      this.searchedPersonDetails = data;
      this.setImportantPersonNotes();
      this.sharedService.setTitle(this.searchedPersonDetails.addressee);
      this.searchedPersonDetails.warning = this.sharedService.showWarning(this.searchedPersonDetails.warningStatusId, this.warnings, this.searchedPersonDetails.warningStatusComment);
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
     if (data) {
       console.log('........', data)
        this.searchedPersonContactGroups = data;
        this.contactGroupService.contactInfoChanged(data);
     }
    });
  }
 
  createNewContactGroup(){
    this.isNewContactGroup = true;
  }

  addNote() {
    event.stopPropagation();
    const data = {
      person: this.searchedPersonDetails,
      isPersonNote: true
    }
    console.log('for notes',data);
    this.sharedService.addNote(data);
  }

  isObject(val) {
    return val instanceof Object;
  }

  ngOnDestroy(){

  }
}
