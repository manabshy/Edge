import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MyDashboardComponent } from './my-dashboard/my-dashboard.component';
import { TeamDashboardComponent } from './team-dashboard/team-dashboard.component';
import { CoreModule } from '../core/core.module';
import { OfferListComponent } from './offer-list/offer-list.component';

@NgModule({
  declarations: [MyDashboardComponent, TeamDashboardComponent, OfferListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    DashboardRoutingModule,
    CoreModule
  ],
  exports: [MyDashboardComponent, TeamDashboardComponent]
})
export class DashboardModule { }
