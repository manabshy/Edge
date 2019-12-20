import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { PropertyDetailsLettingComponent } from './property-details-letting/property-details-letting.component';
import { PropertyDetailsSaleComponent } from './property-details-sale/property-details-sale.component';
import { LeadEditComponent } from './leads/lead-edit/lead-edit.component';
import { LeadRegisterComponent } from './leads/lead-register/lead-register.component';
import { ApplicantRegisterComponent } from './applicant-register/applicant-register.component';
import { ApplicantViewLettingComponent } from './applicant-view-letting/applicant-view-letting.component';
import { ApplicantViewSaleComponent } from './applicant-view-sale/applicant-view-sale.component';
import { SendEdetailsComponent } from './send-edetails/send-edetails.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { SelectiveStrategyService } from './core/services/selective-strategy.service';
import { ImpersonateMemberComponent } from './impersonate-member/impersonate-member.component';

const routes: Routes = [
  { path: 'property-details-letting', component: PropertyDetailsLettingComponent, canActivate: [AuthGuardService] },
  { path: 'property-details-sale', component: PropertyDetailsSaleComponent, canActivate: [AuthGuardService] },
  { path: 'applicant-register', component: ApplicantRegisterComponent, canActivate: [AuthGuardService] },
  { path: 'applicant-view-letting', component: ApplicantViewLettingComponent, canActivate: [AuthGuardService] },
  { path: 'applicant-view-sale', component: ApplicantViewSaleComponent, canActivate: [AuthGuardService] },
  { path: 'send-edetails', component: SendEdetailsComponent, canActivate: [AuthGuardService] },
  { path: 'impersonate-member', component: ImpersonateMemberComponent, canActivate: [AuthGuardService] },
  {
    path: 'leads-register',
    data: { preload: true },
    loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'valuations-register',
    data: { preload: true },
    loadChildren: () => import('./valuations/valuations.module').then(m => m.ValuationsModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'property-centre',
    data: { preload: true },
    loadChildren: () => import('./property/property.module').then(m => m.PropertyModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'contact-centre',
    loadChildren: () => import('./contactgroups/contactgroups.module').then(m => m.ContactgroupsModule), canActivate: [AuthGuardService]
  },
  {
    path: 'company-centre',
    loadChildren: () => import('./company/company.module').then(m => m.CompanyModule), canActivate: [AuthGuardService]
  },
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

