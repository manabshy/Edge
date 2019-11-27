import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadRegisterComponent } from './lead-register/lead-register.component';
import { CoreModule } from '../core/core.module';
import { LeadEditComponent } from './lead-edit/lead-edit.component';
import { LeadComponent } from './lead.component';
import { StaffmemberFinderComponent } from './staffmember-finder/staffmember-finder.component';
import { LeadAssignmentModalComponent } from './lead-assignment-modal/lead-assignment-modal/lead-assignment-modal.component';

@NgModule({
  declarations: [
    LeadRegisterComponent,
    LeadEditComponent,
    LeadComponent,
    StaffmemberFinderComponent,
    LeadAssignmentModalComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    LeadsRoutingModule
  ],
  entryComponents: [
    LeadAssignmentModalComponent
  ]
})
export class LeadsModule { }
