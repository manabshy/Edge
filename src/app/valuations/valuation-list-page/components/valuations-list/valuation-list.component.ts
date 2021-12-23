import { Component, OnInit, Input, OnChanges, HostListener, OnDestroy, EventEmitter, Output } from '@angular/core'
import { Valuation, ValuationStatusEnum } from '../../../shared/valuation'
import { ValuationFacadeService } from '../../../shared/valuation-facade.service'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-valuations-list',
  template: `
    <div class="table">
      <app-infinite-scroll (scrolled)="onScrollDown.emit()">
        <table class="table--mobile table--rowHover">
          <thead class="sticky top-14">
            <tr>
              <th>Status</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Valuation Date</th>
              <th>Valuer</th>
              <th>Sale</th>
              <th>Long Let</th>
              <th>Short Let</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let val of valuations" (click)="navigateTo(val)" data-cy="valuationList" class="cursor-pointer">
              <td data-title="Status">
                <span class="cell-content">
                  <span class="pill" [ngStyle]="{ 'background-color': getStatusColor(val), color: 'white' }">
                    {{ val?.valuationStatusLabel }}
                  </span>
                </span>
              </td>

              <td data-title="Address">
                <span class="cell-content">
                  <a class="underline table-link" (click)="navigateTo(val); $event.stopPropagation()">
                    {{ val?.property?.address | formatAddress }}
                  </a>
                </span>
              </td>
              <td data-title="Owner">
                <span class="cell-content">
                  {{
                    val?.propertyOwner?.companyName
                      ? val?.propertyOwner?.companyName + '(' + val?.propertyOwner?.contactNames + ')'
                      : val?.propertyOwner?.contactNames || '-'
                  }}
                </span>
              </td>
              <td data-title="Date">
                <span class="cell-content">{{ (val?.valuationDate | date: 'dd/MM/yyyy') || '-' }}</span>
              </td>
              <td data-title="Valuer">
                <span class="cell-content" *ngIf="val?.salesValuer">
                  {{ val?.salesValuer?.fullName }}
                  <small *ngIf="val.salesValuer && val.lettingsValuer">,</small>
                </span>
                <span class="cell-content" *ngIf="val?.lettingsValuer">{{ val.lettingsValuer?.fullName }}</span>
              </td>
              <td data-title="Sale">
                <span class="cell-content">
                  <ng-container *ngIf="val?.suggestedAskingPrice; else noValue">
                    {{ val?.suggestedAskingPrice | currency: 'GBP':'symbol':'1.0-0' }}
                  </ng-container>
                </span>
              </td>
              <td data-title="Long Let">
                <span class="cell-content">
                  <ng-container *ngIf="val?.suggestedAskingRentLongLet; else noValue">
                    {{ val?.suggestedAskingRentLongLet | currency: 'GBP':'symbol':'1.0-0' }} pw
                  </ng-container>
                </span>
              </td>
              <td data-title="Short Let">
                <span class="cell-content">
                  <ng-container *ngIf="val?.suggestedAskingRentShortLet; else noValue">
                    {{ val?.suggestedAskingRentShortLet | currency: 'GBP':'symbol':'1.0-0' }} pw
                  </ng-container>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </app-infinite-scroll>
    </div>
    <div class="text-center text-danger" *ngIf="isMessageVisible && page === 1">
      <i class="far fa-sad-tear"></i>
      No results for your current search
    </div>

    <ng-template #noValue>-</ng-template>
  `
})
export class ValuationsListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() valuations: Valuation[]
  @Input() searchTerm: string
  @Input() bottomReached: boolean
  @Input() isMessageVisible: boolean
  @Input() pageNumber: number
  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
  page: number

  constructor(
    private _valuationFacadeSvc: ValuationFacadeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.valuations) {
      // console.log('valuations', this.valuations)
      this.valuations.forEach((x) => {
        x.valuationStatusLabel = ValuationStatusEnum[x.valuationStatus]
      })
    }
    this.page = this.pageNumber
  }

  navigateTo(val: Valuation) {
    let path = ['detail', val?.valuationEventId, 'edit']
    if (val.valuationStatus === ValuationStatusEnum.Cancelled || val.valuationStatus === ValuationStatusEnum.Closed) {
      path = ['detail', val?.valuationEventId, 'cancelled']
    } else if (val.valuationStatus === ValuationStatusEnum.Instructed) {
      path = ['detail', val?.valuationEventId, 'instructed']
    }
    this.router.navigate(path, { relativeTo: this.activatedRoute })
  }

  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll() {
  //   let scrollHeight: number, totalHeight: number
  //   scrollHeight = document.body.scrollHeight
  //   totalHeight = window.scrollY + window.innerHeight
  //   const url = this.router.url
  //   const isValuationsRegister = url.endsWith('/valuations')

  //   if (isValuationsRegister) {
  //     if (totalHeight >= scrollHeight && !this.bottomReached) {
  //       // console.log('%c first request NOOOOO', 'color:green', this.page)
  //       if (this.valuations && this.valuations.length) {
  //         this.page++
  //         // console.log('%c Not first request', 'color:purple', this.page)
  //         this._valuationFacadeSvc.valuationPageNumberChanged(this.page)
  //         // console.log('valuations page number', this.page)
  //       }
  //     }
  //   }
  // }

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

  ngOnDestroy() {
    this._valuationFacadeSvc.valuationPageNumberChanged(0)
    // console.log('%c on destroy ', 'color:blue', this.page)
  }
}
