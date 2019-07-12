import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { Property, PropertyTypes, PropertyStyles } from '../shared/property';

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

  constructor(private propertyService: PropertyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('types', this.propertyTypes.get(1));
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId).subscribe(data => {
      this.searchedPropertyDetails = data;
      console.log(this.searchedPropertyDetails);
    });
  }

}
