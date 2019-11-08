import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadRegisterComponent } from './lead-register/lead-register.component';
import { LeadEditComponent } from './lead-edit/lead-edit.component';
import { LeadComponent } from './lead.component';

const routes: Routes = [
  { path: '', component: LeadComponent, data: { shouldDetach: false } },
  { path: 'edit/:leadId', component: LeadEditComponent, data: { shouldDetach: false } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
