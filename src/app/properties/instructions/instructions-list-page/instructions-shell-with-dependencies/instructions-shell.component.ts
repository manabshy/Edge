import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { InstructionsStoreState } from '../../instructions.interfaces'
import { InstructionsStore } from '../../instructions.store'

@Component({
  selector: 'app-instructions-list-page-shell',
  template: `
    <app-pure-instructions-list-page-shell
      [vm]="vm$ | async"
      (onGetInstructions)="store.fetchInstructions()"
      (onDepartmentChanged)="store.onDepartmentChanged($event)"
      (onNavigateToInstruction)="onNavigateToInstruction($event)"
      (onSortClicked)="onSortClicked($event)"
      (onScrollDown)="store.fetchNextPage()"
      (onSearchModelChanges)="store.updateSearchModel($event)"
    ></app-pure-instructions-list-page-shell>
  `,
  providers: [InstructionsStore]
})
export class InstructionsShellComponent {
  vm$: Observable<InstructionsStoreState>

  constructor(
    public store: InstructionsStore, 
    ) {
    this.vm$ = this.store.instructionsVm$
    this.loadDefaultPageData()
  }

  loadDefaultPageData() {
    this.store.fetchInstructions()
  }

  onNavigateToInstruction(instruction) {
    console.log('TODO onNavigateToInstruction: ', instruction) // where should the user navigate to?
  }

  onSortClicked(columnName) {
    this.store.onSortColumnClick(columnName)
  }

}
