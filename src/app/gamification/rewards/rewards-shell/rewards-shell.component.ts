import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-shell',
  template: `
    <div class="">
      <app-rewards-toolbar></app-rewards-toolbar>
      <app-rewards-challenge-overview [vm]="vm.daily"></app-rewards-challenge-overview>
      <app-rewards-challenge-overview [vm]="vm.monthly"></app-rewards-challenge-overview>
      <app-rewards-challenge-overview [vm]="vm.quarterly"></app-rewards-challenge-overview>
    </div>
  `
})
export class RewardsShellComponent implements OnInit {
  // @Input() vm: any
  vm = {
    daily: {
      title: 'day',
      bookViewings: {
        target: 5,
        progress: 0
      },
      conductViewings: {
        target: 3,
        progress: 0
      },
      bookValuation: {
        target: 1,
        progress: 0
      },
      bonusAmount: 50
    },
    monthly: {
      title: 'month',
      bookViewings: {
        target: 5,
        progress: 0
      },
      conductViewings: {
        target: 3,
        progress: 0
      },
      bookValuation: {
        target: 1,
        progress: 0
      },
      bonusAmount: 150
    },
    quarterly: {
      title: 'quarter',
      bookViewings: {
        target: 5,
        progress: 0
      },
      conductViewings: {
        target: 3,
        progress: 0
      },
      bookValuation: {
        target: 1,
        progress: 0
      },
      bonusAmount: 1000
    },
  }

  constructor() {}

  ngOnInit(): void {}
}
