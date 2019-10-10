import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { PropertyComponent } from './property.component';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyDetailInstructionsComponent } from './property-detail-instructions/property-detail-instructions.component';
import { PropertyDetailOffersComponent } from './property-detail-offers/property-detail-offers.component';
import { PropertyDetailNotesComponent } from './property-detail-notes/property-detail-notes.component';
import { PropertyDetailDocumentsComponent } from './property-detail-documents/property-detail-documents.component';
import { PropertyDetailPhotosComponent } from './property-detail-photos/property-detail-photos.component';
import { PropertyDetailMapComponent } from './property-detail-map/property-detail-map.component';
import { PropertyDetailEditComponent } from './property-detail-edit/property-detail-edit.component';


const routes: Routes = [
  { path: 'property-centre', canActivate: [AuthGuardService],
    children: [
      { path: '', component: PropertyComponent, data: { shouldDetach: true } },
      // { path: 'company', children: [
      //   { path: '', component: ContactgroupsCompanyEditComponent }
      // ] },
      { path: 'detail/:id',
      children: [
        { path: '', component: PropertyDetailComponent, data: { shouldDetach: true }},
        {path: 'edit', component: PropertyDetailEditComponent, canDeactivate: [CanDeactivateGuard] },
        {path: 'instructions', component: PropertyDetailInstructionsComponent},
        {path: 'offers', component: PropertyDetailOffersComponent},
        {path: 'property-notes', component: PropertyDetailNotesComponent},
        {path: 'documents', component: PropertyDetailDocumentsComponent},
        {path: 'property-photos', component: PropertyDetailPhotosComponent},
        {path: 'map', component: PropertyDetailMapComponent},
        // {path: 'map/:lat/:lng', component: PropertyDetailMapComponent},
      ] }
    ]
  }
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
