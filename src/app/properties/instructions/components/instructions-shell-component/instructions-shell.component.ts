import { Component } from '@angular/core'

@Component({
  selector: 'app-instructions-shell',
  template: `
    <app-pure-instructions-shell></app-pure-instructions-shell>
  `
})
export class InstructionsShellComponent {
  constructor() {
    console.log('InstructionShellComponent constructor')
  }
}
