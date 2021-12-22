import { Component } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { ValuationStatusEnum } from 'src/app/valuations/shared/valuation'
import { InstructionsStoreState, InstructionsTableType } from '../../instructions.interfaces'
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

  constructor(public store: InstructionsStore, private router: Router, private activatedRoute: ActivatedRoute) {
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
    console.log('onNavigateToInstruction: ', instruction)
    let path = ['detail', instruction?.valuationEventId, 'edit']
    if (
      instruction.valuationStatus === ValuationStatusEnum.Cancelled ||
      instruction.valuationStatus === ValuationStatusEnum.Closed
    ) {
      path = ['detail', instruction?.valuationEventId, 'cancelled']
    } else if (instruction.valuationStatus === ValuationStatusEnum.Instructed) {
      path = ['detail', instruction?.valuationEventId, 'instructed']
    }
    this.router.navigate(path, { relativeTo: this.activatedRoute })
  }

  onSortClicked(columnName) {
    this.store.onSortColumnClick(columnName)
  }
}
