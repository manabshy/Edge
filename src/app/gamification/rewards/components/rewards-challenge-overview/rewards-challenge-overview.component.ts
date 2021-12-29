import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-challenge-overview',
  template: `
    <div class="p-3">
      <p class="text-xl mb-2">Daily</p>
      <div class="flex flex-row items-center justify-between">
        <app-rewards-timer></app-rewards-timer>

        <app-rewards-target
          class="w-1/6"
          [progress]="vm.bookViewings.progress"
          [target]="vm.bookViewings.target"
          [action]="'bookViewings'"
        ></app-rewards-target>

        <i class="fa fa-plus"></i>

        <app-rewards-target
          class="w-1/6"
          [progress]="vm.conductViewings.progress"
          [target]="vm.conductViewings.target"
          [action]="'conductViewings'"
        ></app-rewards-target>

        <i class="fa fa-plus"></i>

        <app-rewards-target
          class="w-1/6"
          [progress]="vm.bookValuation.progress"
          [target]="vm.bookValuation.target"
          [action]="'bookValuation'"
        ></app-rewards-target>

        <i class="fa fa-cross"></i>

        <app-rewards-daily-target class="w-1/6"></app-rewards-daily-target>
      </div>
    </div>
  `,
})
export class RewardsChallengeOverviewComponent implements OnInit {
  @Input() vm: any
  constructor() {}

  ngOnInit(): void {}
}
