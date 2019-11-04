import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadRegisterComponent } from './lead-register/lead-register.component';

const routes: Routes = [
  { path: '', component: LeadRegisterComponent, data: { shouldDetach: false } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule { }
