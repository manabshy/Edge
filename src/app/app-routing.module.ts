import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent }      from './home/home.component';
import { ContactCentreComponent }   from './contact-centre/contact-centre.component';
import { PropertyDetailsLettingComponent }   from './property-details-letting/property-details-letting.component';
import { PropertyDetailsSaleComponent }   from './property-details-sale/property-details-sale.component';
import { LeadEditComponent }   from './lead-edit/lead-edit.component';
import { LeadRegisterComponent }   from './lead-register/lead-register.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'contact-centre', component: ContactCentreComponent },
  { path: 'property-details-letting', component: PropertyDetailsLettingComponent },
  { path: 'property-details-sale', component: PropertyDetailsSaleComponent },
  { path: 'lead-edit', component: LeadEditComponent },
  { path: 'lead-register', component: LeadRegisterComponent }

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }

