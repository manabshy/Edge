import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { PropertyComponent } from './property.component';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyDetailSalesLettingsComponent } from './property-detail-sales-lettings/property-detail-sales-lettings.component';
import { PropertyDetailOffersComponent } from './property-detail-offers/property-detail-offers.component';
import { PropertyDetailNotesComponent } from './property-detail-notes/property-detail-notes.component';
import { PropertyDetailDocumentsComponent } from './property-detail-documents/property-detail-documents.component';
import { PropertyDetailPhotosComponent } from './property-detail-photos/property-detail-photos.component';
import { PropertyDetailMapComponent } from './property-detail-map/property-detail-map.component';


const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'property-centre',
    children: [
      { path: '', component: PropertyComponent },
      // { path: 'company', children: [
      //   { path: '', component: ContactgroupsCompanyEditComponent }
      // ] },
      { path: 'detail/:id',
      children: [
        { path: '', component: PropertyDetailComponent },
        {path: 'sales-lettings', component: PropertyDetailSalesLettingsComponent},
        {path: 'offers', component: PropertyDetailOffersComponent},
        {path: 'notes', component: PropertyDetailNotesComponent},
        {path: 'documents', component: PropertyDetailDocumentsComponent},
        {path: 'photos', component: PropertyDetailPhotosComponent},
        {path: 'map', component: PropertyDetailMapComponent},
      ] }
    ]
  }

]}]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
