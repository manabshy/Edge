import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadRegisterComponent } from './lead-register/lead-register.component';

@NgModule({
  declarations: [
    LeadRegisterComponent
  ],
  imports: [
    CommonModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
