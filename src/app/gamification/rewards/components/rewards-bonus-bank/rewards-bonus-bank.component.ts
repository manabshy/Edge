import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-rewards-bonus-bank',
  template: `
    <ng-container *ngIf="swagBag as d">
      <div class="flex flex-row w-40 items-center">
      <span [ngClass]="isConnectionLost === true ? 'bg-red-400' : 'bg-ocean-green-400'" class="h-2 w-2  rounded-full mr-5"></span>
      <button  class="rounded-full h-10 w-10 bg-ocean-green-500">
        <img src="assets/gamification-icons/bonus-bank.svg" width="24" height="24" />
      </button>
        <div class="text-2xl flex flex-row items-center ml-2">
          <div><i class="fa fa-pound-sign text-ocean-green-500"></i></div>
          <div class="text-3xl font-black ml-1">
            {{ d.swagBag }}
          </div>
        </div>
      </div>
    </ng-container>
  `
})
export class RewardsBonusBankComponent {
  @Input() swagBag: any
  @Input() isConnectionLost: any
  
}
