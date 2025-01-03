import { Component, Input } from '@angular/core'
import { SignalRService } from 'src/app/core/services/signal-r.service'
import { of } from 'rxjs'

@Component({
  selector: 'app-shared-rewards',
  template: `
    <ng-container *ngIf="data as d">
      <div class="flex flex-row w-40 items-center">
      <!-- TODO add money bag icon here when available -->
        <span class="text-sm w-12  font-bold leading-4">Your total</span>
        <div class="text-2xl flex flex-row items-center">
          <div><i class="fa fa-pound-sign text-green-500"></i></div>
          <div class="text-3xl font-black ml-1">
            {{ d.rewardAmount }}
          </div>
        </div>
      </div>
    </ng-container>
  `
})
export class SharedRewardsComponent {
  @Input() data: any

  // comment this out if using storybook 
  constructor() {  }
}
