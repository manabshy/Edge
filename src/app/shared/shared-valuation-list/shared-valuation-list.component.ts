import { Component, OnInit, OnChanges, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Valuation, ValuationStatusEnum } from 'src/app/valuations/shared/valuation';
import { PeopleService } from 'src/app/core/services/people.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { PropertyService } from 'src/app/property/shared/property.service';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-shared-valuation-list',
  templateUrl: './shared-valuation-list.component.html',
  styleUrls: ['./shared-valuation-list.component.scss']
})
export class SharedValuationListComponent implements OnChanges {

  valuations$ = new Observable<Valuation[]>();
  @Input() personId: number;
  @Input() propertyId: number;

  constructor(private peopleService: PeopleService,
    private sharedService: SharedService,
    private propertyService: PropertyService,
    private router: Router) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes)
    if (this.personId) {
      this.valuations$ = this.peopleService.getValuations(this.personId)
        .pipe(
          tap(vals => {
            vals.forEach(x => {
              x.valuationStatusLabel = ValuationStatusEnum[x.valuationStatus];
            });
          })
        );
    }

    if (this.propertyId) {
      this.valuations$ = this.propertyService.getValuations(this.personId)
        .pipe(
          tap(vals => {
            this.sharedService.setValuationStatusLabel(vals);
          })
        );
    }
  }

  navigateToDetail(valuation: Valuation) {
    if (valuation) {
      this.router.navigate(['valuations-register/detail/', valuation.valuationEventId, 'edit'])
    }
  }
}


