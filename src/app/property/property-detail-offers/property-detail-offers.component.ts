import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferInfo } from '../shared/property';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';

@Component({
  selector: 'app-property-detail-offers',
  templateUrl: './property-detail-offers.component.html',
  styleUrls: ['./property-detail-offers.component.scss']
})
export class PropertyDetailOffersComponent implements OnChanges {
  @Input() propertyId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  isClosedIncluded: boolean = false;
  offers$ = new Observable<OfferInfo[]>();

  constructor(private propertyService: PropertyService) { }

  ngOnChanges() {
    if (this.propertyId && this.moreInfo && this.moreInfo.includes('offers')) {
      this.getOffers();
    }
  }

  getOffers() {
    this.offers$ = this.propertyService.getPropertyOffers(this.propertyId, this.isClosedIncluded);
  }

}
