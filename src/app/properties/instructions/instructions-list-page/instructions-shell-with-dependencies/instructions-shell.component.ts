import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { InstructionsStore } from '../../instructions.store'

@Component({
  selector: 'app-instructions-list-page-shell',
  template: `
    <app-pure-instructions-list-page-shell [vm]="vm$ | async"></app-pure-instructions-list-page-shell>
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
