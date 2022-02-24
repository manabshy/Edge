import { Component, OnInit, Input, OnChanges } from '@angular/core'
import moment from 'moment'

@Component({
  selector: 'app-rewards-timer',
  styles: [
    `
    .bg-blue-clock {
      background-color: #BFEBFA;
    }
    .text-blue-800 {
      color: #0A1A4A!important
    }
    * + h3, * + .legend {
      margin-top: 0px;
         font-family: 'Poppins-Medium';
      }
    h1 {
      font-family: 'Poppins-Medium';
    }
    `
  ],
  template: `
    <div *ngIf='timewindow == 1' class="h-48 text-center flex flex-col justify-around bg-blue-clock rounded-md p-4">
      <div class="flex md:flex-col items-center mx-auto">
        <h1 class="text-6xl font-black text-blue-800">{{ hours }}</h1>
        <h3 class="text-3xl">{{ minutes }}</h3>
      </div>
      <p class="text-md">{{ timeframe }}</p>
    </div>
    <div *ngIf='timewindow == 2' class="h-48 text-center flex flex-col justify-around bg-blue-clock rounded-md p-4">
    <div class="flex md:flex-col items-center mx-auto">
      <h1 class="text-6xl font-black text-blue-800">{{ countdown?.daysLeftInMonth }}</h1>
      <h3 class="text-3xl">Days</h3>
    </div>
    <p class="text-md">{{ timeframe }}</p>
    </div>
  
  `
})
export class RewardsTimerComponent implements OnInit, OnChanges {
  @Input() timeframe: string
  @Input() countdown: any
  @Input() timewindow: number
  hours?: number = 0
  minutes?: number = 0
  moment = moment

  constructor() {
    this.wireUpTimer()
  }

  ngOnInit(): void {
    if (this.timeframe === '2') {
      console.log('this.timeframe', this.timeframe);
    }
  }
  ngOnChanges() {

    console.log(this.timewindow);
  
  }
  wireUpTimer() {
    this.setTime()

    setInterval(() => {
      this.setTime()
    }, 60000)
  }

  setTime() {
    const isDst = moment().isDST()
    const end = moment().endOf('day')
    const timeLeft = isDst ? moment(end.diff(moment())) : moment(end.diff(moment())).subtract(1, 'hour') // might need to check this when in daylight savings! ¯\_(ツ)_/¯
    this.hours = timeLeft.hours()
    this.minutes = timeLeft.minutes()
  }
}
