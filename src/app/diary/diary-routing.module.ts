import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDiaryEventComponent } from './add-diary-event/add-diary-event.component';

const routes: Routes = [
  { path: 'add-event', component: AddDiaryEventComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiaryRoutingModule { }
