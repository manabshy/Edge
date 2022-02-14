import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-goal',
  styles: [
    `
  
      div > img {
        display: flex;
      }
     
    `
  ],
  template: `
    <div [ngClass]="{ 'opacity-50': !animate }" class="p-2 w-full h-48 border border-solid border-gray-300 rounded-md">
      <p class="text-center">
        <span class="text-green-600">Collect £{{ streak?.streakAmount }} bonus</span>
        <br />
        <span class="text-xs">For passing the {{ timeframe }} on a high</span>
      </p>

      <img
        src="/assets/gamification-icons/GO.svg"
        class="animate__animated animate__delay-1s w-28 mx-auto border-0 filter"
        [ngClass]="{ animate__heartBeat: animate }"
      />
    </div>
  `
})
export class RewardsGoal {
  @Input() streak: any
  @Input() timeframe: string
  @Input() animate: boolean
}
