import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ContactgroupsDetailComponent } from './contact-groups-detail/contact-groups-detail.component'
import { ContactGroupsComponent } from './contact-groups.component'
import { ContactGroupsPeopleComponent } from './contact-groups-people/contact-groups-people.component'
import { ContactGroupsDetailEditComponent } from './contact-groups-detail-edit/contact-groups-detail-edit.component'
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard'
import { ContactGroupsDetailLeadsComponent } from '../shared/contact-groups-detail-leads/contact-groups-detail-leads.component'
import { ContactGroupsDetailNotesComponent } from './contact-groups-detail-notes/contact-groups-detail-notes.component'
import { ContactGroupsDetailSearchesComponent } from '../shared/contact-groups-detail-searches/contact-groups-detail-searches.component'
import { ContactGroupsDetailValuationsComponent } from '../shared/contact-groups-detail-valuations/contact-groups-detail-valuations.component'
import { ContactGroupsDetailInstructionsComponent } from '../shared/contact-groups-detail-instructions/contact-groups-detail-instructions.component'
import { ContactGroupsDetailOffersComponent } from '../shared/contact-groups-detail-offers/contact-groups-detail-offers.component'
import { ContactGroupsDetailTenanciesComponent } from '../shared/contact-groups-detail-tenancies/contact-groups-detail-tenancies.component'
import { ContactGroupsDetaillettingsManagementsComponent } from '../shared/contact-groups-detail-lettings-managements/contact-groups-detail-lettings-managements.component'
import { ContactgroupsDetailHomeHelperComponent } from '../shared/contact-groups-detail-home-helper/contact-groups-detail-home-helper.component'

const routes: Routes = [
  {
    path: '', // contact-centre/
    component: ContactGroupsComponent,
    data: { shouldDetach: true, title: 'Contact Centre' }
  },
  {
    path: 'detail/:personId',
    children: [
      {
        path: '',
        component: ContactgroupsDetailComponent,
        data: { shouldDetach: false, title: 'Person' }
      }, // do not cache page
      {
        path: 'people/:contactGroupId',
        component: ContactGroupsPeopleComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'edit',
        component: ContactGroupsDetailEditComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { title: 'Person Edit' }
      },
      { path: 'leads', component: ContactGroupsDetailLeadsComponent },
      { path: 'notes', component: ContactGroupsDetailNotesComponent },
      { path: 'searches', component: ContactGroupsDetailSearchesComponent },
      { path: 'valuations', component: ContactGroupsDetailValuationsComponent },
      {
        path: 'instructions',
        component: ContactGroupsDetailInstructionsComponent
      },
      { path: 'offers', component: ContactGroupsDetailOffersComponent },
      { path: 'tenancies', component: ContactGroupsDetailTenanciesComponent },
      {
        path: 'lettings-managements',
        component: ContactGroupsDetaillettingsManagementsComponent
      },
      {
        path: 'home-helpers',
        component: ContactgroupsDetailHomeHelperComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactGroupsRoutingModule {}
