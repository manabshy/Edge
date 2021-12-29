import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-toolbar',
  template: `
    <div class="w-full flex flex-row p-4">
      <div class="space-x-2">
        <button>Challenges</button>
        <button>Challenges</button>
        <button>Challenges</button>
      </div>

      <div class="flex-1"></div>

      <div class="space-x-2">
        <button>Shoe</button>
        <button>Shoe</button>
        <button>Shoe</button>
      </div>

      <div class="flex-1"></div>

      <div>
        <span class="text-lg mr-2">Your Total</span>
        <span class="text-4xl font-bold">£165</span>
      </div>
    </div>
  `,
})
export class RewardsToolbarComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
