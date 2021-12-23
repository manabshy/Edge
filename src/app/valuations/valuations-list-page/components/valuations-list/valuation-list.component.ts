import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core'
import { Valuation, ValuationStatusEnum } from '../../../shared/valuation'
import { ValuationFacadeService } from '../../../shared/valuation-facade.service'

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
            <tr
              *ngFor="let val of valuations"
              (click)="onNavigateTo.emit(val)"
              data-cy="valuationList"
              class="cursor-pointer"
            >
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
    <div class="text-center text-danger" *ngIf="isMessageVisible && searchModel.page === 1">
      <i class="far fa-sad-tear"></i>
      No results for your current search
    </div>

    <ng-template #noValue>-</ng-template>
  `
})
export class ValuationsListComponent implements OnInit, OnChanges {
  @Input() valuations: Valuation[]
  @Input() searchModel: any
  @Input() bottomReached: boolean
  @Input() isMessageVisible: boolean
  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
  @Output() onNavigateTo: EventEmitter<any> = new EventEmitter()

  constructor(private _valuationFacadeSvc: ValuationFacadeService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.valuations) {
      // console.log('valuations', this.valuations)
      this.valuations.forEach((x) => {
        x.valuationStatusLabel = ValuationStatusEnum[x.valuationStatus]
      })
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
