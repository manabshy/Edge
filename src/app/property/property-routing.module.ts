import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropertyComponent } from './property.component';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyDetailInstructionsComponent } from './property-detail-instructions/property-detail-instructions.component';
import { PropertyDetailOffersComponent } from './property-detail-offers/property-detail-offers.component';
import { PropertyDetailDocumentsComponent } from './property-detail-documents/property-detail-documents.component';
import { PropertyDetailEditComponent } from './property-detail-edit/property-detail-edit.component';


const routes: Routes = [
  { path: '', component: PropertyComponent, data: { shouldDetach: true , title: 'Property Centre'} },
  {
    path: 'detail/:id',
    children: [
      { path: '', component: PropertyDetailComponent, data: { shouldDetach: false, title: 'Property' } }, // do not cache page
      { path: 'edit', component: PropertyDetailEditComponent , data: { shouldDetach: false,  title: 'Property Edit'}, canDeactivate: [CanDeactivateGuard] },
      { path: 'instructions', component: PropertyDetailInstructionsComponent, data: { shouldDetach: false } },
      { path: 'offers', component: PropertyDetailOffersComponent , data: { shouldDetach: false }},
      { path: 'documents', component: PropertyDetailDocumentsComponent, data: { shouldDetach: true } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
