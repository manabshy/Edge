import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { Property, PropertyTypes, PropertyStyles, PropertyDetailsSubNavItems, PropertySummaryFigures } from '../shared/property';
import { SharedService } from 'src/app/core/services/shared.service';
import { Observable } from 'rxjs';
import { FormatAddressPipe } from 'src/app/core/shared/format-address.pipe';
import { InfoService } from 'src/app/core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  propertyId: number;
  propertyDetails: Property;
  summaryTotals: PropertySummaryFigures;
  propertyTypes = PropertyTypes;
  propertyStyles = PropertyStyles;
  listInfo: any;
  regions: any;
  allAreas: any;
  allSubAreas: any;
  region: any;
  area: any;
  subArea: any;
  subNav = PropertyDetailsSubNavItems;
  propertyDetails$ = new Observable<any>();

  // get region() {
  //   if (this.propertyDetails && this.regions) {
  //     const getRegion = this.regions.get(this.propertyDetails.regionId.toString()).get('value');
  //     return getRegion;
  //   }
  // }

  // get area() {
  //   if (this.propertyDetails && this.allAreas) {
  //     const getArea = this.allAreas.get(this.propertyDetails.areaId.toString()).get('value');
  //     return getArea;
  //   }
  // }

  // get subArea() {
  //   if (this.propertyDetails && this.allSubAreas) {
  //     const getSubArea = this.allSubAreas.get(this.propertyDetails.subAreaId.toString()).get('value');
  //     return getSubArea;
  //   }
  // }


  constructor(private propertyService: PropertyService,
    private formatAddressPipe: FormatAddressPipe,
    private route: ActivatedRoute,
    private infoService: InfoService,
    private storage: StorageMap,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    // this.propertyDetails$ = this.propertyService.propertyDetails$
    //   .pipe
    //   ( tap(data => {
    //     this.propertyDetails = data;
    //     this.sharedService.setTitle(this.formatAddressPipe.transform(this.propertyDetails.address));
    //   }),
    //     tap(data => this.summaryTotals = data.info),
    //     tap(data => console.log('SEARCHED PROPERTY SUMMARY TOTALS',  this.propertyDetails.info))
    //   );

    // if (this.propertyId) {
    //   this.propertyService.currentPropertyChanged(this.propertyId);
    // }
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data; this.setDropdownLists();
        console.log('list info property detail....', this.listInfo);
      }
    });

    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }
  }

  setDropdownLists() {
    this.regions = new Map(Object.entries(this.listInfo.regions));
    this.allAreas = new Map(Object.entries(this.listInfo.areas));
    this.allSubAreas = new Map(Object.entries(this.listInfo.subAreas));
  }

  isObject(val) {
    return val instanceof Object;
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId, true, true).subscribe(data => {
      if (data) {
        this.propertyDetails = data;
        this.sharedService.setTitle(this.formatAddressPipe.transform(this.propertyDetails.address));
        this.summaryTotals = data.info;
        this.setupRegionalValues();
      }
      console.log('property details here', this.propertyDetails);
    });
  }

  // TODO: Refactor
  setupRegionalValues() {
    if (this.propertyDetails) {
      const regionValues = this.regions.values();
      const areaValues = this.allAreas.values();
      const subAreaValues = this.allSubAreas.values();
      switch (true) {
        case !!this.regions:
          for (const item of regionValues) {
            if (item.id === this.propertyDetails.regionId) {
              this.region = item.value;
            }
          }
        case !!this.allAreas:
          for (const item of areaValues) {
            if (item.id === this.propertyDetails.areaId) {
              this.area = item.value;
            }
          }
        case !!this.allSubAreas:
          for (const item of subAreaValues) {
            if (item.id === this.propertyDetails.subAreaId) {
              this.subArea = item.value;
            }
          }
      }
    }
  }
}

