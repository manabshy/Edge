import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'contactgroups-detail', component: ContactgroupsDetailComponent },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactgroupsRoutingModule { }
