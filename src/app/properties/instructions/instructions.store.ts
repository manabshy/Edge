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
    lettingsStatus: [],
    salesStatus: [],
    status: ['notSet'],
    dateFrom: '',
    listerId: [],
    officeId: [],
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

  public readonly onDepartmentChanged = this.updater((state, department: string) => ({
    ...state,
    searchModel: {
      ...state.searchModel,
      departmentType: department
    }
  }))

  public readonly onSortColumnClick = this.updater((state, columnName: string) => ({
    ...state,
    searchModel: {
      ...state.searchModel,
      orderBy: columnName === state.searchModel.orderBy ? '-' + columnName : columnName
    }
  }))

  /***
   * fetchInstructions
   * @description calls API with current searchModel and sets results into the store
   */
  public fetchInstructions = () => {
    this.searchModel$
      .pipe(
        take(1),
        mergeMap((searchModel) => {
          searchModel.page = 1
          console.log('fetchInstructions, searchModel: ', searchModel)
          return this._instructionsSvc.getInstructions(searchModel)
        }),
        tap((data) => console.log('instruction data back from server ', data)),
        map(
          this.updater((state, data: any) => ({
            ...state,
            instructions: data,
            searchModel: {
              ...state.searchModel,
              page: 2
            },
            searchStats: {
              ...state.searchStats,
              queryCount: !!data.length,
              pageLength: data.length,
              queryResultCount: data.length ? data[0].queryResultCount : 0
            }
          }))
        ),
        take(1)
      )
      .subscribe()
  }

  /***
   * @description calls api with current searchModel for next page, merges results into store
   */
  public fetchNextPage = () => {
    this.searchModel$
    .pipe(
      take(1),
      mergeMap((searchModel) => {
        console.log('fetchNextPage, searchModel: ', searchModel)
        return this._instructionsSvc.getInstructions(searchModel)
      }),
      map(
        this.updater((state, data: any[]) => ({
          ...state,
          instructions: [...state.instructions, ...data],
          searchModel: {
            ...state.searchModel,
            page: (state.searchModel.page += 1)
          },
          searchStats: {
            ...state.searchStats,
            pageLength: state.instructions.length + data.length
          }
        }))
        ),
        take(1),
      )
      .subscribe()
  }

  public updateSearchModel = this.updater((state, searchModel: any) => ({
    ...state,
    searchModel: {
      ...state.searchModel,
      ...splitSalesAndLettingsStatuses(searchModel)
    }
  }))
}
