import { Component, OnInit, OnChanges, Input, SimpleChange, SimpleChanges } from '@angular/core'
import { Valuation, ValuationStatusEnum } from 'src/app/valuations/shared/valuation'
import { PeopleService } from 'src/app/core/services/people.service'
import { Observable } from 'rxjs'
import { ActivatedRoute, Router } from '@angular/router'
import { tap } from 'rxjs/operators'
import { PropertyService } from 'src/app/property/shared/property.service'
import { SharedService } from 'src/app/core/services/shared.service'

@Component({
  selector: 'app-shared-valuation-list',
  templateUrl: './shared-valuation-list.component.html',
  styleUrls: ['./shared-valuation-list.component.scss']
})
export class SharedValuationListComponent implements OnChanges {
  valuations$ = new Observable<Valuation[]>()
  @Input() personId: number
  @Input() propertyId: number
  @Input() moreInfo: string
  @Input() closedCounter: number
  hidePrevious: boolean = false
  constructor(
    private peopleService: PeopleService,
    private sharedService: SharedService,
    private propertyService: PropertyService,
    private router: Router
  ) {}

  ngOnChanges() {
    if (this.moreInfo && this.moreInfo.includes('valuations')) {
      this.getValuations()
    }
  }

  private getValuations() {
    if (this.personId) {
      this.valuations$ = this.peopleService.getValuations(this.personId, this.hidePrevious).pipe(
        tap((vals) => {
          this.sharedService.setValuationStatusLabel(vals)
        })
      )
    }
    if (this.propertyId) {
      this.valuations$ = this.propertyService.getValuations(this.propertyId, this.hidePrevious).pipe(
        tap((vals) => {
          this.sharedService.setValuationStatusLabel(vals)
        })
      )
    }
  }

  navigateToDetail(valuation: Valuation) {
    // Commented out for release : 08/04
    if (valuation) {
      this.router.navigate(['valuations-register/detail/', valuation.valuationEventId, 'edit'])
    }
  }

  getStatusColor(valuation: Valuation) {
    if (valuation) {
      if (valuation.valuationStatus == ValuationStatusEnum.Booked) return '#4DA685'
      else if (valuation.valuationStatus == ValuationStatusEnum.Cancelled) {
        return '#E02020'
      } else if (valuation.valuationStatus == ValuationStatusEnum.Instructed) {
        return '#0A1A4A'
      } else if (valuation.valuationStatus == ValuationStatusEnum.Valued) {
        return '#3498DB'
      } else if (valuation.valuationStatus == ValuationStatusEnum.Closed) {
        return '#FFB134'
      }
    }
  }
}
