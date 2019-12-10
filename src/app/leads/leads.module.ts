import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadRegisterComponent } from './lead-register/lead-register.component';
import { CoreModule } from '../core/core.module';
import { LeadEditComponent } from './lead-edit/lead-edit.component';
import { LeadComponent } from './lead.component';
import { StaffmemberFinderComponent } from '../shared/staffmember-finder/staffmember-finder.component';
import { LeadFinderComponent } from './lead-finder/lead-finder.component';
import { SharedModule } from '../shared/shared.module';
import { LeadNoteComponent } from './lead-note/lead-note.component';

@NgModule({
  declarations: [
    LeadRegisterComponent,
    LeadEditComponent,
    LeadComponent,
    LeadFinderComponent,
    LeadNoteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
