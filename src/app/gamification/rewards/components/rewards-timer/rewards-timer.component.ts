import { Component, OnInit, Input } from '@angular/core'
import moment from 'moment'

@Component({
  selector: 'app-rewards-timer',
  template: `
    <div class="h-48 text-center flex flex-col justify-around bg-blue-100 rounded-md p-4">
      <div class="flex md:flex-col items-center mx-auto">
        <h1 class="text-6xl font-black text-blue-800">{{ hours }}</h1>
        <h3 class="text-3xl">{{ minutes }}</h3>
      </div>
      <p class="text-md">{{ timeframe }}</p>
    </div>
  `
})
export class RewardsTimerComponent implements OnInit {
  @Input() timeframe: string
  hours?: number = 0
  minutes?: number = 0
  moment = moment

  constructor() {
    this.wireUpTimer()
  }

  ngOnInit(): void {}

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
