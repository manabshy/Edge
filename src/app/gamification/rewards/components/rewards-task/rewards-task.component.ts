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
      div > img {
        display: flex;
      }
      @keyframes load {
        0% {
          width: 0;
        }
        100% {
          width: 100%;
        }
      }
      .w-1 {
        width: 15%!important;
      }
      .w-2 {
        width: 25%!important;
      }
      .w-3 {
        width: 50%!important;
      }
      .w-4 {
        width: 60%!important;
      }
      .w-5 {
        width: 85%!important;
      }
      .w-6 {
        width: 100%!important;
      }
      .bg-light {
        background-color: #C9E4DA;
      }
      .bg-pink-400 {
        background-color: #FDEFF5 !important;
      }
      .bg-green-400 {
        border-radius: 10px;
        background-color: #4DA685!important;
      }
      .animation.w-full video {
        margin-top: -50px;
        margin-left: -25px;
      }
      div > .rounded-sm {
        border-radius: 10px!important;
      }
     
      .text-sm {
        line-height: 1rem !important;
        margin-left: 5px;
      }
      p.text-blue-900 {
        color: #0A1A4A !important;
        margin-top: 10px;
        font-weight: bolder;
      }
      div.monthly  {
        color: white !important;
        background-color: #0A1A4A!important;
        margin-top: -8px;
        padding-top: 24px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
         p.tax-center {
            margin-bottom: 15px;
        }
      }
      .monthly p.text-center {
        margin-bottom: 20px;
      }
      
      .border-purple {
        border-color: #0A1A4A!important;
      }
      .monthly-margin {
        margin-bottom: 68px !important;
      }
      
     
    `
  ],
  template: `
    <div [ngClass]="{'border-purple': timeWindow === 2}" class="flex flex-col border border-gray-300 border-solid rounded-md relative">
      <div *ngIf="targetReached" class="absolute z-30 top-0 right-0 left-0 bottom-0">
        <div *ngIf="timeWindow === 2"class="w-full text-center py-2">
          <p *ngIf="nameStringArray.length === 2" class="text-blue-900 text-center" >
            {{ nameStringArray[0] }}
            <span class="text-green-600">{{ target }}</span>
            {{ nameStringArray[1] }}
          </p>
        </div>
 
        <div class="w-full"  *ngIf="timeWindow !== 2">
        <img
        src="{{ '/assets/gamification-icons/go-final-daily.gif' }}"
        />    
        </div>
      </div>
      <div class="h-48 flex">
        <div class="flex flex-col justify-between flex-1 mt-2">
            <div class='daily' *ngIf="timeWindow !== 2">
              <p *ngIf="nameStringArray.length === 2" class="text-blue-900 text-center">
                {{ nameStringArray[0] }}
                <span class="text-green-600">{{ target }}</span>
                {{ nameStringArray[1] }}
              </p>
            </div>
            <div class='monthly' *ngIf="timeWindow === 2">
              <p *ngIf="nameStringArray.length === 2" class="text-center">
                {{ nameStringArray[0] }}
                <span class="text-green-600">{{ target }}</span>
                {{ nameStringArray[1] }}
              </p>
          </div>    
          <div class="my-2" *ngIf="timeWindow !== 2">
            <img
              src="{{ '/assets/gamification-icons/' + (action | lowercase) + '-icn.svg' }}"
              class="w-28 h-20 mx-auto border-0 my-4"
            />
          </div>
          <div  *ngIf="timeWindow == 1" [ngClass]="topClass" class="flex flex-row mx-2 relative h-4 mb-2 rounded-sm">
            <p class="text-sm z-10 w-full">{{ progress }}</p>
            <div [ngClass]="progressWidthClass" class="absolute top-0 left-0 right-0 h-4">
              <div class="absolute left-0 -top-4 bg-green-400 h-4 progress-value" ></div>
            </div>
          </div>
          <div  *ngIf="timeWindow == 2" [ngClass]="topClass" class="monthly-margin flex flex-row mx-2 relative h-4 mb-2 rounded-sm">
            <p class="text-sm z-10 w-full">{{ progress }}</p>
            <div [ngClass]="progressWidthClass" class="absolute top-0 left-0 right-0 h-4">
              <div class="absolute left-0 -top-4 bg-green-400 h-4 progress-value" ></div>
            </div>
        </div>
        </div>
      </div>
    </div>
  `
})
export class RewardsTaskComponent implements OnInit, OnChanges {
  @Input() progress: number = 6
  @Input() target: number = 6
  @Input() action!: string
  @Input() name: string
  @Input() animationDelay: number = 0
  @Input() timeWindow: number
  
  topClass: string;
  targetReached: boolean = false
  progressWidthClass!: string
  bgColor!: string
  animationClass: string
  nameStringArray: any
  constructor() {
  }

  ngOnInit(): void {
    this.calculateProgress()
    this.nameStringArray = this.buildNameString()
    console.log('tw', this.timeWindow)
  }

  buildNameString() {
    return this.name.split('{target}')
  }
  
  calculateProgress() {
    
    this.topClass = this.progress === 0 ? 'bg-pink-400' : 'bg-light';
     
    const p = Math.round((6 * this.progress) / this.target) 

    this.progressWidthClass = p == 0 ? 'w-0' : 'w-' + p
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
