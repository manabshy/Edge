import { Component, Input } from '@angular/core'
// import { SignalRService } from '../../../../../core/services/signal-r.service'
import { of } from 'rxjs'

@Component({
  selector: 'app-rewards-bonus-bank',
  template: `
    <ng-container *ngIf="swagBag$ | async as d">
      <div class="flex flex-row w-40 items-center">
      <span [ngClass]="(connectionStatus$ | async) === true ? 'bg-red-400' : 'bg-green-400'" class="h-2 w-2  rounded-full mr-5"></span>
        <span class="text-sm w-12  font-bold leading-4">Your total</span>
        <div class="text-2xl flex flex-row items-center">
          <div><i class="fa fa-pound-sign text-green-500"></i></div>
          <div class="text-3xl font-black ml-1">
            {{ d.swagBag }}
          </div>
        </div>
      </div>
    </ng-container>
  `
})
export class RewardsBonusBankComponent {
  @Input() swagBag$: any
  @Input() connectionStatus$: any
  

  // comment this out if using storybook 
  constructor() {
    // this.swagBag$ =  of({ rewardAmount: 911 })
    // this.swagBag$ = this.signalRService.messageStream$
  }
}
