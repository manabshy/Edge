import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientServicesRoutingModule } from './client-services-routing.module';
import { AdminPanelListComponent } from './admin-panel-list/admin-panel-list.component';
import { AdminPanelDetailsComponent } from './admin-panel-details/admin-panel-details.component';
import { CoreModule } from '../core/core.module';
import { RulesComponent } from './shared/components/rules/rules.component';



@NgModule({
  declarations: [AdminPanelListComponent, AdminPanelDetailsComponent, RulesComponent],
  imports: [
    CoreModule,
    CommonModule,
    ClientServicesRoutingModule
  ]
})
export class ClientServicesModule { }
