import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';

@NgModule({
  declarations: [MyDashboardComponent, TeamDashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
