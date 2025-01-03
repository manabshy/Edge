import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'

@Component({
  selector: 'app-rewards-row',
  styles: [
    `
    i.fa.fa-equals {
      position: relative;
      top: 85px;
      font-size: 20px;
    }
    i.fa.fa-plus {
      position: relative;
      top: 85px;
      font-size: 20px;
    }
  
    `
  ],
  template: `
    <div class="p-3">
      <p class="text-xl mb-2">{{ bonusName }}</p>
      <div class="flex flex-wrap mx-auto gap-5">
        <app-rewards-timer [timeframe]="timeframe" [countdown]="countdown" [timewindow]="bonus.timeWindow"></app-rewards-timer>

        <ng-container *ngFor="let bc of bonus.bonusDetailCriteria; let i = index">
        <app-rewards-task
          class="w-full md:w-1/6"
          [progress]="bc.progress"
          [target]="bc.target"
          [action]="bc.actionId"
          [name]="bc.name"
          [animationDelay]="0"
          [timeWindow]="bonus.timeWindow"
        >
        </app-rewards-task>
        <i *ngIf="i < bonus.bonusDetailCriteria.length - 1" class="fa fa-plus"></i>

        </ng-container>
        
        <div>
        <i  class="fa fa-equals"></i>
        </div>
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
export class RewardsRowComponent implements OnInit {
  @Input() bonus: any
  @Input() streak: any
  @Input() countdown: any
 
  timeframe: string
  goalsHit: boolean = false
  bonusName: string
  constructor() {
   }

  ngOnInit(): void {
    switch (this.bonus.timeWindow) {
      case 1:
        this.timeframe = 'left of the day'
        this.bonusName = 'Daily'
        break

      case 2:
        this.timeframe = 'to achieve greatness'
        this.bonusName = 'Monthly'

        break

      case 60: //todo
        this.timeframe = 'to secure your ticket on the slopes'
        break
    }
  
    
    this.goalsHit = this.bonus.bonusDetailCriteria.every(bc => bc.progress >= bc.target)
    console.log('row rewards:', this.goalsHit);
    console.log('bonus:', this.bonus);
  }
}
