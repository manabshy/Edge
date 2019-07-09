import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyComponent } from './property.component';

@NgModule({
  declarations: [PropertyListComponent, PropertyComponent],
  imports: [
    CommonModule,
    PropertyRoutingModule
  ]
})
export class PropertyModule { }
