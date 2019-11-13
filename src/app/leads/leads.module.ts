import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadRegisterComponent } from './lead-register/lead-register.component';
import { CoreModule } from '../core/core.module';
import { LeadEditComponent } from './lead-edit/lead-edit.component';
import { LeadComponent } from './lead.component';
import { StaffmemberFinderComponent } from './staffmember-finder/staffmember-finder.component';

@NgModule({
  declarations: [
    LeadRegisterComponent,
    LeadEditComponent,
    LeadComponent,
    StaffmemberFinderComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
