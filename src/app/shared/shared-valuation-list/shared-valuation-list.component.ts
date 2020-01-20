import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Valuation, ValuationStatusEnum } from 'src/app/valuations/shared/valuation';
import { PeopleService } from 'src/app/core/services/people.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-shared-valuation-list',
  templateUrl: './shared-valuation-list.component.html',
  styleUrls: ['./shared-valuation-list.component.scss']
})
export class SharedValuationListComponent implements OnChanges {

  valuations$ = new Observable<Valuation[]>();
  @Input() personId: number;

  constructor(private peopleService: PeopleService, private router: Router) { }

  ngOnChanges() {
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
  }

  navigateToDetail(valuation: Valuation) {
    if (valuation) {
      this.router.navigate(['valuations-register/detail/', valuation.valuationEventId, 'edit'])
    }
  }
}


