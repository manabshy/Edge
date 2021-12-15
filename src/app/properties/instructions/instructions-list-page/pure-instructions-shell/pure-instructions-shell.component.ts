import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-pure-instructions-shell',
  template: `
    <div class="row">
      <app-instructions-search></app-instructions-search>
      <app-instructions-table
        [tableType]="vm.tableType"
        [tableData]="vm.tableData"
        (navigateTo)="onNavigateToInstruction.emit($event)"
      ></app-instructions-table>
    </div>
  `
})
export class PureInstructionsShellComponent implements OnInit {
  @Input() vm: any
  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  constructor() {
    console.log('PureInstructionsShellComponent constructor')
  }

  ngOnInit() {}

  getInstructions() {
    console.log('getInstructions...')
  }
}
