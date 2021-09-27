import { NgModule } from '@angular/core';
import { ComponentsModule } from '../shared/components.module';
import { VendorsModule } from '../shared/vendors.module';
// Contact modules and components
import { ContactgroupsDetailComponent } from './contact-groups-detail/contact-groups-detail.component';
import { ContactGroupsListComponent } from './contact-groups-list/contact-groups-list.component';
import { ContactGroupsPeopleComponent } from './contact-groups-people/contact-groups-people.component';
import { ContactGroupsDetailEditComponent } from './contact-groups-detail-edit/contact-groups-detail-edit.component';
import { ContactGroupsDetailNotesComponent } from './contact-groups-detail-notes/contactgroups-detail-notes.component';
import { ContactGroupsComponent } from './contact-groups.component';
import { PersonDuplicateCheckerComponent } from './shared/person-duplicate-checker/person-duplicate-checker.component';

const components = [
  ContactGroupsComponent,
  ContactGroupsListComponent,
  ContactgroupsDetailComponent,
  ContactGroupsPeopleComponent,
  ContactGroupsDetailEditComponent,
  ContactGroupsDetailNotesComponent,
  PersonDuplicateCheckerComponent
]

@NgModule({
  declarations: [
    components
  ],
  imports: [
    VendorsModule, 
    ComponentsModule
  ],
  exports: [
    components
  ]
})
export class ContactGroupsComponentsModule { }
