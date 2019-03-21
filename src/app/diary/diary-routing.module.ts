import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDiaryEventComponent } from './add-diary-event/add-diary-event.component';
import { AddDiaryEventGuard } from './shared/add-diary-event.guard';

const routes: Routes = [
  { path: 'add-event', component: AddDiaryEventComponent, canDeactivate: [AddDiaryEventGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiaryRoutingModule { }
