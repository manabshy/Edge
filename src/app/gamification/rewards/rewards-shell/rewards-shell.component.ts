import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-shell',
  template: `
    <div class="">
      <app-rewards-toolbar></app-rewards-toolbar>
      <app-rewards-challenge-overview
        [vm]="vm"
      ></app-rewards-challenge-overview>
    </div>
  `,
})
export class RewardsShellComponent implements OnInit {
  @Input() vm: any
  constructor() {}

  ngOnInit(): void {}
}
