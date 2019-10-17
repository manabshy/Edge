import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiaryRoutingModule } from './diary-routing.module';
import { AddDiaryEventComponent } from './add-diary-event/add-diary-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [AddDiaryEventComponent],
  imports: [
    CommonModule,
    CoreModule,
    DiaryRoutingModule,
    ReactiveFormsModule,
    CoreModule
  ]
})
export class DiaryModule { }
