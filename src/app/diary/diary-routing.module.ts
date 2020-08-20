import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddDiaryEventComponent } from './add-diary-event/add-diary-event.component';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';
import { DiaryComponent } from './diary.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: '', component: DiaryComponent, data: { shouldDetach: false } },
  { path: 'edit/:id', component: AddDiaryEventComponent, canActivate: [MsalGuard], canDeactivate: [CanDeactivateGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiaryRoutingModule { }
