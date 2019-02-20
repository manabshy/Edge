import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';

const routes: Routes = [
  { path: 'staffmembers/:id/dashboard', component: MyDashboardComponent },
  { path: 'staffmembers/:id/teammembers/dashboard', component: TeamDashboardComponent }
  // { path: '', pathMatch: 'full', redirectTo: 'staffmembers/:id/dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
