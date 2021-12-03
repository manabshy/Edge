import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-pure-instructions-shell',
  template: `
    <div class="row">
     <app-instructions-search></app-instructions-search>
     <app-instructions-table></app-instructions-table>
    </div>
  `
})
export class PureInstructionsShellComponent implements OnInit {

  constructor() {
    console.log('PureInstructionsShellComponent constructor')
  }

  ngOnInit() {
  }

  getInstructions() {
    console.log('getInstructions...')
  }

}
