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
        (onSearchModelChanges)="onSearchModelChanges.emit($event)"
      ></app-instructions-search>

      <app-instructions-list
        [searchModel]="vm.searchModel"
        [tableData]="vm.instructions"
        (onNavigatToInstruction)="onNavigateToInstruction.emit($event)"
        (onSortClicked)="onSortClicked.emit($event)"
        (onScrollDown)="onScrollDown.emit($event)"
      ></app-instructions-list>
    </div>
  `
})
export class PureInstructionsListPageShellComponent {
  @Input() vm: InstructionsStoreState

  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()
  @Output() onSearchModelChanges: EventEmitter<any> = new EventEmitter()
  @Output() onSortClicked: EventEmitter<any> = new EventEmitter()
  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
}
