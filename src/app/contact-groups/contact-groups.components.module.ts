import { NgModule } from '@angular/core'
import { ComponentsModule } from '../shared/components.module'
import { VendorsModule } from '../shared/vendors.module'
// Contact modules and components
import { ContactgroupsDetailComponent } from './contact-groups-detail/contact-groups-detail.component'
import { ContactGroupsListComponent } from './contact-groups-list/contact-groups-list.component'
import { ContactGroupsPeopleComponent } from './contact-groups-people/contact-groups-people.component'
import { ContactGroupsDetailEditComponent } from './contact-groups-detail-edit/contact-groups-detail-edit.component'
import { ContactGroupsDetailNotesComponent } from './contact-groups-detail-notes/contact-groups-detail-notes.component'
import { ContactGroupsComponent } from './contact-groups.component'
import { ContactDuplicateCheckerComponent } from './shared/contact-duplicate-checker/contact-duplicate-checker.component'
import { ContactSearchComponent } from './shared/contact-search/contact-search.component'

const components = [
  ContactGroupsComponent,
  ContactGroupsListComponent,
  ContactgroupsDetailComponent,
  ContactGroupsPeopleComponent,
  ContactGroupsDetailEditComponent,
  ContactGroupsDetailNotesComponent,
  ContactDuplicateCheckerComponent,
  ContactSearchComponent
]

@NgModule({
  declarations: [components],
  imports: [VendorsModule, ComponentsModule],
  exports: [components]
})
export class ContactGroupsComponentsModule {}
