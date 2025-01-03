import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertyRoutingModule } from './property-routing.module';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyComponent } from './property.component';
import { CoreModule } from '../core/core.module';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyDetailInstructionsComponent } from './property-detail-instructions/property-detail-instructions.component';
import { PropertyDetailOffersComponent } from './property-detail-offers/property-detail-offers.component';
import { PropertyDetailDocumentsComponent } from './property-detail-documents/property-detail-documents.component';
import { PropertyDetailEditComponent } from './property-detail-edit/property-detail-edit.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PropertyDuplicateCheckerComponent } from './shared/property-duplicate-checker/property-duplicate-checker.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PropertyListComponent,
    PropertyComponent,
    PropertyDetailComponent,
    PropertyDetailInstructionsComponent,
    PropertyDetailOffersComponent,
    PropertyDetailDocumentsComponent,
    PropertyDetailEditComponent,
    PropertyDuplicateCheckerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PropertyRoutingModule,
    InfiniteScrollModule
  ],
  exports: [PropertyListComponent, PropertyDuplicateCheckerComponent]
})
export class PropertyModule { }
