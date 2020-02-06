import { Component, OnInit } from '@angular/core';
import { ContactGroup, BasicContactGroup, PersonSummaryFigures, ContactGroupDetailsSubNavItems, ContactNote } from '../shared/contact-group';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from 'src/app/shared/models/person';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppUtils } from 'src/app/core/shared/utils';
import { InfoService } from 'src/app/core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BaseComponent } from 'src/app/shared/models/base-component';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { SubNavItem } from 'src/app/shared/subnav';

@Component({
  selector: 'app-contactgroups-detail',
  templateUrl: './contactgroups-detail.component.html',
  styleUrls: ['./contactgroups-detail.component.scss']
})
export class ContactgroupsDetailComponent extends BaseComponent implements OnInit {
  listInfo: any;
  warnings: any;
  searchedPersonContactGroups: BasicContactGroup[];
  contactGroupDetails: ContactGroup;
  searchedPersonDetails: Person;
  searchedPersonContactGroupId: number;
  searchedPersonCompanyName: string;
  contactGroupId: number;
  personId = 0;
  page = 1;
  pageSize = 20;
  personNotes: ContactNote[] = [];
  bottomReached = false;
  isNewContactGroup = false;
  isCollapsed: boolean;
  summaryTotals: PersonSummaryFigures;
  subNav = ContactGroupDetailsSubNavItems;
  personParams: string;
  showNotes: boolean;
  moreInfo: any;

  get dataNote() {
    return {
      personId: this.personId
    };
  }

  constructor(private contactGroupService: ContactGroupsService,
              private sharedService: SharedService,
              private storage: StorageMap,
              private infoService: InfoService,
              private route: ActivatedRoute) {super();}

  ngOnInit() {
    console.log(this.subNav);
    this.showNotes = this.route.snapshot.queryParamMap.get('showNotes') === 'true';
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
    this.getPersonNotes();

    this.contactGroupService.noteChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        this.personNotes = [];
        this.page = 1;
        this.bottomReached = false;
        this.getPersonNotes();
      }
    });

    this.contactGroupService.personNotePageChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newPageNumber => {
      this.page = newPageNumber;
      this.getNextPersonNotesPage(this.page);
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
        this.personParams = JSON.stringify(this.searchedPersonDetails);
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

  getPersonNotes() {
    this.getNextPersonNotesPage(this.page);
  }

  private getNextPersonNotesPage(page) {


    this.contactGroupService.getPersonNotes(this.personId, this.pageSize, page).pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        if (page === 1) {
          this.personNotes = data;
        } else {
          this.personNotes = _.concat(this.personNotes, data);
        }
        console.log('person Notes', this.personNotes);
      }
      if (data && !data.length) {

        this.bottomReached = true;
        console.log('data', data);
        console.log('bottom reached', this.bottomReached);
      }
    });
  }

  addNote() {
    event.stopPropagation();
    const data = {
      person: this.searchedPersonDetails,
      isPersonNote: true
    };
    this.sharedService.addNote(data);
  }

  getMoreInfo(item: SubNavItem) {
    this.moreInfo = item.value;
  }
  isObject(val) {
    return val instanceof Object;
  }

}
