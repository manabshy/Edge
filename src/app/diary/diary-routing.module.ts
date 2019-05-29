import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDiaryEventComponent } from './add-diary-event/add-diary-event.component';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'add-event', component: AddDiaryEventComponent, canDeactivate: [CanDeactivateGuard] },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiaryRoutingModule { }
