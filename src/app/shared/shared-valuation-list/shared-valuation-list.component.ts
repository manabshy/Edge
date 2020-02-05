import { Component, OnInit, OnChanges, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { PeopleService } from 'src/app/core/services/people.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { PropertyService } from 'src/app/property/shared/property.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Valuation } from '../models/valuation';

@Component({
  selector: 'app-shared-valuation-list',
  templateUrl: './shared-valuation-list.component.html',
  styleUrls: ['./shared-valuation-list.component.scss']
})
export class SharedValuationListComponent implements OnChanges {

  valuations$ = new Observable<Valuation[]>();
  @Input() personId: number;
  @Input() propertyId: number;
  @Input() moreInfo: string;
  @Input() closedCounter: number;
  isClosedIncluded: boolean = false;
  constructor(private peopleService: PeopleService,
    private sharedService: SharedService,
    private propertyService: PropertyService,
    private router: Router) { }

  ngOnChanges() {
    if (this.moreInfo && this.moreInfo.includes('valuations')) {
      this.getValuations();
    }
  }

  private getValuations() {
    if (this.personId) {
      this.valuations$ = this.peopleService.getValuations(this.personId, this.isClosedIncluded)
        .pipe(tap(vals => {
          this.sharedService.setValuationStatusLabel(vals);
        }));
    }
    if (this.propertyId) {
      this.valuations$ = this.propertyService.getValuations(this.propertyId, this.isClosedIncluded)
        .pipe(tap(vals => {
          this.sharedService.setValuationStatusLabel(vals);
        }));
    }
  }

  navigateToDetail(valuation: Valuation) {
    if (valuation) {
      this.router.navigate(['valuations-register/detail/', valuation.valuationEventId, 'edit'])
    }
  }
}


