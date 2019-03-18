import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { CoreModule } from '../core/core.module';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';

@NgModule({
  declarations: [MyDashboardComponent, TeamDashboardComponent, DashboardListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardRoutingModule,
    CoreModule
  ],
  exports: [MyDashboardComponent, TeamDashboardComponent, DashboardListComponent],
})
export class DashboardModule { }
