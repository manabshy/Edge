import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-row',
  template: `
    <div class="p-3">
      <p class="text-xl mb-2">{{ titleString }}</p>
      <div class="flex items-center justify-between flex-wrap mx-auto gap-1">
        <app-rewards-timer class="w-full md:w-1/6 mb-1" [timeframe]="vm.title"></app-rewards-timer>

        <app-rewards-task
          class="w-full md:w-1/6"
          [progress]="vm.bookViewings.progress"
          [target]="vm.bookViewings.target"
          [action]="'bookViewings'"
          [animationDelay]="0"
        ></app-rewards-task>

        <i class="fa fa-plus invisible md:visible"></i>

        <app-rewards-task
          class="w-full md:w-1/6"
          [progress]="vm.conductViewings.progress"
          [target]="vm.conductViewings.target"
          [action]="'conductViewings'"
          [animationDelay]="1"
        ></app-rewards-task>

        <i class="fa fa-plus invisible md:visible"></i>

        <app-rewards-task
          class="w-full md:w-1/6"
          [progress]="vm.bookValuation.progress"
          [target]="vm.bookValuation.target"
          [action]="'bookValuation'"
          [animationDelay]="2"
        ></app-rewards-task>

        <i class="fa fa-equals invisible md:visible"></i>

        <app-rewards-goal
          class="w-full md:w-1/6"
          [bonusAmount]="vm.bonusAmount"
          [timeframe]="vm.title"
          [animate]="goalsHit"
        ></app-rewards-goal>
      </div>
    </div>
  `
})
export class RewardsRowComponent implements OnInit {
  @Input() vm: any
  titleString: string
  goalsHit: boolean = false

  constructor() {}

  ngOnInit(): void {
    switch (this.vm.title) {
      case 'day':
        this.titleString = 'Daily'
        break

      case 'week':
        this.titleString = 'Weekly'
        break

      case 'month':
        this.titleString = 'Monthly'
        break
    }

    this.goalsHit =
      this.vm.bookViewings.progress >= this.vm.bookViewings.target &&
      this.vm.conductViewings.progress >= this.vm.conductViewings.target &&
      this.vm.bookValuation.progress >= this.vm.bookValuation.target
  }
}
