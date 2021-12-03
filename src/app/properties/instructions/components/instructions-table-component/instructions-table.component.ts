import { Component, Input } from '@angular/core'

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
            <tr *ngFor="let row of tableData" (click)="navigateTo(val)" data-cy="instructionsList" class="cursor-pointer">
              <td data-title="Status">
                <span class="cell-content">
                  <span class="pill" >
                    {{ row.statusLabel }}
                  </span>
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
  @Input() tableData: any[] = []

  constructor() {}
}
