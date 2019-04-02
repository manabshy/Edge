import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDiaryEventComponent } from './add-diary-event/add-diary-event.component';
import { AddDiaryEventGuard } from './shared/add-diary-event.guard';
import { AuthGuardService } from '../core/services/auth-guard.service';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'add-event', component: AddDiaryEventComponent, canDeactivate: [AddDiaryEventGuard] },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiaryRoutingModule { }
