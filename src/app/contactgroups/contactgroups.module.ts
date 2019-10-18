import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactgroupsRoutingModule } from './contactgroups-routing.module';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactgroupsListComponent } from './contactgroups-list/contactgroups-list.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit/contactgroups-detail-edit.component';
import { ContactgroupsCompanyEditComponent } from './contactgroups-company-edit/contactgroups-company-edit.component';
import { ContactgroupsDetailLeadsComponent } from './contactgroups-detail-leads/contactgroups-detail-leads.component';
import { ContactgroupsDetailNotesComponent } from './contactgroups-detail-notes/contactgroups-detail-notes.component';
import { ContactgroupsDetailSearchesComponent } from './contactgroups-detail-searches/contactgroups-detail-searches.component';
import { ContactgroupsDetailValuationsComponent } from './contactgroups-detail-valuations/contactgroups-detail-valuations.component';
import { ContactgroupsDetailInstructionsComponent } from './contactgroups-detail-instructions/contactgroups-detail-instructions.component';
import { ContactgroupsDetailOffersComponent } from './contactgroups-detail-offers/contactgroups-detail-offers.component';
import { ContactgroupsDetailTenanciesComponent } from './contactgroups-detail-tenancies/contactgroups-detail-tenancies.component';
import { ContactgroupsDetaillettingsManagementsComponent } from './contactgroups-detail-lettings-managements/contactgroups-detail-lettings-managements.component';
import { ContactgroupsDetailHomeManagementsComponent } from './contactgroups-detail-home-managements/contactgroups-detail-home-managements.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ContactGroupsComponent } from './contactgroups.component';
import { ContactgroupsDetailHomeHelperComponent } from './contactgroups-detail-home-helper/contactgroups-detail-home-helper.component';

@NgModule({
  declarations: [
    ContactGroupsComponent,
    ContactgroupsListComponent,
    ContactgroupsDetailComponent,
    ContactgroupsPeopleComponent,
    ContactgroupsDetailEditComponent,
    ContactgroupsCompanyEditComponent,
    ContactgroupsDetailLeadsComponent,
    ContactgroupsDetailNotesComponent,
    ContactgroupsDetailSearchesComponent,
    ContactgroupsDetailValuationsComponent,
    ContactgroupsDetailInstructionsComponent,
    ContactgroupsDetailOffersComponent,
    ContactgroupsDetailTenanciesComponent,
    ContactgroupsDetaillettingsManagementsComponent,
    ContactgroupsDetailHomeManagementsComponent,
    ContactgroupsDetailHomeHelperComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    InfiniteScrollModule,
    ContactgroupsRoutingModule
  ],
  exports: [ContactgroupsListComponent]
})
export class ContactgroupsModule { }
