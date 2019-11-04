import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadRegisterComponent } from './lead-register/lead-register.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    LeadRegisterComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
