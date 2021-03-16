import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientServicesRoutingModule } from './client-services-routing.module';
import { AdminPanelListComponent } from './admin-panel-list/admin-panel-list.component';
import { AdminPanelDetailsComponent } from './admin-panel-details/admin-panel-details.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';



@NgModule({
  declarations: [AdminPanelListComponent, AdminPanelDetailsComponent, AdminPanelComponent],
  imports: [
    CoreModule,
    CommonModule,
    SharedModule,
    ClientServicesRoutingModule
  ]
})
export class ClientServicesModule { }
