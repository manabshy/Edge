import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core'

@Component({
  selector: 'app-rewards-task',
  styles: [`
  body {
  justify-content: center;
  align-items: center;
  background: #000;
  display: flex;
  height: 100vh;
  padding: 0;
  margin: 0;
}

.progress {
  background: rgba(255,255,255,0.1);
  justify-content: flex-start;
  border-radius: 100px;
  align-items: center;
  position: relative;
  padding: 0 5px;
  display: flex;
  height: 40px;
}

.progress-value {
  animation: load 3s normal forwards;
  box-shadow: 0 10px 40px -10px #fff;
  border-radius: 100px;
  background: #000;
  height: 30px;
}

@keyframes load {
  0% { width: 0; }
  100% { width: 100%; }
}
`],
  template: `
    <div class="p-0 flex flex-col border border-gray-300 rounded-md h-48" >
      <div *ngIf="targetReached; else default">
      <div class="h-4 bg-white w-full">test</div>
      <div [ngClass]="bgColor">
      <p class="font-bold px-2 text-center text-sm mb-2">SMASHED IT - and you rolled a 5</p>
        <img
          class="w-32 mx-auto border-0 animate__animated"
          [ngClass]="animationClass"
          src="/assets/gamification-icons/dice.jpg"
        />
      </div>
      </div>
      <ng-template #default>
        <div class="flex flex-col justify-between flex-1">
        <p *ngIf="nameStringArray.length === 2" class="text-blue-900 text-center">
                {{ nameStringArray[0] }}
                <span class="text-green-600">{{ target }}</span>
                {{ nameStringArray[1] }}
              </p>
              <div class="my-2">
                <img src="{{'/assets/gamification-icons/' + (action | lowercase)  + '-icn.jpg'}}" class="w-28 h-20 mx-auto border-0" />
              </div>
          <div class="w-full relative bg-green-200 h-5 rounded-full">
          <p class="text-center text-sm z-10 relative">{{ progress }}</p>
            <div class="absolute top-0 left-0 right-0 h-5 progress">
              <!-- <div class="absolute left-0 -top-4 bg-green-500 h-5 progress-value" [ngStyle]="{'width': progress + '%'}"></div> -->
              <div class="absolute left-0 -top-4 bg-green-500 h-5 progress-value"  [ngClass]="progressWidthClass"></div>
            </div>
          </div>
        </div>
      </ng-template>
    </div>
  `
})
export class RewardsTaskComponent implements OnInit, OnChanges {
  @Input() progress: number = 0
  @Input() target: number = 5
  @Input() action!: string
  @Input() name: string
  @Input() animationDelay: number

  targetReached: boolean = false
  progressWidthClass!: string
  bgColor!: string
  animationClass: string
  nameStringArray: any

  constructor() { }

  ngOnInit(): void {
    this.calculateProgress()
    this.nameStringArray = this.buildNameString();
  }

  buildNameString() {
    return this.name.split('{target}')
  }

  calculateProgress() {

    if (this.progress === 0) {
      this.progressWidthClass = 'w-0'
    } else {
      const c =  Math.round(this.progress * 12 / this.target)
      this.progressWidthClass = 'w-' + c + '/12'
    }

    console.log(this.progressWidthClass);

    this.targetReached = this.progress >= this.target

    this.bgColor = this.targetReached ? 'bg-green-100' : 'bg-white'

    this.animationClass = this.targetReached ? 'animate__bounce  animate__delay-' + this.animationDelay + 's' : ''
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['progress'] && !changes['progress'].firstChange) {
      this.progress = changes['progress'].currentValue
      this.calculateProgress()
    }
  }
}
