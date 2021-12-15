import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { InstructionsStore } from '../../instructions.store'

@Component({
  selector: 'app-instructions-shell',
  template: `
    <app-pure-instructions-shell [vm]="vm$ | async"></app-pure-instructions-shell>
  `,
  providers: [InstructionsStore]
})
export class InstructionsShellComponent {
  vm$: Observable<any>
  constructor(private _store: InstructionsStore) {
    console.log('InstructionShellComponent constructor')
    this._store.loadStore()
    this.vm$ = this._store.instructionsVm$
  }
}
