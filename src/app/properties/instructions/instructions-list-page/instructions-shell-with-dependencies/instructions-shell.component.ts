import { Component, OnChanges, SimpleChanges } from '@angular/core'
import { Observable } from 'rxjs'
import { InstructionsStoreState } from '../../instructions.interfaces'
import { InstructionsStore } from '../../instructions.store'

@Component({
  selector: 'app-instructions-list-page-shell',
  template: `
    <app-pure-instructions-list-page-shell
      [vm]="vm$ | async"
      (onGetInstructions)="store.getInstructions($event)"
      (onDepartmentChanged)="store.onDepartmentChanged($event)"
    ></app-pure-instructions-list-page-shell>
  `,
  providers: [InstructionsStore]
})
export class InstructionsShellComponent  {
  vm$: Observable<InstructionsStoreState>

  constructor(
    public store: InstructionsStore    
  ) {
    console.log('InstructionShellComponent constructor')
    // this.store.populateSelectOptions()
    this.vm$ = this.store.instructionsVm$
  }


 
}
