// instructions.store.ts
/**
 * This is the doc comment for instructions.store.ts
 *
 * @module InstructionsStore
 * @description an NGRX component store that manages instructions
 */
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { Observable } from 'rxjs'
import { tap, map } from 'rxjs/operators'
import { InstructionsStoreState, InstructionsTableType } from './instructions.interfaces'
import { InstructionsService } from './instructions.service'
import { splitSalesAndLettingsStatuses } from './instructions.store.helper-functions'

const defaultState: InstructionsStoreState = {
  tableType: InstructionsTableType.SALES_AND_LETTINGS,
  instructions: [],
  searchSuggestions: [],
  statusesForSelect: [],
  listersForSelect: [],
  officesForSelect: [],
  searchModel: {},
  searchStats: {
    queryCount: true,
    pageLength: 21,
    queryResultCount: 99
  }
}

@Injectable()
export class InstructionsStore extends ComponentStore<InstructionsStoreState> {
  // Observable slices of store state
  readonly tableType$: Observable<any> = this.select(({ tableType }) => tableType)
  readonly instructions$: Observable<any> = this.select(({ instructions }) => instructions)
  readonly searchSuggestions$: Observable<any> = this.select(({ searchSuggestions }) => searchSuggestions)
  readonly searchStats$: Observable<any> = this.select(({ searchStats }) => searchStats)
  readonly searchModel$: Observable<any> = this.select(({ searchModel }) => searchModel)

  // select controls
  readonly statusesForSelect$: Observable<any> = this.select(({ statusesForSelect }) => statusesForSelect)
  readonly listersForSelect$: Observable<any> = this.select(({ listersForSelect }) => listersForSelect)
  readonly officesForSelect$: Observable<any> = this.select(({ officesForSelect }) => officesForSelect)

  /***
   * @function complianceChecksVm$
   * @description data streams to serve the view model for compliance checks components
   */
  public instructionsVm$: Observable<any> = this.select(
    this.tableType$,
    this.instructions$,
    this.searchStats$,
    this.statusesForSelect$,
    this.listersForSelect$,
    this.officesForSelect$,
    this.searchModel$,
    (tableType, instructions, searchStats, statusesForSelect, listersForSelect, officesForSelect, searchModel) => ({
      tableType,
      instructions,
      searchStats,
      statusesForSelect,
      listersForSelect,
      officesForSelect,
      searchModel
    })
  )

  constructor(private _instructionsSvc: InstructionsService) {
    super(defaultState)
    this.populateSelectOptions()
  }

  populateSelectOptions() {
    console.log('populateSelectOptions running')
    this._instructionsSvc.getSelectControlOptions().then((selectControlOptions) => {
      console.log('this._instructionsSvc.selectControlOptions: ', selectControlOptions)

      this.patchState({
        listersForSelect: selectControlOptions.listersForSelect,
        officesForSelect: selectControlOptions.officesForSelect,
        statusesForSelect: selectControlOptions.statusesForSelect
      })
    })
  }

  public getInstructions = (request) => {
    console.log('getInstructions running: ', request)
    const adjustedRequest = splitSalesAndLettingsStatuses(request)
    this.patchState({
      searchModel: adjustedRequest
    })
    this._instructionsSvc
      .getInstructions(adjustedRequest)
      .pipe(
        tap((data) => console.log('instruction data back from server ', data)),
        map((data) => this.patchState({ instructions: data }))
      )
      .subscribe()
  }

  public onDepartmentChanged = (val) => {
    this.patchState({
      tableType: val
    })
  }
}
