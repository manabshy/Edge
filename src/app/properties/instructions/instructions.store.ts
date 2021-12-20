// instructions.store.ts
/**
 * This is the doc comment for instructions.store.ts
 *
 * @module InstructionsStore
 * @description an NGRX component store that manages instructions
 */
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { mergeMap, tap, filter, switchMap, take, map } from 'rxjs/operators'
import {
  InstructionsStoreState,
  InstructionStatus,
  InstructionViewingAndMarketingStatus,
  InstructionsTableType
} from './instructions.interfaces'
import { InstructionsService } from './instructions.service'

const defaultState: InstructionsStoreState = {
  tableType: InstructionsTableType.LETTINGS,
  instructions: [],
  searchSuggestions: [1,2,3],
  searchStats: {
    queryCount: true,
    pageLength: 20,
    queryResultCount: 100
  }
}

@Injectable()
export class InstructionsStore extends ComponentStore<InstructionsStoreState> {
  // Observable slices of store state
  readonly tableType$: Observable<any> = this.select(({ tableType }) => tableType)
  readonly instructions$: Observable<any> = this.select(({ instructions }) => instructions)
  readonly searchSuggestions$: Observable<any> = this.select(({ searchSuggestions }) => searchSuggestions)
  readonly searchStats$: Observable<any> = this.select(({ searchStats }) => searchStats)

  /***
   * @function complianceChecksVm$
   * @description data streams to serve the view model for compliance checks components
   */
  public instructionsVm$: Observable<any> = this.select(
    this.tableType$,
    this.instructions$,
    this.searchStats$,
     (tableType, instructions, searchStats) => ({
      tableType, instructions, searchStats
  }))

  constructor(private _instructionsSvc: InstructionsService) {
    super(defaultState)
  }

  public getInstructions = (request) => {
    console.log('getInstructions running: ', request)
    
    this._instructionsSvc.getInstructions(request)
    .pipe(
      tap((data) => console.log('instruction data back from server ', data)),
      map((data) => this.patchState({instructions: data}))
    )
    .subscribe()

  }

  
}
