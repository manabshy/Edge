import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferInfo } from '../shared/property';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-property-detail-offers',
  templateUrl: './property-detail-offers.component.html',
  styleUrls: ['./property-detail-offers.component.scss']
})
export class PropertyDetailOffersComponent implements OnChanges {
  @Input() propertyId: number;
  @Input() closedCounter: number;
  isClosedIncluded: boolean = false;
  offers$ = new Observable<OfferInfo[]>();

  constructor(private route: ActivatedRoute, private propertyService: PropertyService) { }

  ngOnChanges() {
    if (this.propertyId) {
      this.getOffers();
    }
  }

  getOffers() {
    this.offers$ = this.propertyService.getPropertyOffers(this.propertyId, this.isClosedIncluded);
  }

}
