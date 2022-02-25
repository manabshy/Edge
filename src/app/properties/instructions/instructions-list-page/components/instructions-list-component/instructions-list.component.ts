import { Component, Input, Output, EventEmitter } from '@angular/core'
import {
  InstructionViewingAndMarketingStatus,
  InstructionStatusForSalesAndLettingsEnum,
  InstructionTableCell,
  InstructionsTableType,
  SortableColumnsForInstructions
} from '../../../instructions.interfaces'

@Component({
  selector: 'app-instructions-list',
  styles: [`
  @media (min-width: 768px) {
    .table--mobile td .cell-content {
      width: 100%;
      overflow: hidden !important;
    }
  }
  `],

  template: `
    <div class="table mt-4">
      <app-infinite-scroll (scrolled)="onScrollDown.emit()">
        <table class="table--mobile table--rowHover table-fixed border bg-white table">
          <thead class="sticky top-14 pt-6 bg-white z-10">
            <tr>
              <th (click)="onSortClicked.emit('status')" class="cursor-pointer">
                <span class="mr-1">Status</span>
                <app-table-col-sort
                  [orderBy]="searchModel.orderBy"
                  [columnId]="'InstructionStatusId'"
                ></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('address')" class="cursor-pointer">
                <span class="mr-1">Address</span>
                <app-table-col-sort [orderBy]="searchModel.orderBy" [columnId]="'PropertyAddress'"></app-table-col-sort>
              </th>
              <th>
                <span class="mr-1 cursor-not-allowed">Owner</span>
              </th>
              <th (click)="onSortClicked.emit('instructionDate')" class="cursor-pointer">
                <span class="mr-1">Instruction Date</span>
                <app-table-col-sort [orderBy]="searchModel.orderBy" [columnId]="'InstructionDate'"></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('lister')" class="cursor-pointer w-40">
                <span class="mr-1">Lister</span>
                <app-table-col-sort
                  [orderBy]="searchModel.orderBy"
                  [columnId]="'InstructionLister'"
                ></app-table-col-sort>
              </th>
              <th
                (click)="onSortClicked.emit('longLetPrice')"
                class="cursor-pointer"
                *ngIf="
                  searchModel.departmentType === instructionsTableType.LETTINGS ||
                  searchModel.departmentType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="mr-1">Long Let</span>
                <app-table-col-sort [orderBy]="searchModel.orderBy" [columnId]="'LongLetPrice'"></app-table-col-sort>
              </th>
              <th
                (click)="onSortClicked.emit('shortLetPrice')"
                class="cursor-pointer"
                *ngIf="
                  searchModel.departmentType === instructionsTableType.LETTINGS ||
                  searchModel.departmentType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="mr-1">Short Let</span>
                <app-table-col-sort [orderBy]="searchModel.orderBy" [columnId]="'ShortLetPrice'"></app-table-col-sort>
              </th>
              <th
                (click)="onSortClicked.emit('marketingPrice')"
                class="cursor-pointer"
                *ngIf="
                  searchModel.departmentType === instructionsTableType.SALES ||
                  searchModel.departmentType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="mr-1">Marketing Price</span>
                <app-table-col-sort [orderBy]="searchModel.orderBy" [columnId]="'MarketingPrice'"></app-table-col-sort>
              </th>
              <th class="w-16">Viewing</th>
              <th class="w-16">Marketing</th>
            </tr>
          </thead>

          <tbody>
            <tr
              *ngFor="let row of tableData"
              (click)="onNavigateToInstruction.emit(row)"
              data-cy="instructionsList"
              class="cursor-default even:bg-gray-50"
            >
              <td data-title="Status">
                <span class="cell-content">
                  <span class="pill mt-2 px-3 whitespace-nowrap text-white" [ngClass]="setStatusColour(row.status)">
                    {{ row.status }}
                  </span>
                </span>
              </td>
              <td data-title="Address">
                <span class="cell-content">
                  <span>
                    {{ row.address }}
                  </span>
                </span>
              </td>
              <td data-title="Owner">
                <span class="cell-content">
                  <span>
                    {{ row.owner }}
                  </span>
                </span>
              </td>
              <td data-title="Instruction Date">
                <span class="cell-content">
                  <span>
                    {{ row.instructionDate | date: 'dd/MM/yyyy' || '-' }}
                  </span>
                </span>
              </td>
              <td data-title="Lister">
                <span class="cell-content">
                  <span>
                    {{ row.lister }}
                  </span>
                </span>
              </td>
              <td
                data-title="LongLet"
                *ngIf="
                  searchModel.departmentType === instructionsTableType.LETTINGS ||
                  searchModel.departmentType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="cell-content">
                  <span>
                    {{ row.longLetPrice | currency: 'GBP':'symbol':'1.0-0' || '-' }}
                  </span>
                </span>
              </td>
              <td
                data-title="ShortLet"
                *ngIf="
                  searchModel.departmentType === instructionsTableType.LETTINGS ||
                  searchModel.departmentType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="cell-content">
                  <span>
                    {{ row.shortLetPrice | currency: 'GBP':'symbol':'1.0-0' }}
                  </span>
                </span>
              </td>
              <td
                data-title="MarketingPrice"
                *ngIf="
                  searchModel.departmentType === instructionsTableType.SALES ||
                  searchModel.departmentType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="cell-content">
                  <span>
                    {{ row.marketingPrice | currency: 'GBP':'symbol':'1.0-0' || '-' }}
                  </span>
                </span>
              </td>
              <td data-title="ViewingStatus">
                <span class="cell-content flex flex-col items-center justify-center">
                  <span
                    class="w-4 h-4 rounded-full inline-block mt-3"
                    [ngClass]="setViewingAndMarketingStatusColour(row.viewingStatus)"
                  ></span>
                </span>
              </td>
              <td data-title="MarketingStatus">
                <span class="cell-content flex flex-col items-center justify-center">
                  <span
                    class="w-4 h-4 rounded-full inline-block mt-3"
                    [ngClass]="setViewingAndMarketingStatusColour(row.marketingStatus)"
                  ></span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </app-infinite-scroll>
    </div>
  `
})
export class InstructionsListComponent {
  @Input() searchModel: any
  @Input() tableData: InstructionTableCell[] = []
  @Input() bottomReached: boolean

  @Output() onSortClicked: EventEmitter<any> = new EventEmitter()
  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()

  page: number
  instructionsTableType = InstructionsTableType
  sortableColumnHeaders = SortableColumnsForInstructions

  setViewingAndMarketingStatusColour(status) {
    switch (status) {
      case InstructionViewingAndMarketingStatus.notReady:
        return 'bg-gray-400'

      case InstructionViewingAndMarketingStatus.ready:
        return 'bg-yellow-400'

      case InstructionViewingAndMarketingStatus.commenced:
        return 'bg-green-400'

      case InstructionViewingAndMarketingStatus.stopped:
        return 'bg-red-400'
    }
  }

  setStatusColour(status) {
    switch (status) {
      case InstructionStatusForSalesAndLettingsEnum.let:
      case InstructionStatusForSalesAndLettingsEnum.completed:
        return 'bg-green-400'

      case InstructionStatusForSalesAndLettingsEnum.withdrawn:
        return 'bg-red-400'

      case InstructionStatusForSalesAndLettingsEnum.instructed:
        return 'bg-gray-700'

      case InstructionStatusForSalesAndLettingsEnum.underOffer:
        return 'bg-blue-400'

      case InstructionStatusForSalesAndLettingsEnum.underOfferOtherAgent:
        return 'bg-blue-200'

      // case InstructionStatusForSalesAndLettingsEnum.end:
      //   return 'bg-yellow-400'

      case InstructionStatusForSalesAndLettingsEnum.exchanged:
        return 'bg-pink-400'
    }
  }
}
