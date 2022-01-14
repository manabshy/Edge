import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'

@Component({
  selector: 'app-rewards-toolbar',
  template: `
    <div class="w-full flex flex-row p-1">
      <div class="gap-2 md:flex-row flex flex-col">
        <button class="px-2 py-1 rounded-sm bg-green-500 text-white text-center">Challenges</button>
        <button class="px-2 py-1 rounded-sm bg-white text-blue-800 border border-solid border-gray-200 text-center">
          Leaderboard
        </button>
        <button class="px-2 py-1 rounded-sm bg-white text-blue-800 border border-solid border-gray-200 text-center">
          Milestones
        </button>
      </div>

      <div class="flex-1"></div>

      <div class="gap-2 md:flex-row flex flex-col relative">
        <button *ngIf="bronzeComplete" class="rounded-full h-10 w-10" [ngClass]="bronzeComplete ? 'bg-green-500' : ''">
          <i class="fa text-lg text-yellow-700" [ngClass]="icon"></i>
        </button>
        <button *ngIf="silverComplete" class="rounded-full h-10 w-10" [ngClass]="silverComplete ? 'bg-green-500' : ''">
          <i class="fa text-lg text-gray-500" [ngClass]="icon"></i>
        </button>
        <button *ngIf="goldComplete" class="rounded-full h-10 w-10" [ngClass]="goldComplete ? 'bg-green-500' : ''">
          <i class="fa text-lg text-yellow-300" [ngClass]="icon"></i>
        </button>
        <i class="fa fa-info-circle text-blue-400 text-sm -top-5 absolute right-0"></i>
      </div>

      <div class="flex-1"></div>

      <app-rewards-bonus-bank [isConnectionLost]="isConnectionLost" [swagBag]="swagBag"></app-rewards-bonus-bank>
    </div>
  `
})
export class RewardsToolbarComponent implements OnInit {
  @Input() icon: string = 'fa-trophy'
  
  @Input() swagBag: any
  @Input() streak: any
  @Input() isConnectionLost: any
  
  @Output() onIconChange: EventEmitter<string> = new EventEmitter()

  constructor() { }

  bronzeComplete = false
  silverComplete = false
  goldComplete = false

  ngOnInit(): void {
    this.setStreakColours()
  }

  setStreakColours() {
      this.bronzeComplete = this.streak.currentStreak == 0
      this.silverComplete = this.streak.currentStreak == 1
      this.goldComplete = this.streak.currentStreak == 2
  }
}
