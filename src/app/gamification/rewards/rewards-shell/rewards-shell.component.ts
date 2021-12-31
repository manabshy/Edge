import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-shell',
  template: `
    <div class="">
      <app-rewards-toolbar></app-rewards-toolbar>
      <app-rewards-row [vm]="vm.daily"></app-rewards-row>
      <app-rewards-row [vm]="vm.weekly"></app-rewards-row>
      <app-rewards-row [vm]="vm.monthly"></app-rewards-row>
    </div>
  `
})
export class RewardsShellComponent {
  @Input() vm: any

  constructor() {}
}
