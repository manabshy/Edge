import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonOffer } from 'src/app/shared/models/person';
import { PeopleService } from 'src/app/core/services/people.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contactgroups-detail-offers',
  templateUrl: './contactgroups-detail-offers.component.html',
  styleUrls: ['./contactgroups-detail-offers.component.scss']
})
export class ContactgroupsDetailOffersComponent implements OnChanges {
  @Input() personId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  isClosedIncluded: boolean = false;
  offers$ = new Observable<PersonOffer[]>();

  constructor(private route: ActivatedRoute, private peopleService: PeopleService) { }

  ngOnChanges() {
    if (this.personId && this.moreInfo && this.moreInfo.includes('offers')) {
      this.getOffers();
    }
  }

  getOffers() {
    this.offers$ = this.peopleService.getOffers(this.personId, this.isClosedIncluded);
  }

}
