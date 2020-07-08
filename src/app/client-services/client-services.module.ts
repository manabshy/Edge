import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientServicesRoutingModule } from './client-services-routing.module';
import { AdminPanelListComponent } from './admin-panel-list/admin-panel-list.component';
import { AdminPanelDetailsComponent } from './admin-panel-details/admin-panel-details.component';
import { CoreModule } from '../core/core.module';
import { InMemoryDbService, HttpClientInMemoryWebApiModule, InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AdminPanelInMemoryData } from './shared/in-memory-data';



@NgModule({
  declarations: [AdminPanelListComponent, AdminPanelDetailsComponent],
  imports: [
    CoreModule,
    CommonModule,
    HttpClientInMemoryWebApiModule.forFeature(AdminPanelInMemoryData),
    ClientServicesRoutingModule
  ]
})
export class ClientServicesModule { }
