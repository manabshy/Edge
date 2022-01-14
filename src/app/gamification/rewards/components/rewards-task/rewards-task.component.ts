import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core'

@Component({
  selector: 'app-rewards-task',
  styles: [
    `
      .progress {
        background: rgba(255, 255, 255, 0.1);
        justify-content: flex-start;
        align-items: center;
        position: relative;
        display: flex;
      }

      .progress-value {
        animation: load 3s normal forwards;
        box-shadow: 0 10px 40px -10px #fff;
      }

      @keyframes load {
        0% {
          width: 0;
        }
        100% {
          width: 100%;
        }
      }
    `
  ],
  template: `
    <div class="flex flex-col border border-gray-300 border-solid rounded-md relative">
      <div *ngIf="targetReached" class="absolute z-30 top-0 right-0 left-0 bottom-0">
        <div class="bg-white w-full text-center py-2">
          <p *ngIf="nameStringArray.length === 2" class="text-blue-900 text-center">
            {{ nameStringArray[0] }}
            <span class="text-green-600">{{ target }}</span>
            {{ nameStringArray[1] }}
          </p>
        </div>
        <div [ngClass]="bgColor" class="opacity-95 absolute right-0 left-0 bottom-0">
          <p class="font-bold px-2 text-center text-sm py-2">
            <span class="font-black text-lg">SMASHED IT</span>
            - and you rolled a 5
          </p>
          <img
            class="w-24 mx-auto border-0 animate__animated"
            [ngClass]="animationClass"
            src="/assets/gamification-icons/dice-1.gif"
          />
        </div>
      </div>
      <div class="h-48 flex">
        <div class="flex flex-col justify-between flex-1 mt-2">
          <p *ngIf="nameStringArray.length === 2" class="text-blue-900 text-center">
            {{ nameStringArray[0] }}
            <span class="text-green-600">{{ target }}</span>
            {{ nameStringArray[1] }}
          </p>
          <div class="my-2">
            <img
              src="{{ '/assets/gamification-icons/' + (action | lowercase) + '-icn.svg' }}"
              class="w-28 h-20 mx-auto border-0 my-4"
            />
          </div>
          <div class="flex flex-row mx-2 relative bg-green-200 h-4 mb-2 rounded-sm">
            <p class="text-center text-sm z-10 w-full">{{ progress }}</p>
            <div class="absolute top-0 left-0 right-0 h-4 progress">
              <div class="absolute left-0 -top-4 bg-green-400 h-4 progress-value" [ngClass]="progressWidthClass"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RewardsTaskComponent implements OnInit, OnChanges {
  @Input() progress: number = 0
  @Input() target: number = 5
  @Input() action!: string
  @Input() name: string
  @Input() animationDelay: number = 0

  targetReached: boolean = false
  progressWidthClass!: string
  bgColor!: string
  animationClass: string
  nameStringArray: any

  constructor() {}

  ngOnInit(): void {
    this.calculateProgress()
    this.nameStringArray = this.buildNameString()
  }

  buildNameString() {
    return this.name.split('{target}')
  }

  calculateProgress() {
    if (this.progress === 0) {
      this.progressWidthClass = 'w-0'
    } else {
      const c = Math.round((this.progress * 12) / this.target)
      this.progressWidthClass = 'w-' + c + '/12'
    }

    console.log(this.progressWidthClass)

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
