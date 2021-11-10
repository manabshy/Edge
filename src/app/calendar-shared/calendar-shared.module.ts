import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CalendarComponent } from './calendar/calendar.component'
import { CalendarHeaderComponent } from './calendar-header.component'
import { CalendarModule } from 'angular-calendar'
import { ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [CalendarComponent, CalendarHeaderComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule, CalendarModule],
  exports: [CalendarComponent]
})
export class CalendarSharedModule {}
