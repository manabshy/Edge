import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { HomeComponent } from '../home/home.component';
import { AuthGuardService } from '../core/services/auth-guard.service';

// const routes: Routes = [
//   // { path: 'staffmembers/:id/dashboard', component: MyDashboardComponent },
//   // { path: 'staffmembers/:id/teammembers/dashboard', component: TeamDashboardComponent }
//   // { path: '', pathMatch: 'full', redirectTo: 'staffmembers/:id/dashboard' }
// ];

const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   component: HomeComponent,
  //   children: [
  //     { path: 'me', component: MyDashboardComponent },
  //     { path: 'team', component: TeamDashboardComponent },
  //   ]
  // },
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'list/:id', component: DashboardListComponent },
  ] }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
