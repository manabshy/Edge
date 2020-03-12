import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactgroupsRoutingModule } from './contactgroups-routing.module';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactgroupsListComponent } from './contactgroups-list/contactgroups-list.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { CoreModule } from '../core/core.module';
import { FormsModule } from '@angular/forms';
import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit/contactgroups-detail-edit.component';
import { ContactgroupsDetailLeadsComponent } from '../shared/contactgroups-detail-leads/contactgroups-detail-leads.component';
import { ContactgroupsDetailNotesComponent } from './contactgroups-detail-notes/contactgroups-detail-notes.component';
import { ContactgroupsDetailSearchesComponent } from '../shared/contactgroups-detail-searches/contactgroups-detail-searches.component';
import { ContactgroupsDetailValuationsComponent } from '../shared/contactgroups-detail-valuations/contactgroups-detail-valuations.component';
import { ContactgroupsDetailInstructionsComponent } from '../shared/contactgroups-detail-instructions/contactgroups-detail-instructions.component';
import { ContactgroupsDetailOffersComponent } from '../shared/contactgroups-detail-offers/contactgroups-detail-offers.component';
import { ContactgroupsDetailTenanciesComponent } from '../shared/contactgroups-detail-tenancies/contactgroups-detail-tenancies.component';
import { ContactgroupsDetaillettingsManagementsComponent } from '../shared/contactgroups-detail-lettings-managements/contactgroups-detail-lettings-managements.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ContactGroupsComponent } from './contactgroups.component';
import { ContactgroupsDetailHomeHelperComponent } from '../shared/contactgroups-detail-home-helper/contactgroups-detail-home-helper.component';
import { PersonDuplicateCheckerComponent } from './shared/person-duplicate-checker/person-duplicate-checker.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ContactGroupsComponent,
    ContactgroupsListComponent,
    ContactgroupsDetailComponent,
    ContactgroupsPeopleComponent,
    ContactgroupsDetailEditComponent,
    // ContactgroupsDetailLeadsComponent,
    ContactgroupsDetailNotesComponent,
    // ContactgroupsDetailSearchesComponent,
    // ContactgroupsDetailValuationsComponent,
    // ContactgroupsDetailTenanciesComponent,
    // ContactgroupsDetailInstructionsComponent,
    // ContactgroupsDetailOffersComponent,
    // ContactgroupsDetaillettingsManagementsComponent,
    // ContactgroupsDetailHomeHelperComponent,
    PersonDuplicateCheckerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    InfiniteScrollModule,
    ContactgroupsRoutingModule
  ],
  exports: [ContactgroupsListComponent]
})
export class ContactgroupsModule { }
