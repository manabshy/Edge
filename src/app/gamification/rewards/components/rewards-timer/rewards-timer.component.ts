import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'

@Component({
  selector: 'app-rewards-timer',
  template: `
    <div
      class="text-center w-38 h-48 flex flex-col justify-around bg-blue-100 rounded-md p-4"
    >
      <h1 class="text-6xl font-black text-blue-800">{{ hours }}</h1>
      <h3 class="text-3xl">{{ minutes }}</h3>
      <p class="text-md">left of the day</p>
    </div>
  `,
})
export class RewardsTimerComponent implements OnInit {
  hours?: number = 0
  minutes?: number = 0
  moment = moment

  constructor() {
    this.computeTimeTilMidnight()
  }

  ngOnInit(): void {}

  computeTimeTilMidnight() {
    const end = moment().endOf('day')
    const timeLeft = moment(end.diff(moment())) // get difference between now and timestamp
    this.setTime(timeLeft)

    setInterval(() => {
      const timeLeft = moment(end.diff(moment())) // get difference between now and timestamp
      this.setTime(timeLeft)
    }, 60000)
  }

  setTime(timeLeft: any) {
    this.hours = timeLeft.hours()
    this.minutes = timeLeft.minutes()
    console.log('hours: ', this.hours)
    console.log('minutes: ', this.minutes)
  }
}
