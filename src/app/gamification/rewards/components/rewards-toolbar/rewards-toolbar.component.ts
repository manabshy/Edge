import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-toolbar',
  template: `
    <div class="w-full flex flex-row p-1">
      <div class="gap-2 md:flex-row flex flex-col">
        <button class="px-2 py-1 rounded-sm bg-green-500 text-white text-center">Challenges</button>
        <button class="px-2 py-1 rounded-sm bg-white text-blue-800 border border-gray-200 text-center">
          Leaderboard
        </button>
        <button class="px-2 py-1 rounded-sm bg-white text-blue-800 border border-gray-200 text-center">
          Milestones
        </button>
      </div>

      <div class="flex-1"></div>

      <div class="gap-2 md:flex-row flex flex-col relative">
        <button class="rounded-full h-10 w-10" [ngClass]="bronzeComplete ? 'bg-green-500' : ''">
          <i class="fa text-lg text-yellow-700" [ngClass]="icon"></i>
        </button>
        <button class="rounded-full h-10 w-10" [ngClass]="silverComplete ? 'bg-green-500' : ''">
          <i class="fa text-lg text-gray-500" [ngClass]="icon"></i>
        </button>
        <button class="rounded-full h-10 w-10" [ngClass]="goldComplete ? 'bg-green-500' : ''">
          <i class="fa text-lg text-yellow-300" [ngClass]="icon"></i>
        </button>
        <i class="fa fa-info-circle text-blue-400 text-sm -top-5 absolute right-0"></i>
      </div>

      <div class="flex-1"></div>

      <app-rewards-bonus-bank></app-rewards-bonus-bank>
    </div>
  `
})
export class RewardsToolbarComponent implements OnInit {
  @Input() icon: string = 'fa-trophy'
  @Output() onIconChange: EventEmitter<string> = new EventEmitter()

  constructor() {}
  
  bronzeComplete = false
  silverComplete = false
  goldComplete = false
  
  ngOnInit(): void {
    this.setStreakColours()
  }

  setStreakColours(){
    // TODO figure out what streak the user is on
    this.bronzeComplete = true
    this.silverComplete = false
    this.goldComplete = false
  }

}
