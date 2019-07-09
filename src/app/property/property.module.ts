import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyComponent } from './property.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [PropertyListComponent, PropertyComponent],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    CoreModule
  ],
  exports: [PropertyListComponent]
})
export class PropertyModule { }
