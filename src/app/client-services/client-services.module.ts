import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientServicesRoutingModule } from './client-services-routing.module';
import { AdminPanelListComponent } from './admin-panel-list/admin-panel-list.component';
import { AdminPanelDetailsComponent } from './admin-panel-details/admin-panel-details.component';


@NgModule({
  declarations: [AdminPanelListComponent, AdminPanelDetailsComponent],
  imports: [
    CommonModule,
    ClientServicesRoutingModule
  ]
})
export class ClientServicesModule { }
