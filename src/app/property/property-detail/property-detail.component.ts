import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { Property, PropertyTypes, PropertyStyles, PropertyDetailsSubNavItems, PropertySummaryFigures } from '../shared/property';
import { SharedService } from 'src/app/core/services/shared.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppUtils } from 'src/app/core/shared/utils';
import { FormatAddressPipe } from 'src/app/core/shared/format-address.pipe';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  propertyId: number;
  searchedPropertyDetails: Property;
  summaryTotals: PropertySummaryFigures;
  propertyTypes = PropertyTypes;
  propertyStyles = PropertyStyles;
  listInfo: any;
  regions: any;
  allAreas: any;
  allSubAreas: any;
  subNav = PropertyDetailsSubNavItems;
  propertyDetails$ = new Observable<any>();

  get region() {
    if (this.searchedPropertyDetails && this.regions) {
      const getRegion = this.regions.get(this.searchedPropertyDetails.regionId.toString()).get('value');
      return getRegion;
    }
  }

  get area() {
    if (this.searchedPropertyDetails && this.allAreas) {
      const getArea = this.allAreas.get(this.searchedPropertyDetails.areaId.toString()).get('value');
      return getArea;
    }
  }

  get subArea() {
    if (this.searchedPropertyDetails && this.allSubAreas) {
      const getSubArea = this.allSubAreas.get(this.searchedPropertyDetails.subAreaId.toString()).get('value');
      return getSubArea;
    }
  }


  constructor(private propertyService: PropertyService,
              private formatAddressPipe: FormatAddressPipe,
              private route: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    this.propertyDetails$ = this.propertyService.propertyDetails$
      .pipe
      ( tap(data => {
        this.searchedPropertyDetails = data;
        this.sharedService.setTitle(this.formatAddressPipe.transform(this.searchedPropertyDetails.address))
      }),
        tap(data => this.summaryTotals = data.info),
        tap(data => console.log('details', data))
      );

    if (this.propertyId) {
      this.propertyService.currentPropertyChanged(this.propertyId);
    }
    if(AppUtils.listInfo) {
      this.listInfo = AppUtils.listInfo;
      this.setDropdownLists();
    } else {
      this.sharedService.getDropdownListInfo().subscribe(data=> {
        this.listInfo = data;
        this.setDropdownLists();
      });
    }
  }

  setDropdownLists() {
    this.regions = this.sharedService.objectToMap(this.listInfo.result.regions);
    this.allAreas = this.sharedService.objectToMap(this.listInfo.result.areas);
    this.allSubAreas = this.sharedService.objectToMap(this.listInfo.result.subAreas);
  }
    isObject(val) {
      return val instanceof Object;
    }
  // getPropertyDetails(propertyId: number) {
  //   this.propertyService.getProperty(propertyId).subscribe(data => {
  //     // this.searchedPropertyDetails = data;
  //     console.log(this.searchedPropertyDetails);
  //   });
  // }

}
