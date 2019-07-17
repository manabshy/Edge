import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { Property, PropertyTypes, PropertyStyles } from '../shared/property';
import { SharedService, InfoDetail } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  propertyId: number;
  searchedPropertyDetails: Property;
  propertyTypes = PropertyTypes;
  propertyStyles = PropertyStyles;
  listInfo: any;
  regions: any;
  allAreas: any;
  allSubAreas: any;

  get region() {
    if(this.searchedPropertyDetails && this.regions) {
      let getRegion = this.regions.get(this.searchedPropertyDetails.regionId.toString()).get('value');
      return getRegion;
    }
  }

  get area() {
    if(this.searchedPropertyDetails && this.allAreas) {
      let getArea = this.allAreas.get(this.searchedPropertyDetails.areaId.toString()).get('value');
      return getArea;
    }
  }

  get subArea() {
    if(this.searchedPropertyDetails && this.allSubAreas) {
      let getSubArea = this.allSubAreas.get(this.searchedPropertyDetails.subAreaId.toString()).get('value');
      return getSubArea;
    }
  }


  constructor(private propertyService: PropertyService,
              private route: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }
    this.sharedService.getDropdownListInfo().subscribe(data => {
      this.listInfo = data;
      this.regions = this.sharedService.objectToMap(this.listInfo.result.regions);
      this.allAreas = this.sharedService.objectToMap(this.listInfo.result.areas);
      this.allSubAreas = this.sharedService.objectToMap(this.listInfo.result.subAreas);
    });
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId).subscribe(data => {
      this.searchedPropertyDetails = data;
      console.log(this.searchedPropertyDetails);
    });
  }

}
