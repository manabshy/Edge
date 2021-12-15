import { Component, Input, Output, EventEmitter } from '@angular/core'
import {
  InstructionViewingAndMarketingStatus,
  InstructionStatus,
  InstructionTableCell
} from '../../../instructions.interfaces'

@Component({
  selector: 'app-instructions-table',
  template: `
    <div class="p-4">
      <div class="table">
        <table class="border border-red-400">
          <thead>
            <tr>
              <th>Status</th>
              <th>Address</th>
              <th>Owner</th>
              <th>Instruction Date</th>
              <th>Lister</th>
              <th *ngIf="tableType === 'SALES'">Marketing Price</th>
              <th *ngIf="tableType === 'LETTINGS'">Long Let</th>
              <th *ngIf="tableType === 'LETTINGS'">Short Let</th>
              <th>Viewing Status</th>
              <th>Marketing Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              *ngFor="let row of tableData"
              (click)="navigateTo(val)"
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
                    {{ row.instructionDate }}
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
              <td data-title="LongLet" *ngIf="tableType === 'LETTINGS'">
                <span class="cell-content">
                  <span>
                    {{ row.longLetPrice || '-' }}
                  </span>
                </span>
              </td>
              <td data-title="ShortLet" *ngIf="tableType === 'LETTINGS'">
                <span class="cell-content">
                  <span>
                    {{ row.shortLetPrice }}
                  </span>
                </span>
              </td>
              <td data-title="MarketingPrice" *ngIf="tableType === 'SALES'">
                <span class="cell-content">
                  <span>
                    {{ row.marketingPrice || '-' }}
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
  @Input() tableType: string = 'LETTINGS'
  @Input() tableData: InstructionTableCell[] = []
  @Output() navigateTo: EventEmitter<any> = new EventEmitter()
  constructor() {}

  setViewingAndMarketingStatusColour(status) {
    console.log('setViewingAndMarketingStatusColour for ', status)
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
    console.log('setStatusColour for ', status)
    switch (status) {
      case InstructionStatus.let:
      case InstructionStatus.completed:
        return 'bg-green-400'

      case InstructionStatus.withdrawn:
        return 'bg-red-400'

      case InstructionStatus.instructed:
        return 'bg-gray-800'

      case InstructionStatus.under_offer:
        return 'bg-blue-400'

      case InstructionStatus.under_offer_oa:
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
