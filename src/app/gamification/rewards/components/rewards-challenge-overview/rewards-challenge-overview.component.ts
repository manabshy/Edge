import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-challenge-overview',
  template: `
    <div class="p-3">
      <p class="text-xl mb-2">{{ titleString }}</p>
      <div class="flex items-center justify-between flex-wrap mx-auto gap-1">
        <app-rewards-timer class="w-full md:w-1/6 mb-1" [timeframe]="vm.title"></app-rewards-timer>

        <app-rewards-target
          class="w-full md:w-1/6"
          [progress]="vm.bookViewings.progress"
          [target]="vm.bookViewings.target"
          [action]="'bookViewings'"
        ></app-rewards-target>

        <i class="fa fa-plus invisible md:visible"></i>

        <app-rewards-target
          class="w-full md:w-1/6"
          [progress]="vm.conductViewings.progress"
          [target]="vm.conductViewings.target"
          [action]="'conductViewings'"
        ></app-rewards-target>

        <i class="fa fa-plus invisible md:visible"></i>

        <app-rewards-target
          class="w-full md:w-1/6"
          [progress]="vm.bookValuation.progress"
          [target]="vm.bookValuation.target"
          [action]="'bookValuation'"
        ></app-rewards-target>

        <i class="fa fa-equals invisible md:visible"></i>

        <app-rewards-goal class="w-full md:w-1/6" [bonusAmount]="vm.bonusAmount" [timeframe]="vm.title"></app-rewards-goal>
      </div>
    </div>
  `
})
export class RewardsChallengeOverviewComponent implements OnInit {
  @Input() vm: any
  titleString: string

  constructor() {}

  ngOnInit(): void {
    switch (this.vm.title) {
      case 'day':
        this.titleString = 'Daily'
        break

      case 'month':
        this.titleString = 'Monthly'
        break

      case 'quarter':
        this.titleString = 'Quarterly'
        break
    }
  }
}
