import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-pure-instructions-list-page-shell',
  template: `
    <div class="row">
      <app-instructions-search></app-instructions-search>
      <app-instructions-table
        [tableType]="vm.tableType"
        [tableData]="vm.instructions"
        (navigateTo)="onNavigateToInstruction.emit($event)"
      ></app-instructions-table>
    </div>
  `
})
export class PureInstructionsListPageShellComponent implements OnInit {
  @Input() vm: any
  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  
  constructor() {
    console.log('PureInstructionsListPageShellComponent constructor')
  }

  ngOnInit() {}

  getInstructions() {
    console.log('getInstructions...')
  }
}
