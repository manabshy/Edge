import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { CoreModule } from '../core/core.module';
import { DashboardListComponent } from './dashboard-list/dashboard-list.component';
import { ValuationsAndInstructionsComponent } from './dashboard-list/valuations-and-instructions/valuations-and-instructions.component';
import { InstructionsAndBusinessDevelopmentComponent } from './dashboard-list/instructions-and-business-development/instructions-and-business-development.component';
import { ExchangesAndPipelineComponent } from './dashboard-list/exchanges-and-pipeline/exchanges-and-pipeline.component';

@NgModule({
  declarations: [MyDashboardComponent,
    TeamDashboardComponent,
    DashboardListComponent,
    ValuationsAndInstructionsComponent,
    InstructionsAndBusinessDevelopmentComponent,
    ExchangesAndPipelineComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardRoutingModule,
    CoreModule
  ],
  exports: [
    MyDashboardComponent,
    TeamDashboardComponent,
    DashboardListComponent,
    ValuationsAndInstructionsComponent,
    ExchangesAndPipelineComponent,
    InstructionsAndBusinessDevelopmentComponent],
})
export class DashboardModule { }
