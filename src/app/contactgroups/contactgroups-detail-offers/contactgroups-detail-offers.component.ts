import { Component, OnInit } from '@angular/core';
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
export class ContactgroupsDetailOffersComponent implements OnInit {
  personId: number;
  offers$ = new Observable<PersonOffer[]>();
  navPlaceholder: string;

  constructor(private route: ActivatedRoute, private peopleService: PeopleService) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    this.personId = +this.route.snapshot.paramMap.get('personId') || 0;
    if (this.personId) {
      this.offers$ = this.peopleService.getOffers(this.personId);
    }
  }

}
