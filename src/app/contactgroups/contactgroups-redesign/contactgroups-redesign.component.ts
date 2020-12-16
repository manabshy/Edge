import { Component, HostListener, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { InfoService } from 'src/app/core/services/info.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SidenavService } from 'src/app/core/services/sidenav.service';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { Person } from 'src/app/shared/models/person';
import { SubNavItem } from 'src/app/shared/subnav';
import { BasicContactGroup, ContactGroup, ContactNote, PersonSummaryFigures, ContactGroupDetailsSubNavItems } from '../shared/contact-group';
import { ContactGroupsService } from '../shared/contact-groups.service';
// import { DOCUMENT } from "@angular/platform-browser";

@Component({
  selector: 'app-contactgroups-redesign',
  templateUrl: './contactgroups-redesign.component.html',
  styleUrls: ['./contactgroups-redesign.component.scss']
})
export class ContactgroupsRedesignComponent extends BaseComponent implements OnInit, OnDestroy {

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
  moreInfo = this.sidenavService.selectedItem = 'notes';
  // type = 'notes';
  // types: { name: string, isCurrent: boolean }[] = [
  //   { name: 'notes', isCurrent: true },
  //   { name: 'contactGroups', isCurrent: false },
  //   { name: 'properties', isCurrent: false },
  //   { name: 'leads', isCurrent: false },
  //   { name: 'instructions', isCurrent: false },
  //   { name: 'valuations', isCurrent: false },
  //   { name: 'offers', isCurrent: false },
  //   { name: 'searches', isCurrent: false },
  //   { name: 'lettingsManagements', isCurrent: false },
  //   { name: 'homeHelpers', isCurrent: false }
  // ];
  sideNavItems = this.sidenavService.sideNavItems;

  get dataNote() {
    return {
      personId: this.personId
    };
  }

  windowScrolled: boolean;
  constructor(private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private infoService: InfoService,
    private sidenavService: SidenavService,
    private route: ActivatedRoute) { super(); }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }
  scrollToTop() {
    (function smoothscroll() {
      const currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }
    })();
  }

  ngOnInit() {
    this.showNotes = this.route.snapshot.queryParamMap.get('showNotes') === 'true';
    this.route.params.subscribe(param => {
      this.personId = +param['personId'];
      if (this.personId) {
        this.searchedPersonDetails = null;
        this.searchedPersonContactGroups = null;
        this.init();
      }
      // Set notes as current side nav item if non is selected
      const noCurrentItem = this.sideNavItems.every(x => x.isCurrent === false);
      if (noCurrentItem) {
        this.sideNavItems.find(x => x.name === 'notes').isCurrent = true;
      }
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
      if (data && data.length) {
        this.personNotes = _.concat(this.personNotes, data);
      } else if (!data.length || data.length < this.pageSize) {
        this.bottomReached = true;
        console.log('data', data);
        console.log('bottom reached for id', this.personId, 'condition', this.bottomReached);
      }
      // if (data) {
      //   if (page === 1) {
      //     this.personNotes = data;
      //   } else {
      //     this.personNotes = _.concat(this.personNotes, data);
      //   }
      //   console.log('person Notes', this.personNotes);
      // }
      // if (data && (!data.length || data.length < this.pageSize)) {

      //   this.bottomReached = true;
      //   console.log('data', data);
      //   console.log('bottom reached', this.bottomReached);
      // }
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

  setSideNavItem(type: string, index: number) {
    // this.moreInfo = type;
    // this.types.map(t => t.isCurrent = false);
    // this.types[index].isCurrent = true;
    // console.log('info type', this.moreInfo);
    this.moreInfo = this.sidenavService.getSelectedItem(type, index);
    console.log('%cmore info compo', this.moreInfo);

  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  isObject(val) {
    return val instanceof Object;
  }

  ngOnDestroy(){
    this.sidenavService.resetCurrentFlag();
  }
}
