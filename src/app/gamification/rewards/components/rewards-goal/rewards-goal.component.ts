import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-goal',
  template: `
    <div class="p-2 w-full h-48 border border-gray-300">
      <p class="text-center">
        <span class="text-green-600">Collect £{{ bonusAmount }} bonus</span><br/>
        <span class="text-xs">For passing the {{timeframe}} on a high</span>
      </p>
      <img src="/assets/gamification-icons/pass-go-icn.jpg" class="w-28 mx-auto border-0" />
    </div>
  `
})
export class RewardsGoal implements OnInit {
  @Input() bonusAmount: number = 0
  @Input() timeframe: string

  constructor() {}

  ngOnInit(): void {}
  
}
