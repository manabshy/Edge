import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { VendorsModule } from '../shared/vendors.module'
// Contact modules and components
import { ContactGroupsRoutingModule } from './contact-groups-routing.module'
import { ContactGroupsComponentsModule } from './contact-groups.components.module'

@NgModule({
  imports: [CommonModule, VendorsModule, ContactGroupsRoutingModule, ContactGroupsComponentsModule]
})
export class ContactGroupsModule {}
