import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferInfo } from '../shared/property';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';

@Component({
  selector: 'app-property-detail-offers',
  templateUrl: './property-detail-offers.component.html',
  styleUrls: ['./property-detail-offers.component.scss']
})
export class PropertyDetailOffersComponent implements OnInit {
  propertyId: number;
  offers$ = new Observable<OfferInfo[]>();

    constructor(private route: ActivatedRoute, private propertyService: PropertyService) { }

    ngOnInit() {
     this.propertyId = +this.route.snapshot.paramMap.get('id') || 0;
     if (this.propertyId) {
      this.offers$ = this.propertyService.getPropertyOffers(this.propertyId);
     }
    }

}
