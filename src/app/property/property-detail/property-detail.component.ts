import { Component, OnDestroy, OnInit } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Property, PropertyTypes, PropertyStyles, PropertyDetailsSubNavItems, PropertySummaryFigures, PropertyNote } from '../shared/property';
import { SharedService } from 'src/app/core/services/shared.service';
import { Observable } from 'rxjs';
import { FormatAddressPipe } from 'src/app/shared/pipes/format-address.pipe';
import { InfoService, DropdownListInfo, InfoDetail } from 'src/app/core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { SubNavItem } from 'src/app/shared/subnav';
import { SideNavItem, SidenavService } from 'src/app/core/services/sidenav.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent extends BaseComponent implements OnInit, OnDestroy {
  propertyId: number;
  propertyDetails: Property;
  summaryTotals: PropertySummaryFigures;
  propertyTypes = PropertyTypes;
  propertyStyles = PropertyStyles;
  listInfo: DropdownListInfo;
  regions: InfoDetail[];
  allAreas: InfoDetail[];
  allSubAreas: InfoDetail[];
  region: string;
  area: string;
  subArea: string;
  subNav = PropertyDetailsSubNavItems;
  propertyDetails$ = new Observable<any>();
  propertyNotes: PropertyNote[] = [];
  page = 1;
  pageSize = 10;
  bottomReached = false;
  showPhotos = false;
  showMap = false;
  noteTypes: Record<number, string>;
  moreInfo = this.sidenavService.selectedItem = 'notes';
  sideNavItems: SideNavItem[] = [
    { name: 'notes', isCurrent: true },
    { name: 'instructions', isCurrent: false },
    { name: 'valuations', isCurrent: false },
    { name: 'offers', isCurrent: false },
  ];


  constructor(private propertyService: PropertyService,
    private formatAddressPipe: FormatAddressPipe,
    private route: ActivatedRoute,
    private router: Router,
    private infoService: InfoService,
    private storage: StorageMap,
    private sidenavService: SidenavService,
    private sharedService: SharedService) { super(); }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });

    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data as DropdownListInfo;
        this.setDropdownLists();
        console.log('list info property detail....', this.listInfo);
      }
    });

    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }

    if (this.propertyId) {
      this.getPropertyNotes();
    }

    this.propertyService.propertyNotePageNumberChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newPage => {
      this.page = newPage;
      this.getNexPropertyNotesPage(this.page);
    });

    this.propertyService.propertyNoteChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      if (data) {
        this.propertyNotes = [];
        this.page = 1;
        this.bottomReached = false;
        this.getPropertyNotes();
      }
    });
  }

  private getPropertyNotes() {
    this.getNexPropertyNotesPage(this.page);
  }

  private getNexPropertyNotesPage(page) {
    this.propertyService.getPropertyNotes(this.propertyId, this.pageSize, page)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(data => {
        if (data && data.length) {
          this.propertyNotes = _.concat(this.propertyNotes, data);
          this.setupNoteType();
        }
        if (data && !data.length) {
          this.bottomReached = true;
        }
      });
  }

  setupNoteType() {
    if (this.listInfo && this.listInfo.propertyNoteTypes) {
      this.noteTypes = this.listInfo.propertyNoteTypes;
      const keys = Object.keys(this.noteTypes);
      if (this.propertyNotes && this.propertyNotes.length) {
        this.propertyNotes.forEach((note: PropertyNote) => {
          if (this.noteTypes) {
            keys.forEach(key => {
              if (+key === +note.type) {
                note.typeDescription = _.startCase(this.noteTypes[+key]);
              }
            });
          }
        });
      }
    }
  }

  setDropdownLists() {
    if (this.listInfo) {
      this.regions = this.listInfo.regions;
      this.allAreas = this.listInfo.areas;
      this.allSubAreas = this.listInfo.subAreas;
    }
  }


  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId, true, true, false, true).subscribe(data => {
      if (data) {
        this.propertyDetails = data;
        this.sharedService.setTitle(this.formatAddressPipe.transform(this.propertyDetails.address));
        this.summaryTotals = data.info;
        console.log('property details here', this.propertyDetails);
        if (this.regions && this.allAreas && this.allSubAreas) {
          this.setupRegionalValues(data);
        }
      }
    });
  }

  // TODO: Refactor
  setupRegionalValues(propertyDetails: Property) {
    if (propertyDetails) {
      switch (true) {
        case !!this.regions:
          for (const item of this.regions) {
            if (item.id === propertyDetails.regionId) {
              this.region = item.value;
            }
          }
        case !!this.allAreas:
          for (const item of this.allAreas) {
            if (item.id === propertyDetails.areaId) {
              this.area = item.value;
            }
          }
        case !!this.allSubAreas:
          for (const item of this.allSubAreas) {
            if (item.id === propertyDetails.subAreaId) {
              this.subArea = item.value;
            }
          }
      }
    }
  }

  getMoreInfo(item: SubNavItem) {
    this.moreInfo = item.value;
  }

  getSelectedItem(item: any) {
    this.moreInfo = this.sidenavService.getSelectedItem(item?.type, item?.index, this.sideNavItems);
    console.log({ item });
    console.log('%cmore info property', 'color:red', this.moreInfo);
  }

  scrollTo(el: HTMLElement) {
    this.sidenavService.scrollTo(el);
  }

  navigateToNewValuation(propertyId: number) {
    event.stopPropagation();
    this.router.navigate(['valuations/detail/', 0, 'edit'], {
      queryParams: {
        propertyId: propertyId,
        isNewValuation: true,
      }
    });
  }

  showPhotosModal() {
    this.showPhotos = true;
  }

  showMapModal() {
    this.showMap = true;
  }

  hidePhotosModal() {
    this.showPhotos = false;
  }

  ngOnDestroy() {
    this.sidenavService.resetCurrentFlag();
  }
}

