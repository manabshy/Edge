import { Component, OnInit } from '@angular/core';
import { ContactGroup, BasicContactGroup, PersonSummaryFigures, ContactGroupDetailsSubNavItems } from '../shared/contact-group';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/core/models/person';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppUtils } from 'src/app/core/shared/utils';
import { InfoService } from 'src/app/core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';

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
  // importantPersonNotes: ContactNote[];

  constructor(private contactGroupService: ContactGroupsService,
              private sharedService: SharedService,
              private storage: StorageMap,
              private infoService: InfoService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.subNav);
    this.route.params.subscribe(params => {
      this.personId = params['personId'] || 0;
      this.searchedPersonDetails = null;
      this.searchedPersonContactGroups = null;
      this.init();

    });
  }

  init() {
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.setDropdownLists();
        console.log('app info in contact detail ....', this.listInfo);
      }
    });
    this.getSearchedPersonDetails(this.personId);
    this.getSearchedPersonContactGroups(this.personId);
    this.getSearchedPersonSummaryInfo(this.personId);

    this.contactGroupService.noteChanges$.subscribe(data => {
      if (data) {
        this.contactGroupService.getPerson(this.personId, true).subscribe(x => {
          this.searchedPersonDetails.personNotes = x.personNotes;
        });
      }
    });
  }

  setDropdownLists() {
    if (this.listInfo) {
      this.warnings = this.listInfo.personWarningStatuses;
    }
  }

  getContactGroupById(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      this.contactGroupDetails = data;
      this.searchedPersonCompanyName = data.companyName;
    });
  }

  getSearchedPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId, true).subscribe(data => {
      if (data) {
        this.searchedPersonDetails = data;
        this.contactGroupService.personNotesChanged(data.personNotes);
        this.sharedService.setTitle(this.searchedPersonDetails.addressee);
        this.searchedPersonDetails.warning = this.sharedService
          .showWarning(this.searchedPersonDetails.warningStatusId, this.warnings, this.searchedPersonDetails.warningStatusComment);
      }
    });
  }

  getSearchedPersonSummaryInfo(personId: number) {
    this.contactGroupService.getPersonInfo(personId).subscribe(data => {
      this.summaryTotals = data;
    });
  }

  getSearchedPersonContactGroups(personId: number) {
    this.contactGroupService.getPersonContactGroups(personId).subscribe(data => {
      if (data) {
        this.searchedPersonContactGroups = data;
        console.log('contact groups for person here', data);
        this.contactGroupService.contactInfoChanged(data);
      }
    });
  }

  createNewContactGroup() {
    this.isNewContactGroup = true;
  }

  addNote() {
    event.stopPropagation();
    const data = {
      person: this.searchedPersonDetails,
      isPersonNote: true
    };
    this.sharedService.addNote(data);
  }

  isObject(val) {
    return val instanceof Object;
  }

}
