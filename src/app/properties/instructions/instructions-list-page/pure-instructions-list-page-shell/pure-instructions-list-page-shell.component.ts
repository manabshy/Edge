import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'
import { Observable } from 'rxjs'
import { InstructionsStoreState } from '../../instructions.interfaces'

@Component({
  selector: 'app-pure-instructions-list-page-shell',
  template: `
    <div class="row">
      <app-instructions-search
        [searchStats]="vm.searchStats"
        [listerOptions]="vm.listersForSelect"
        [statusOptions]="vm.statusesForSelect"
        [officeOptions]="vm.officesForSelect"
        [searchModel]="vm.searchModel"
        (onGetInstructions)="onGetInstructions.emit($event)"
        (onDepartmentChanged)="onDepartmentChanged.emit($event)"
      ></app-instructions-search>

      <app-instructions-table
        [tableType]="vm.tableType"
        [tableData]="vm.instructions"
        (navigateTo)="onNavigateToInstruction.emit($event)"
      ></app-instructions-table>
    </div>
  `
})
export class PureInstructionsListPageShellComponent implements OnChanges {
  @Input() vm: InstructionsStoreState
  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()
  @Output() onDepartmentChanged: EventEmitter<any> = new EventEmitter()

  constructor() {
    console.log('PureInstructionsListPageShellComponent constructor')
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes!: ', changes)
  }
}
