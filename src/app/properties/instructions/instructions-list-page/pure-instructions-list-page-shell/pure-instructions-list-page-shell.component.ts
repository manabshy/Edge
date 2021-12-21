import { Component, Input, Output, EventEmitter } from '@angular/core'
import { InstructionsStoreState } from '../../instructions.interfaces'

@Component({
  selector: 'app-pure-instructions-list-page-shell',
  template: `
    <div class="row">
      <app-instructions-search
        [searchStats]="vm.searchStats"
        [searchModel]="vm.searchModel"
        [listerOptions]="vm.listersForSelect"
        [statusOptions]="vm.statusesForSelect"
        [officeOptions]="vm.officesForSelect"
        (onGetInstructions)="onGetInstructions.emit($event)"
        (onDepartmentChanged)="onDepartmentChanged.emit($event)"
      ></app-instructions-search>

      <app-instructions-table
        [tableType]="vm.searchModel.departmentType"
        [tableData]="vm.instructions"
        [orderBy]="vm.searchModel.orderBy"
        (onNavigateToInstruction)="onNavigateToInstruction.emit($event)"
        (onSortClicked)="onSortClicked.emit($event)"
      ></app-instructions-table>
    </div>
  `
})
export class PureInstructionsListPageShellComponent {
  @Input() vm: InstructionsStoreState
  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()
  @Output() onDepartmentChanged: EventEmitter<any> = new EventEmitter()
  @Output() onSortClicked: EventEmitter<any> = new EventEmitter()
}
