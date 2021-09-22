import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiaryRoutingModule } from './diary-routing.module';
import { AddDiaryEventComponent } from './add-diary-event/add-diary-event.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../shared/components.module';

@NgModule({
  declarations: [
    AddDiaryEventComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    DiaryRoutingModule,
    ReactiveFormsModule,
  ],
})
export class DiaryModule { }
