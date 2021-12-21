import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import {  InstructionsStoreState, InstructionsTableType } from '../../instructions.interfaces'
import { InstructionsStore } from '../../instructions.store'

@Component({
  selector: 'app-instructions-list-page-shell',
  template: `
    <app-pure-instructions-list-page-shell
      [vm]="vm$ | async"
      (onGetInstructions)="store.getInstructions($event)"
      (onDepartmentChanged)="store.onDepartmentChanged($event)"
      (onNavigateToInstruction)="onNavigateToInstruction($event)"
      (onSortClicked)="onSortClicked($event)"
    ></app-pure-instructions-list-page-shell>
  `,
  providers: [InstructionsStore]
})
export class InstructionsShellComponent {
  vm$: Observable<InstructionsStoreState>

  constructor(public store: InstructionsStore) {
    this.vm$ = this.store.instructionsVm$

    this.loadDefaultPageData()
  }

  loadDefaultPageData() {
    // set default search criteria for user and load into UI
    const initialSearchCriteria = {
      searchTerm: '',
      departmentType: InstructionsTableType.SALES_AND_LETTINGS,
      status: ['let']
    }
    this.store.getInstructions(initialSearchCriteria)
  }

  onNavigateToInstruction(instruction) {
    console.log('onNavigateToInstruction TODO: ', instruction)
  }

  onSortClicked(columnName) {
    console.log('onSortClicked TODO: ', columnName)
    this.store.onSortColumnClick(columnName)
  }
}
