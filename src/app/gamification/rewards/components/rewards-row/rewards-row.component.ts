import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'

@Component({
  selector: 'app-rewards-row',
  template: `
    <div class="p-3">
      <p class="text-xl mb-2">{{ bonus.name }}</p>
      <div class="flex flex-wrap mx-auto gap-5">
        <app-rewards-timer class="w-full md:w-1/6 mb-1" [timeframe]="timeframe"></app-rewards-timer>

        <ng-container *ngFor="let bc of bonus.bonusDetailCriteria; let i = index">
        <app-rewards-task
          class="w-full md:w-1/6"
          [progress]="bc.progress"
          [target]="bc.target"
          [action]="bc.actionId"
          [name]="bc.name"
          [animationDelay]="0"
        >
        <i *ngIf="i < bonus.bonusDetailCriteria.length" class="fa fa-plus invisible md:visible"></i>
        </app-rewards-task>
        </ng-container>
        
        <div class="flex-1"></div>
       
        <app-rewards-goal
          class="w-full md:w-1/6"
          [streak]="streak"
          [timeframe]="bonus.title"
          [animate]="goalsHit"
        ></app-rewards-goal>

      </div>
    </div>
  `
})
export class RewardsRowComponent implements OnInit, OnChanges {
  @Input() bonus: any
  @Input() streak: any

  timeframe: string
  goalsHit: boolean = false

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    this.goalsHit = changes.bonus.currentValue.bonusDetailCriteria.every(bc => bc.progress >= bc.target)
  }

  ngOnInit(): void {
    switch (this.bonus.timeWindow) {
      case 1:
        this.timeframe = 'left of the day'
        break

      case 30:
        this.timeframe = 'to archive greatness'
        break

      case 60: //todo
        this.timeframe = 'to secure your ticket on the slopes'
        break
    }

    this.goalsHit = this.bonus.bonusDetailCriteria.every(bc => bc.progress >= bc.target)
  }
}
