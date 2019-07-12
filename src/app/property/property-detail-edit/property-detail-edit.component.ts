import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Property } from '../shared/property';

@Component({
  selector: 'app-property-detail-edit',
  templateUrl: './property-detail-edit.component.html',
  styleUrls: ['./property-detail-edit.component.scss']
})
export class PropertyDetailEditComponent implements OnInit {
  propertyId: number;
  propertyDetails: Property;

  constructor(private route: ActivatedRoute, private propertyService: PropertyService) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId).subscribe(data => {
      this.propertyDetails = data;
      console.log(this.propertyDetails);
    });
  }

}
