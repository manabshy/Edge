import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadRegisterComponent } from './lead-register/lead-register.component';
import { LeadEditComponent } from './lead-edit/lead-edit.component';
import { LeadComponent } from './lead.component';
import { LeadFinderComponent } from './lead-finder/lead-finder.component';
import { SharedModule } from '../shared/shared.module';
import { LeadNoteComponent } from './lead-note/lead-note.component';
import { LeadTypeFinderComponent } from './lead-type-finder/lead-type-finder.component';

@NgModule({
  declarations: [
    LeadRegisterComponent,
    LeadEditComponent,
    LeadComponent,
    LeadFinderComponent,
    LeadNoteComponent,
    LeadTypeFinderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
