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
  InstructionViewingAndMarketingStatus
} from './instructions.interfaces'
import { InstructionsService } from './instructions.service'

const defaultState: InstructionsStoreState = {
  instructions: []
}

@Injectable()
export class InstructionsStore extends ComponentStore<InstructionsStoreState> {
  // Observable slices of store state
  readonly instructions$: Observable<any> = this.select(({ instructions }) => instructions)

  /***
   * @function complianceChecksVm$
   * @description data streams to serve the view model for compliance checks components
   */
  public instructionsVm$: Observable<any> = this.select(this.instructions$, (instructions) => ({
    instructions
  }))
  constructor(private _instructionsSvc: InstructionsService) {
    super(defaultState)
  }

  public loadStore = () => {
    console.log('loading InstructionsStore')
    this.patchState({
      instructions: [
        {
          instructionEventId: 11,
          status: InstructionStatus.let,
          address: 'Flat 103, Colehome Court, Old Brompton Road, London, SW5 0ED',
          owner: 'Mrs Constance Hepworth',
          instructionDate: '01/01/2020',
          lister: 'Edward McCull',
          marketingPrice: '',
          viewingStatus: InstructionViewingAndMarketingStatus.stopped,
          marketingStatus: InstructionViewingAndMarketingStatus.stopped,
          longLetPrice: '',
          shortLetPrice: '£1,000pw'
        },
        {
          instructionEventId: 10,
          status: InstructionStatus.withdrawn,
          address: 'Flat A, 86 Nightingale Lane, London, SW12 8NR',
          owner: 'Mr Jonathan James',
          instructionDate: '31/10/2020',
          lister: 'Oliver Mason',
          marketingPrice: '',
          viewingStatus: InstructionViewingAndMarketingStatus.not_ready,
          marketingStatus: InstructionViewingAndMarketingStatus.ready,
          longLetPrice: '£475pw',
          shortLetPrice: ''
        },
        {
          instructionEventId: 9,
          status: InstructionStatus.instructed,
          address: 'Flat 11, The Regent, Gwynne Road, London, SW11 8GJ',
          owner: 'Mr John Gearing',
          instructionDate: '01/03/2021',
          lister: 'Mark Hutton',
          marketingPrice: '',
          viewingStatus: InstructionViewingAndMarketingStatus.commenced,
          marketingStatus: InstructionViewingAndMarketingStatus.ready,
          longLetPrice: '',
          shortLetPrice: '£500pw'
        },
        {
          instructionEventId: 8,
          status: InstructionStatus.under_offer,
          address: 'TFF\r\n100\r\nWarriner Gardens\r\nLondon\r\nSW11\r\n4DU\r\n',
          // address: 'Flat 1, Mercury Mansions, Dryburgh Road, London, SW15 1BT',
          owner: 'Mr Matthew Thompson (Beazer Bungalows)',
          instructionDate: '15/12/2019',
          lister: 'Kitty Cavendish',
          marketingPrice: '',
          viewingStatus: InstructionViewingAndMarketingStatus.not_ready,
          marketingStatus: InstructionViewingAndMarketingStatus.not_ready,
          longLetPrice: '',
          shortLetPrice: '£450pw'
        },
        {
          instructionEventId: 7,
          status: InstructionStatus.end,
          address: 'Flat 13, The Regent, Gwynne Road, London, SW11 8GJ',
          owner: 'Dr Cobalt Jackson',
          instructionDate: '01/03/2021',
          lister: 'Mark Hutton',
          marketingPrice: '',
          viewingStatus: InstructionViewingAndMarketingStatus.ready,
          marketingStatus: InstructionViewingAndMarketingStatus.commenced,
          longLetPrice: '£350pw',
          shortLetPrice: ''
        },
        {
          instructionEventId: 6,
          status: InstructionStatus.exchanged,
          address: '2468, Whodoweappreciate Road, Behind Field, London, SE3 9OI',
          owner: 'Mr Barry Keys',
          instructionDate: '15/12/2019',
          lister: 'Mark Rubber',
          marketingPrice: '',
          viewingStatus: InstructionViewingAndMarketingStatus.not_ready,
          marketingStatus: InstructionViewingAndMarketingStatus.stopped,
          longLetPrice: '£450px',
          shortLetPrice: ''
        },
        {
          instructionEventId: 5,
          status: InstructionStatus.tom,
          address: 'Flat 2b, Allsaints Avenue, Ferry Long Road, London, SW3 4ER',
          owner: 'Mrs Sandy Jackson',
          instructionDate: '03/05/2021',
          lister: 'Mary Jones',
          marketingPrice: '',
          viewingStatus: InstructionViewingAndMarketingStatus.stopped,
          marketingStatus: InstructionViewingAndMarketingStatus.not_ready,
          longLetPrice: '£1,000pw',
          shortLetPrice: ''
        }
      ]
    })
  }
}
