import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-rewards-bonus-bank',
  styles: [ ` 
    .text-blue-800 {
      color: #0A1A4A!important
    }
    .font-black {
      font-family: 'Poppins-Medium';
      font-weight: 800;
    }
  `
  ],
  template: `
    <ng-container *ngIf="swagBag as d">
      <div class="flex flex-row w-40 items-center">
      <span [ngClass]="isConnectionLost === true ? 'bg-red-400' : 'bg-ocean-green-400'"></span>
      <button  class="rounded-full h-10 w-10 bg-ocean-green-500">
        <img src="assets/gamification-icons/bonus-bank.svg" width="24" height="24" />
      </button>
        <div class="text-2xl flex flex-row items-center ml-2">
          <div><i class="fa fa-pound-sign text-blue-800"></i></div>
          <div class="text-3xl font-black text-blue-800 ml-1">
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
