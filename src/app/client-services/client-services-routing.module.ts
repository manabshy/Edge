import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelListComponent } from './admin-panel-list/admin-panel-list.component';
import { AdminPanelDetailsComponent } from './admin-panel-details/admin-panel-details.component';
import { RulesComponent } from './shared/components/rules/rules.component';


const routes: Routes = [
  { path: '', component: AdminPanelListComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'details/:id', component: AdminPanelDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientServicesRoutingModule { }
