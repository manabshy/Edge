import { Component, Input, Output, EventEmitter } from '@angular/core'
// [searchSuggestions]="searchSuggestions$"

@Component({
  selector: 'app-pure-instructions-list-page-shell',
  template: `
    <div class="row">
      <app-instructions-search
        [searchStats]="vm.searchStats"
        [valuerOptions]="valuerOptions"
        [statusOptions]="statusOptions"
        [officeOptions]="officeOptions"
        (onGetInstructions)="onGetInstructions.emit($event)"
      ></app-instructions-search>
      <app-instructions-table
        [tableType]="vm.tableType"
        [tableData]="vm.instructions"
        (navigateTo)="onNavigateToInstruction.emit($event)"
      ></app-instructions-table>
    </div>
  `
})
export class PureInstructionsListPageShellComponent {
  @Input() vm: any
  @Input() valuerOptions: any[]
  @Input() statusOptions: any[]
  @Input() officeOptions: any[]
  // @Input() searchSuggestions$: Observable<any>

  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()

  constructor() {
    console.log('PureInstructionsListPageShellComponent constructor')
  }
}
