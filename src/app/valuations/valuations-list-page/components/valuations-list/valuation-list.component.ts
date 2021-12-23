import { Component, Input, EventEmitter, Output } from '@angular/core'
import { Valuation, ValuationStatusEnum } from '../../../shared/valuation'

@Component({
  selector: 'app-valuations-list',
  template: `
    <div class="p-4 mt-4">
      <app-infinite-scroll (scrolled)="onScrollDown.emit()">
        <table class="table-fixed border bg-white">
          <thead class="sticky top-14 bg-white z-10">
            <tr>
              <th class="w-24">Status</th>
              <th>Address</th>
              <th>Owner</th>
              <th class="w-24">Valuation Date</th>
              <th class="w-40">Valuer</th>
              <th class="w-24">Sale</th>
              <th class="w-24">Long Let</th>
              <th class="w-24">Short Let</th>
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
    <div class="text-center text-danger" *ngIf="isMessageVisible && page === 1">
      <i class="far fa-sad-tear"></i>
      No results for your current search
    </div>

    <ng-template #noValue>-</ng-template>
  `
})
export class ValuationsListComponent  {
  @Input() valuations: Valuation[]
  @Input() page: any
  @Input() bottomReached: boolean
  @Input() isMessageVisible: boolean

  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
  @Output() onNavigateTo: EventEmitter<any> = new EventEmitter()

 
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
