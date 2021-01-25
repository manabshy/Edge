import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactGroupsComponent } from './contactgroups.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit/contactgroups-detail-edit.component';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';
import { ContactgroupsDetailLeadsComponent } from '../shared/contactgroups-detail-leads/contactgroups-detail-leads.component';
import { ContactgroupsDetailNotesComponent } from './contactgroups-detail-notes/contactgroups-detail-notes.component';
import { ContactgroupsDetailSearchesComponent } from '../shared/contactgroups-detail-searches/contactgroups-detail-searches.component';
import { ContactgroupsDetailValuationsComponent } from '../shared/contactgroups-detail-valuations/contactgroups-detail-valuations.component';
import { ContactgroupsDetailInstructionsComponent } from '../shared/contactgroups-detail-instructions/contactgroups-detail-instructions.component';
import { ContactgroupsDetailOffersComponent } from '../shared/contactgroups-detail-offers/contactgroups-detail-offers.component';
import { ContactgroupsDetailTenanciesComponent } from '../shared/contactgroups-detail-tenancies/contactgroups-detail-tenancies.component';
import { ContactgroupsDetaillettingsManagementsComponent } from '../shared/contactgroups-detail-lettings-managements/contactgroups-detail-lettings-managements.component';
import { ContactgroupsDetailHomeHelperComponent } from '../shared/contactgroups-detail-home-helper/contactgroups-detail-home-helper.component';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { ContactgroupsRedesignComponent } from './contactgroups-redesign/contactgroups-redesign.component';

const routes: Routes = [
  { path: '', component: ContactGroupsComponent, data: { shouldDetach: true, title: 'Contact centre' } },
  {
    path: 'detail/:personId',
    children: [
      // { path: '', component: ContactgroupsDetailComponent, data: { shouldDetach: true } },
      { path: '', component: ContactgroupsDetailComponent, data: { shouldDetach: false, title: 'Contact centre' } }, // do not cache page
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
      { path: 'home-helpers', component: ContactgroupsDetailHomeHelperComponent },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactgroupsRoutingModule { }
