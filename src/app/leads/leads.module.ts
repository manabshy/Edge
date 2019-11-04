import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadRegisterComponent } from './lead-register/lead-register.component';
import { CoreModule } from '../core/core.module';
import { LeadEditComponent } from './lead-edit/lead-edit.component';

@NgModule({
  declarations: [
    LeadRegisterComponent,
    LeadEditComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
