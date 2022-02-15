import { Component, Input, Output, EventEmitter, OnInit,  OnDestroy, ChangeDetectorRef } from '@angular/core'
import { StorageMap } from '@ngx-pwa/local-storage';
import { SignalRService } from 'src/app/core/services/signal-r.service'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-rewards-toolbar',
  styles: [
    `
      button + span {
        line-height: initial;
        font-family: 'Poppins-Medium';
        font-weight: 800;
      }
      div>button:nth-child(2) {
        display: none;
      }
      div>button:nth-child(3) {
        display: none;
      }
      div.gap-2 {
        margin-right: 45px;
      }
      .bg-bronze {
        background-color:#E5A678;
      }
      button + h1  {
        line-height: 1.8em;
      }
      div.call {
       margin-right: 30px;
      }
      button.text-white {
        height: 29px;
        width: 110px;
        font-family: 'Poppins';
      }
    `
  ],
  template: `
    <div class="w-full flex flex-row p-1 mt-4">
      <div class="gap-2 md:flex-row flex flex-col">
        <button class="px-2 py-1 rounded-sm bg-ocean-green-500 text-white text-center">Challenges</button>
        <button class="px-2 py-1 rounded-sm bg-white text-blue-800 border border-solid border-gray-300 text-center">
          Leaderboard
        </button>
        <button class="px-2 py-1 rounded-sm bg-white text-blue-800 border border-solid border-gray-300 text-center">
          Milestones
        </button>
      </div>

      <div class="flex-1"></div>
      <div class="call gap-2 md:flex-row flex flex-col relative ml-14">
        <button *ngIf="phoneCall" class="rounded-full h-10 w-10 bg-ocean-green-500">
          <img src="assets/gamification-icons/calls.svg" width="24" height="24" />
        </button>
        <span class="text-3xl font-black ml-1">{{ phoneCall?.numberOfPhoneCalls }}</span>
      </div>

      <div class="gap-2 md:flex-row flex flex-col relative">
        <button class="rounded-full h-10 w-10" [ngClass]="iconBgColour">
          <img src="assets/gamification-icons/{{ icon }}.svg" width="24" height="24" />
        </button>
        <i class="fa fa-info-circle text-blue-400 text-sm top-0 absolute -right-5" [pTooltip]="'Help text required'"></i>
      </div>  
      <app-rewards-bonus-bank [isConnectionLost]="isConnectionLost" [swagBag]="swagBag"></app-rewards-bonus-bank>
    </div>
  `
})
export class RewardsToolbarComponent implements OnInit {
  @Input() icon
  @Input() swagBag: any
  @Input() streak: any
  @Input() phoneCall: any
  @Input() isConnectionLost: any
  bonus: any
  goalsHit: boolean = false

  ngUnsubscribe = new Subject<void>()

  @Output() onIconChange: EventEmitter<string> = new EventEmitter()

  iconBgColour: string

  constructor(private storage: StorageMap, private signalRService: SignalRService, private cdRef: ChangeDetectorRef,

  ) {}

  ngOnInit(): void {
    this.signalRService.getStreakStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        this.streak = data
        this.cdRef.detectChanges()
        console.info('streak from signalR:', this.streak);
        this.iconBgColour = this.setIconBackgroundColor(data)
      }
    })
    this.signalRService.getBonusesStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        this.bonus = data
        this.goalsHit = this.bonus[0].bonusDetailCriteria.every(bc => bc.progress >= bc.target)
        console.info('this.goalsHit on toolbar', this.goalsHit);

        this.cdRef.detectChanges()
      }
    })

  }

  setIconBackgroundColor(streak) {
   
    return streak.currentStreak == 0
      ? 'bg-orange-700'
      : streak.currentStreak == 1 || this.goalsHit
      ? 'bg-gray-300'
      : streak.currentStreak == 2
      ? 'bg-yellow-400'
      : 'bg-ocean-green-500'
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()
    this.signalRService.disconnect()
  }
}
