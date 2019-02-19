import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';

@NgModule({
  declarations: [MyDashboardComponent, TeamDashboardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardRoutingModule
  ],
  exports: [MyDashboardComponent, TeamDashboardComponent]
})
export class DashboardModule { }
