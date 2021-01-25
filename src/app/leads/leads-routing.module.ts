import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadEditComponent } from './lead-edit/lead-edit.component';
import { LeadComponent } from './lead.component';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';

const routes: Routes = [
  { path: '', component: LeadComponent, data: { shouldDetach: true, title: 'Leads register' } },
  { path: 'edit/:leadId', component: LeadEditComponent, canDeactivate: [CanDeactivateGuard], data: { shouldDetach: false, title: 'Lead' } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
