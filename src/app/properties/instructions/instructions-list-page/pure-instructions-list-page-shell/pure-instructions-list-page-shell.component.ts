import { Component, Input, Output, EventEmitter } from '@angular/core'
import { StaffMember } from 'src/app/shared/models/staff-member'
import { InstructionsStoreState } from '../../instructions.interfaces'

@Component({
  selector: 'app-pure-instructions-list-page-shell',
  template: `
    <div class="row">
      <div class="row__item row__item--aside mt-4">
        <app-instructions-search
          [searchStats]="vm.searchStats"
          [searchModel]="vm.searchModel"
          [listerOptions]="vm.listersForSelect"
          [statusOptions]="vm.statusesForSelect"
          [officeOptions]="vm.officesForSelect"
          [currentStaffMember]="currentStaffMember"
          (onGetInstructions)="onGetInstructions.emit($event)"
          (onSearchModelChanges)="onSearchModelChanges.emit($event)"
        ></app-instructions-search>
      </div>
      <div class="row__item">
        <app-instructions-list
          [searchModel]="vm.searchModel"
          [tableData]="vm.instructions"
          (onNavigateToInstruction)="onNavigateToInstruction.emit($event)"
          (onSortClicked)="onSortClicked.emit($event)"
          (onScrollDown)="onScrollDown.emit($event)"
        ></app-instructions-list>
      </div>
    </div>
  `
})
export class PureInstructionsListPageShellComponent {
  @Input() vm: InstructionsStoreState
  @Input() currentStaffMember: StaffMember
  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()
  @Output() onSearchModelChanges: EventEmitter<any> = new EventEmitter()
  @Output() onSortClicked: EventEmitter<any> = new EventEmitter()
  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
}
