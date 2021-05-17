import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonOffer } from 'src/app/shared/models/person';
import { PeopleService } from 'src/app/core/services/people.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from 'src/app/property/shared/property.service';

@Component({
  selector: 'app-contactgroups-detail-offers',
  templateUrl: './contactgroups-detail-offers.component.html',
  styleUrls: ['./contactgroups-detail-offers.component.scss']
})
export class ContactgroupsDetailOffersComponent implements OnChanges {
  @Input() personId: number;
  @Input() propertyId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  hidePrevious: boolean = false;
  offers$ = new Observable<any>();

  constructor(private route: ActivatedRoute, private peopleService: PeopleService, private propertyService: PropertyService) { }

  ngOnChanges() {
    if (this.moreInfo?.includes('offers')) {
      this.getOffers();
    }
  }

  getOffers() {
    if (this.personId) {
      this.offers$ = this.peopleService.getOffers(this.personId, this.hidePrevious);
    } else if (this.propertyId) {
      this.offers$ = this.propertyService.getPropertyOffers(this.propertyId, this.hidePrevious);
    }
  }

}