import { Component } from '@angular/core'
// import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
// import { ValuationStatusEnum } from 'src/app/valuations/shared/valuation'
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
      (onScrollDown)="onScrollDown($event)"
    ></app-pure-instructions-list-page-shell>
  `,
  providers: [InstructionsStore]
})
export class InstructionsShellComponent {
  vm$: Observable<InstructionsStoreState>

  constructor(
    public store: InstructionsStore, 
    // private router: Router, 
    // private activatedRoute: ActivatedRoute
    ) {
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
    console.log('TODO onNavigateToInstruction: ', instruction) // where should the user navigate to?
    // let path = ['detail', instruction?.propertyEventId, 'edit']
    // if (
    //   instruction.instructionStatus === ValuationStatusEnum.Cancelled ||
    //   instruction.instructionStatusv === ValuationStatusEnum.Closed
    // ) {
    //   path = ['detail', instruction?.propertyEventId, 'cancelled']
    // } else if (instruction.instructionStatus === ValuationStatusEnum.Instructed) {
    //   path = ['detail', instruction?.propertyEventId, 'instructed']
    // }
    // this.router.navigate(path, { relativeTo: this.activatedRoute })
  }

  onSortClicked(columnName) {
    this.store.onSortColumnClick(columnName)
  }

  onScrollDown(event) {
    console.log('onScrollDown TODO: ')
  }
}
