import { Component, Input, Output, EventEmitter } from '@angular/core'
import {
  InstructionViewingAndMarketingStatus,
  InstructionStatus,
  InstructionTableCell,
  InstructionsTableType,
  SortableColumnsForInstructions
} from '../../../instructions.interfaces'

@Component({
  selector: 'app-instructions-table',
  template: `
    <div class="p-4">
      <div class="table">
        <table class="border border-red-400">
          <thead>
            <tr>
              <th (click)="onSortClicked.emit('status')" class="cursor-pointer">
                Status
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'SearchableOnWebsite'"></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('address')" class="cursor-pointer">
                Address
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'PropertyAddress'"></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('owner')" class="cursor-pointer">
                Owner
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'PropertyOwner'"></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('instructionDate')" class="cursor-pointer">
                <span>Instruction Date</span>
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'InstructionDate'"></app-table-col-sort>
              </th>
              <th (click)="onSortClicked.emit('lister')" class="cursor-pointer">
                Lister
                <app-table-col-sort [orderBy]="orderBy" [columnId]="'InstructionLister'"></app-table-col-sort>
              </th>
              <th
                (click)="onSortClicked.emit('longLet')"
                class="cursor-pointer"
                *ngIf="
                  tableType === instructionsTableType.LETTINGS || tableType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                Long Let
              </th>
              <th
                (click)="onSortClicked.emit('shortLet')"
                class="cursor-pointer"
                *ngIf="
                  tableType === instructionsTableType.LETTINGS || tableType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                Short Let
              </th>
              <th
                (click)="onSortClicked.emit('marketingPrice')"
                class="cursor-pointer"
                *ngIf="
                  tableType === instructionsTableType.SALES || tableType === instructionsTableType.SALES_AND_LETTINGS
                "
              >
                Marketing Price
              </th>
              <th (click)="onSortClicked.emit('viewingStatus')" class="cursor-pointer">Viewing</th>
              <th (click)="onSortClicked.emit('marketingStatus')" class="cursor-pointer">Marketing</th>
            </tr>
          </thead>

          <tbody>
            <tr
              *ngFor="let row of tableData"
              (click)="onNavigateToInstruction.emit(row)"
              data-cy="instructionsList"
              class="cursor-pointer"
            >
              <td data-title="Status">
                <span class="cell-content">
                  <span class="pill px-3 whitespace-nowrap text-white" [ngClass]="setStatusColour(row.status)">
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
      </div>
    </div>
  `
})
export class InstructionsTableComponent {
  @Input() tableType: string = InstructionsTableType.SALES_AND_LETTINGS
  @Input() orderBy: string
  @Input() tableData: InstructionTableCell[] = []
  @Output() onSortClicked: EventEmitter<any> = new EventEmitter()
  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()

  instructionsTableType = InstructionsTableType
  sortableColumnHeaders = SortableColumnsForInstructions

  setViewingAndMarketingStatusColour(status) {
    switch (status) {
      case InstructionViewingAndMarketingStatus.not_ready:
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
        return 'bg-gray-800'

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
