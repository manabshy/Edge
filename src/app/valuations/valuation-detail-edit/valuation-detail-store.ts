// valuation-detail.store.ts
/**
 * This is the doc comment for valuation-detail.store.ts
 *
 * @module ValuationDetailStore
 * @description an NGRX component store that manages valuation data for a single valuation. Store life cycle is attached to the app-compliance-checks-shell component
 */
import { Injectable } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { mergeMap, tap, filter, switchMap, take, map } from 'rxjs/operators'
import { ValuationDetailState } from '../shared/valuation'
import { ValuationFacadeService } from '../shared/valuation-facade.service'
import { buildStoreState } from './valuation-detail-store-helpers'

const defaultState: ValuationDetailState = {
  valuationData: {}
}

@Injectable()
export class ValuationDetailStore extends ComponentStore<ValuationDetailState> {
  constructor(private _valuationFacadeSvc: ValuationFacadeService) {
    super(defaultState)
    console.log('inside ValuationDetailState store constructor')
  }

  loadStore = (): void => {
    combineLatest([this._valuationFacadeSvc.contactGroup$, this._valuationFacadeSvc.valuationData$])
      .pipe(
        filter(([contactGroupData, valuationData]) => {
          // console.log('loadStore filter: ', contactGroupData, valuationData)
          return (
            !!contactGroupData &&
            !!valuationData &&
            contactGroupData.contactGroupId === valuationData.propertyOwner.contactGroupId
          )
        }),
        take(1),
        map(([contactGroupData, valuationData]: [any, any]) => {
          valuationData.isFrozen = valuationData.complianceCheck?.compliancePassedDate ? true : false
          const storeState = {
            contactGroupData,
            valuationData
          }
          this.patchState(buildStoreState(storeState))
          console.log('✔️ valuationData loaded into store for contactGroupId', contactGroupData.contactGroupId)
        }),
        take(1)
      )
      .subscribe(
        (res) => console.log('valuation detail store loaded: ', res),
        (err) => console.error('error loading valuation detail store: ', err)
      )
  }
}
