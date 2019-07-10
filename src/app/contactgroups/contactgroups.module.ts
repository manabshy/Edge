import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactgroupsRoutingModule } from './contactgroups-routing.module';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactgroupsListComponent } from './contactgroups-list/contactgroups-list.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { ContactgroupsNotesComponent } from './contactgroups-notes/contactgroups-notes.component';
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
import { ContactgroupsDetailLettingManagementsComponent } from './contactgroups-detail-letting-managements/contactgroups-detail-letting-managements.component';
import { ContactgroupsDetailHomeManagementsComponent } from './contactgroups-detail-home-managements/contactgroups-detail-home-managements.component';

@NgModule({
  declarations: [ContactgroupsListComponent, ContactgroupsDetailComponent, ContactgroupsPeopleComponent,
    ContactgroupsNotesComponent, ContactgroupsDetailEditComponent, ContactgroupsCompanyEditComponent, ContactgroupsDetailLeadsComponent, ContactgroupsDetailNotesComponent, ContactgroupsDetailSearchesComponent, ContactgroupsDetailValuationsComponent, ContactgroupsDetailInstructionsComponent, ContactgroupsDetailOffersComponent, ContactgroupsDetailTenanciesComponent, ContactgroupsDetailLettingManagementsComponent, ContactgroupsDetailHomeManagementsComponent],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ContactgroupsRoutingModule
  ],
  exports: [ContactgroupsListComponent, ContactgroupsNotesComponent]
})
export class ContactgroupsModule { }
