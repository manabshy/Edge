import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyComponent } from './property.component';
import { CoreModule } from '../core/core.module';
import { PropertyDetailComponent } from './property-detail/property-detail.component';

@NgModule({
  declarations: [PropertyListComponent, PropertyComponent, PropertyDetailComponent],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    CoreModule
  ],
  exports: [PropertyListComponent]
})
export class PropertyModule { }
