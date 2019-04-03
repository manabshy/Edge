import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactgroupsRoutingModule } from './contactgroups-routing.module';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactgroupsListComponent } from './contactgroups-list/contactgroups-list.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { ContactgroupsNotesComponent } from './contactgroups-notes/contactgroups-notes.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ContactgroupsListComponent, ContactgroupsDetailComponent, ContactgroupsPeopleComponent, ContactgroupsNotesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ContactgroupsRoutingModule
  ],
  exports: [ContactgroupsListComponent, ContactgroupsPeopleComponent, ContactgroupsNotesComponent]
})
export class ContactgroupsModule { }
