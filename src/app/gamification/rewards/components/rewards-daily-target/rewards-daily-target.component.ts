import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-daily-target',
  template: `
    <div class="p-2 w-full h-48 border border-gray-300">
      <p class="text-green-600 text-center">
        Collect £{{ dailyBonusAmount }} bonus
      </p>
      <p class="text-sm text-center">For passing the day on a high</p>
      <img src="/assets/pass-go-icn.jpg" class="w-28 mx-auto" />
    </div>
  `,
  styles: [],
})
export class RewardsDailyTargetComponent implements OnInit {
  @Input() dailyBonusAmount: number = 50
  constructor() {}

  ngOnInit(): void {}
}
