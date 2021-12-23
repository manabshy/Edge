// instructions.store.ts
/**
 * This is the doc comment for instructions.store.ts
 *
 * @module InstructionsStore
 * @description an NGRX component store that manages instructions
 */
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { Observable, of } from 'rxjs'
import { tap, map, mergeMap, take, distinctUntilChanged } from 'rxjs/operators'
import { InstructionRequestOption, InstructionsStoreState, InstructionsTableType } from './instructions.interfaces'
import { InstructionsService } from './instructions.service'
import { splitSalesAndLettingsStatuses } from './instructions.store.helper-functions'

const defaultState: InstructionsStoreState = {
  instructions: [],
  searchSuggestions: [],
  statusesForSelect: [],
  listersForSelect: [],
  officesForSelect: [],
  searchModel: {
    searchTerm: '',
    departmentType: InstructionsTableType.SALES_AND_LETTINGS,
    orderBy: '-instructionDate',
    page: 1,
    pageSize: 20
  },
  searchStats: {
    queryCount: true,
    pageLength: 0,
    queryResultCount: 0
  }
}

@Injectable()
export class InstructionsStore extends ComponentStore<InstructionsStoreState> {
  // Observable slices of store state
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
    this.instructions$,
    this.searchStats$,
    this.statusesForSelect$,
    this.listersForSelect$,
    this.officesForSelect$,
    this.searchModel$,
    (instructions, searchStats, statusesForSelect, listersForSelect, officesForSelect, searchModel) => ({
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
    this._instructionsSvc.getSelectControlOptions().then((selectControlOptions) => {
      this.patchState({
        listersForSelect: selectControlOptions.listersForSelect,
        officesForSelect: selectControlOptions.officesForSelect,
        statusesForSelect: selectControlOptions.statusesForSelect
      })
    })
  }


  public getInstructions = (request) => {
    this.searchModel$
      .pipe(
        mergeMap((searchModel) => {
          request.orderBy = searchModel.orderBy
          const adjustedRequest: InstructionRequestOption = splitSalesAndLettingsStatuses(request)
          console.log('adjustedRequest: ', adjustedRequest)
          return this._instructionsSvc.getInstructions(adjustedRequest)
        }),
        tap((data) => console.log('instruction data back from server ', data)),
        map((data) => {
          this.patchState({
            instructions: data,
            searchStats: {
              queryCount: true,
              pageLength: data.length,
              queryResultCount: data[0].queryResultCount
            }
          })
        }),
        take(1)
      )
      .subscribe()
  }

  readonly onDepartmentChanged = this.updater((state, department: string) => ({
    ...state,
    searchModel: {
      ...state.searchModel,
      departmentType: department
    }
  }))

  readonly onSortColumnClick = this.updater((state, columnName: string) => ({
    ...state,
    searchModel: {
      ...state.searchModel,
      orderBy: columnName === state.searchModel.orderBy ? '-' + columnName : columnName
    }
  }))
}
