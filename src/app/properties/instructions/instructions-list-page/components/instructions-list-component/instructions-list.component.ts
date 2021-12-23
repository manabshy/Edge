import { Component, Input, Output, EventEmitter } from '@angular/core'
import {
  InstructionViewingAndMarketingStatus,
  InstructionStatus,
  InstructionTableCell,
  InstructionsTableType,
  SortableColumnsForInstructions
} from '../../../instructions.interfaces'

@Component({
  selector: 'app-instructions-list',
  template: `
    <div class="p-4">
      <app-infinite-scroll (scrolled)="onScrollDown.emit()">
        <table class="table-fixed border bg-white">
          <thead class="sticky top-14 pt-6 bg-white z-10">
            <tr>
              <th (click)="onSortClicked.emit('status')" class="w-24 cursor-pointer">
                <span class="mr-1">Status</span>
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'InstructionStatusId'"></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('address')" class="cursor-pointer">
                <span class="mr-1">Address</span>
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'PropertyAddress'"></app-table-col-sort>
              </th>
              <th>
                <span class="mr-1">Owner</span>
              </th>
              <th (click)="onSortClicked.emit('instructionDate')" class="w-24 cursor-pointer">
                <span class="mr-1">Instruction Date</span>
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'InstructionDate'"></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('lister')" class="cursor-pointer w-40">
                <span class="mr-1">Lister</span>
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'InstructionLister'"></app-table-col-sort>
              </th>
              <th
                (click)="onSortClicked.emit('longLet')"
                class="cursor-pointer  w-24"
                *ngIf="
                  tableType === instructionsTableType.LETTINGS || tableType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="mr-1">Long Let</span>
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'LongLetPrice'"></app-table-col-sort>
              </th>
              <th
                (click)="onSortClicked.emit('shortLet')"
                class="cursor-pointer w-24"
                *ngIf="
                  tableType === instructionsTableType.LETTINGS || tableType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="mr-1">Short Let</span>
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'ShortLetPrice'"></app-table-col-sort>
              </th>
              <th
                (click)="onSortClicked.emit('marketingPrice')"
                class="cursor-pointer  w-24"
                *ngIf="
                  tableType === instructionsTableType.SALES || tableType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                <span class="mr-1">Marketing Price</span>
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'MarketingPrice'"></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('viewingStatus')" class="w-20 cursor-pointer">Viewing</th>
              <th (click)="onSortClicked.emit('marketingStatus')" class="w-20 cursor-pointer">Marketing</th>
            </tr>
          </thead>

          <tbody>
            <tr
              *ngFor="let row of tableData"
              (click)="onNavigateToInstruction.emit(row)"
              data-cy="instructionsList"
              class="cursor-pointer even:bg-gray-50"
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
                  tableType === instructionsTableType.LETTINGS || tableType === instructionsTableType.SALES_AND_LETTINGS
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
                  tableType === instructionsTableType.LETTINGS || tableType === instructionsTableType.SALES_AND_LETTINGS
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
                  tableType === instructionsTableType.SALES || tableType === instructionsTableType.SALES_AND_LETTINGS
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
  @Input() tableType: string = InstructionsTableType.SALES_AND_LETTINGS
  @Input() orderBy: string
  @Input() tableData: InstructionTableCell[] = []
  @Input() searchTerm: string
  @Input() bottomReached: boolean
  @Input() pageNumber: number

  @Output() onSortClicked: EventEmitter<any> = new EventEmitter()
  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()

  page: number
  instructionsTableType = InstructionsTableType
  sortableColumnHeaders = SortableColumnsForInstructions

  // @HostListener('window:scroll', ['$event'])
  // onWindowScroll() {
  //   let scrollHeight: number, totalHeight: number
  //   scrollHeight = document.body.scrollHeight
  //   totalHeight = window.scrollY + window.innerHeight

  //   if (totalHeight >= scrollHeight && !this.bottomReached) {
  //     // console.log('%c first request NOOOOO', 'color:green', this.page)
  //     if (this.tableData && this.tableData.length) {
  //       this.page++
  //       console.log('%c Not first request', 'color:purple', this.page)
  //       // this._valuationFacadeSvc.valuationPageNumberChanged(this.page)
  //       console.log('instructions page number', this.page)
  //     }
  //   }
  // }

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
      case InstructionStatus.let:
      case InstructionStatus.completed:
        return 'bg-green-400'

      case InstructionStatus.withdrawn:
        return 'bg-red-400'

      case InstructionStatus.instructed:
        return 'bg-gray-700'

      case InstructionStatus.underOffer:
        return 'bg-blue-400'

      case InstructionStatus.underOfferOtherAgent:
        return 'bg-blue-200'

      case InstructionStatus.end:
        return 'bg-yellow-400'

      case InstructionStatus.exchanged:
        return 'bg-pink-400'

      case InstructionStatus.tom:
        return 'bg-pink-700'
    }
  }
}
