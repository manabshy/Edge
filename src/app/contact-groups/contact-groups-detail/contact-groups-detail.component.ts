import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import {
  ContactGroup,
  BasicContactGroup,
  PersonSummaryFigures,
  ContactGroupDetailsSubNavItems,
  ContactNote,
} from "../shared/contact-group";
import { ContactGroupsService } from "../shared/contact-groups.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Person } from "src/app/shared/models/person";
import { SharedService } from "src/app/core/services/shared.service";
import { AppUtils } from "src/app/core/shared/utils";
import { InfoService } from "src/app/core/services/info.service";
import { StorageMap } from "@ngx-pwa/local-storage";
import { BaseComponent } from "src/app/shared/models/base-component";
import * as _ from "lodash";
import { take, takeUntil } from "rxjs/operators";
import { SubNavItem } from "src/app/shared/subnav";
import { SidenavService } from "src/app/core/services/sidenav.service";
import { Subject } from "rxjs";

@Component({
  selector: "app-contact-groups-detail",
  templateUrl: "./contact-groups-detail.component.html"
})
export class ContactgroupsDetailComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  listInfo: any;
  warnings: any;
  searchedPersonContactGroups: BasicContactGroup[];
  contactGroupDetails: ContactGroup;
  searchedPersonDetails: Person;
  searchedPersonContactGroupId: number;
  searchedPersonCompanyName: string;
  contactGroupId: number;
  personId = 0;
  page = 0;
  pageSize = 20;
  personNotes: ContactNote[] = [];
  bottomReached = false;
  isNewContactGroup = false;
  isCollapsed: boolean;
  summaryTotals: PersonSummaryFigures;
  subNav = ContactGroupDetailsSubNavItems;
  personParams: string;
  showNotes: boolean;
  moreInfo = (this.sidenavService.selectedItem = "notes");
  sideNavItems = this.sidenavService.sideNavItems;
  showOnlyMyNotes = false;
  removeSticky = false;
  destroy = new Subject();
  get dataNote() {
    return {
      personId: this.personId,
    };
  }

  windowScrolled: boolean;
  constructor(
    private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private infoService: InfoService,
    private sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      document.documentElement.scrollTop ||
      document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    (function smoothscroll() {
      const currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }

  ngOnInit() {
    this.showNotes =
      this.route.snapshot.queryParamMap.get("showNotes") === "true";
    this.route.params.subscribe((param) => {
      this.personId = +param["personId"];
      if (this.personId) {
        this.searchedPersonDetails = null;
        this.searchedPersonContactGroups = null;
        this.init();
      }
      // Set notes as current side nav item if non is selected
      const noCurrentItem = this.sideNavItems.every(
        (x) => x.isCurrent === false
      );
      if (noCurrentItem) {
        this.sideNavItems.find((x) => x.name === "notes").isCurrent = true;
      }

      // Listen to changes to toggle remove sticky class
      this.sharedService.removeSticky$
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((res) => {
          res ? (this.removeSticky = true) : (this.removeSticky = false);
        });
    });
  }

  init() {
    this.storage.get("info").subscribe((data) => {
      if (data) {
        this.listInfo = data;
        this.setDropdownLists();
        console.log("app info in contact detail ....", this.listInfo);
      }
    });
    this.getSearchedPersonDetails(this.personId);
    this.getSearchedPersonContactGroups(this.personId);
    this.getSearchedPersonSummaryInfo(this.personId);
    // this.getPersonNotes();

    this.contactGroupService.noteChanges$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data) {
          this.personNotes = [];
          this.page = 1;
          this.bottomReached = false;
          this.getPersonNotes();
        }
      });

    this.contactGroupService.personNotePageChanges$
      .pipe(takeUntil(this.destroy))
      .subscribe((newPageNumber) => {
        console.log({ newPageNumber }, "here for id page number", this.page);

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
    this.contactGroupService
      .getContactGroupById(contactGroupId)
      .subscribe((data) => {
        this.contactGroupDetails = data;
        this.searchedPersonCompanyName = data.companyName;
      });
  }

  getSearchedPersonDetails(personId: number) {
    this.contactGroupService.getPerson(personId, true).subscribe((data) => {
      if (data) {
        this.searchedPersonDetails = data;
        this.personParams = JSON.stringify(this.searchedPersonDetails);
        this.contactGroupService.personNotesChanged(data.personNotes);
        this.sharedService.setTitle(this.searchedPersonDetails.addressee);
        this.searchedPersonDetails.warning = this.sharedService.showWarning(
          this.searchedPersonDetails.warningStatusId,
          this.warnings,
          this.searchedPersonDetails.warningStatusComment
        );
      }
    });
  }

  getSearchedPersonSummaryInfo(personId: number) {
    this.contactGroupService.getPersonInfo(personId).subscribe((data) => {
      this.summaryTotals = data;
    });
  }

  getSearchedPersonContactGroups(personId: number) {
    this.contactGroupService
      .getPersonContactGroups(personId)
      .subscribe((data) => {
        if (data) {
          this.searchedPersonContactGroups = data;
          console.log("contact groups for person here", data);
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

  private getNextPersonNotesPage(page: number) {
    this.contactGroupService
      .getPersonNotes(this.personId, this.pageSize, page, this.showOnlyMyNotes)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data && data.length) {
          this.personNotes = _.concat(this.personNotes, data);
        } else if (!data.length || data.length < this.pageSize) {
          this.bottomReached = true;
          console.log("data", data);
          console.log(
            "bottom reached for id",
            this.personId,
            "condition",
            this.bottomReached
          );
        }
      });
  }

  addNote() {
    event.stopPropagation();
    let data;
    if (this.contactGroupDetails) {
      data = {
        group: this.contactGroupDetails,
        people: this.contactGroupDetails.contactPeople,
      };
    } else {
      data = {
        person: this.searchedPersonDetails,
        isPersonNote: true,
      };
    }
    this.sharedService.addNote(data);
  }

  getSelectedItem(item: any) {
    this.moreInfo = this.sidenavService.getSelectedItem(
      item?.type,
      item?.index
    );
    console.log({ item });
  }

  setShowMyNotesFlag(onlyMyNotes: boolean) {
    this.showOnlyMyNotes = onlyMyNotes;
    this.personNotes = [];
    this.page = 1;
    this.getPersonNotes();
  }

  create(item: string) {
    console.log({ item }, "item to create");
    if (item === "leads") {
      this.router.navigate(["leads-register", "edit", 0], {
        queryParams: {
          isNewLead: true,
          personId: this.searchedPersonDetails?.personId,
          backToOrigin: true,
        },
      });
    } else {
      const fullName = `${this.searchedPersonDetails.firstName} ${this.searchedPersonDetails?.middleName} ${this.searchedPersonDetails?.lastName}`;
      this.router.navigate(["property-centre", "detail", 0, "edit"], {
        queryParams: {
          isNewProperty: true,
          personId: this.searchedPersonDetails?.personId,
          lastKnownPerson: fullName,
          backToOrigin: true,
        },
      });
    }
  }
  ngOnDestroy() {
    this.sidenavService.resetCurrentFlag();
    this.destroy.next();
  }
}
