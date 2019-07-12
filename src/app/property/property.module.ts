import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyComponent } from './property.component';
import { CoreModule } from '../core/core.module';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyDetailSalesLettingsComponent } from './property-detail-sales-lettings/property-detail-sales-lettings.component';
import { PropertyDetailOffersComponent } from './property-detail-offers/property-detail-offers.component';
import { PropertyDetailNotesComponent } from './property-detail-notes/property-detail-notes.component';
import { PropertyDetailDocumentsComponent } from './property-detail-documents/property-detail-documents.component';
import { PropertyDetailPhotosComponent } from './property-detail-photos/property-detail-photos.component';
import { PropertyDetailMapComponent } from './property-detail-map/property-detail-map.component';
import { PropertyDetailEditComponent } from './property-detail-edit/property-detail-edit.component';

@NgModule({
  declarations: [PropertyListComponent, PropertyComponent, PropertyDetailComponent, PropertyDetailSalesLettingsComponent, PropertyDetailOffersComponent, PropertyDetailNotesComponent, PropertyDetailDocumentsComponent, PropertyDetailPhotosComponent, PropertyDetailMapComponent, PropertyDetailEditComponent],
  imports: [
    CommonModule,
    PropertyRoutingModule,
    CoreModule
  ],
  exports: [PropertyListComponent]
})
export class PropertyModule { }
