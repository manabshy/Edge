import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactgroupsRoutingModule } from './contactgroups-routing.module';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactgroupsListComponent } from './contactgroups-list/contactgroups-list.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { ContactgroupsNotesComponent } from './contactgroups-notes/contactgroups-notes.component';
import { CoreModule } from '../core/core.module';
import { ContactgroupsSearchComponent } from './contactgroups-search/contactgroups-search.component';

@NgModule({
  declarations: [ContactgroupsListComponent, ContactgroupsDetailComponent, ContactgroupsPeopleComponent, ContactgroupsNotesComponent, ContactgroupsSearchComponent],
  imports: [
    CommonModule,
    CoreModule,
    ContactgroupsRoutingModule
  ],
  exports: [ContactgroupsListComponent, ContactgroupsPeopleComponent, ContactgroupsNotesComponent]
})
export class ContactgroupsModule { }
