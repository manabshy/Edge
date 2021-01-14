import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DropdownListInfo, InfoDetail } from 'src/app/core/services/info.service';
import { Property, PropertyStyles, PropertyTypes } from 'src/app/property/shared/property';

@Component({
  selector: 'app-property-card',
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent implements OnInit, OnChanges {
  @Input() propertyDetails: Property;
  @Input() showActions = false;
  propertyTypes = PropertyTypes;
  propertyStyles = PropertyStyles;
  listInfo: DropdownListInfo;
  regions: InfoDetail[];
  allAreas: InfoDetail[];
  allSubAreas: InfoDetail[];
  region: string;
  area: string;
  subArea: string;
 @Output() showPhotos = new EventEmitter<boolean>();
 @Output() showMap = new EventEmitter<boolean>();

  constructor(private router: Router, private storage: StorageMap) { }

  ngOnInit(): void {
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data as DropdownListInfo;
        if (this.listInfo) {
          this.regions = this.listInfo.regions;
          this.allAreas = this.listInfo.areas;
          this.allSubAreas = this.listInfo.subAreas;
        }
        console.log('list info property detail....', this.listInfo);
      }
    });
  }

  ngOnChanges() {
    if (this.propertyDetails) { this.setupRegionalValues(this.propertyDetails); }
  }

  showPhotosModal() {
    // this.showPhotos = true;
  }

  hidePhotosModal() {
    // this.showPhotos = false;
  }

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

  navigateToNewValuation(propertyId: number) {
    event.stopPropagation();
    this.router.navigate(['valuations-register/detail/', 0, 'edit'], {
      queryParams: {
        propertyId: propertyId,
        isNewValuation: true,
      }
    });
  }

}
