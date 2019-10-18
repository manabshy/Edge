import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactGroupsComponent } from './contactgroups.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit/contactgroups-detail-edit.component';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';
import { ContactgroupsDetailLeadsComponent } from './contactgroups-detail-leads/contactgroups-detail-leads.component';
import { ContactgroupsDetailNotesComponent } from './contactgroups-detail-notes/contactgroups-detail-notes.component';
import { ContactgroupsDetailSearchesComponent } from './contactgroups-detail-searches/contactgroups-detail-searches.component';
import { ContactgroupsDetailValuationsComponent } from './contactgroups-detail-valuations/contactgroups-detail-valuations.component';
import { ContactgroupsDetailInstructionsComponent } from './contactgroups-detail-instructions/contactgroups-detail-instructions.component';
import { ContactgroupsDetailOffersComponent } from './contactgroups-detail-offers/contactgroups-detail-offers.component';
import { ContactgroupsDetailTenanciesComponent } from './contactgroups-detail-tenancies/contactgroups-detail-tenancies.component';
import { ContactgroupsDetaillettingsManagementsComponent } from './contactgroups-detail-lettings-managements/contactgroups-detail-lettings-managements.component';
import { ContactgroupsDetailHomeManagementsComponent } from './contactgroups-detail-home-managements/contactgroups-detail-home-managements.component';

const routes: Routes = [
  { path: '', component: ContactGroupsComponent, data: { shouldDetach: true } },
  {
    path: 'detail/:personId',
    children: [
      { path: '', component: ContactgroupsDetailComponent, data: { shouldDetach: true } },
      { path: 'people/:contactGroupId', component: ContactgroupsPeopleComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'edit', component: ContactgroupsDetailEditComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'leads', component: ContactgroupsDetailLeadsComponent },
      { path: 'notes', component: ContactgroupsDetailNotesComponent },
      { path: 'searches', component: ContactgroupsDetailSearchesComponent },
      { path: 'valuations', component: ContactgroupsDetailValuationsComponent },
      { path: 'instructions', component: ContactgroupsDetailInstructionsComponent },
      { path: 'offers', component: ContactgroupsDetailOffersComponent },
      { path: 'tenancies', component: ContactgroupsDetailTenanciesComponent },
      { path: 'lettings-managements', component: ContactgroupsDetaillettingsManagementsComponent },
      { path: 'home-managements', component: ContactgroupsDetailHomeManagementsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactgroupsRoutingModule { }
