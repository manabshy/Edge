import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiaryRoutingModule } from './diary-routing.module';
import { AddDiaryEventComponent } from './add-diary-event/add-diary-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarHeaderComponent } from './shared/calendar-header.component';
import { CalendarModule } from 'angular-calendar';
import { calendar } from 'ngx-bootstrap/chronos/moment/calendar';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AddDiaryEventComponent, CalendarComponent, CalendarHeaderComponent],
  imports: [
    CommonModule,
    SharedModule,
    DiaryRoutingModule,
    ReactiveFormsModule,
    // CoreModule,
    CalendarModule
  ],
  exports:[CalendarComponent]
})
export class DiaryModule { }
