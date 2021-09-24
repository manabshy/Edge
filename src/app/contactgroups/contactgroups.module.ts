import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ComponentsModule } from '../shared/components.module';
import { VendorsModule } from '../shared/vendors.module';
// Contact modules and components
import { ContactgroupsRoutingModule } from './contactgroups-routing.module';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactgroupsListComponent } from './contactgroups-list/contactgroups-list.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit/contactgroups-detail-edit.component';
import { ContactgroupsDetailNotesComponent } from './contactgroups-detail-notes/contactgroups-detail-notes.component';
import { ContactGroupsComponent } from './contactgroups.component';
import { PersonDuplicateCheckerComponent } from './shared/person-duplicate-checker/person-duplicate-checker.component';

const components = [
  ContactGroupsComponent,
  ContactgroupsListComponent,
  ContactgroupsDetailComponent,
  ContactgroupsPeopleComponent,
  ContactgroupsDetailEditComponent,
  ContactgroupsDetailNotesComponent,
  PersonDuplicateCheckerComponent
]

@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    VendorsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ContactgroupsRoutingModule,
    ComponentsModule
  ],
  exports: [
    components
  ]
})
export class ContactgroupsModule { }
