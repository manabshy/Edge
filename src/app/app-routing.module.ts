import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }      from './home/home.component';
import { PropertyDetailsLettingComponent }   from './property-details-letting/property-details-letting.component';
import { PropertyDetailsSaleComponent }   from './property-details-sale/property-details-sale.component';
import { LeadEditComponent }   from './lead-edit/lead-edit.component';
import { LeadRegisterComponent }   from './lead-register/lead-register.component';
import { ApplicantRegisterComponent }   from './applicant-register/applicant-register.component';
import { ApplicantViewLettingComponent }   from './applicant-view-letting/applicant-view-letting.component';
import { ApplicantViewSaleComponent } from './applicant-view-sale/applicant-view-sale.component';
import { SendEdetailsComponent }   from './send-edetails/send-edetails.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiaryComponent } from './diary/diary.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { path: 'property-details-letting', component: PropertyDetailsLettingComponent, canActivate: [AuthGuardService]},
  { path: 'property-details-sale', component: PropertyDetailsSaleComponent, canActivate: [AuthGuardService]},
  { path: 'lead-edit', component: LeadEditComponent, canActivate: [AuthGuardService]},
  { path: 'lead-register', component: LeadRegisterComponent, canActivate: [AuthGuardService]},
  { path: 'applicant-register', component: ApplicantRegisterComponent, canActivate: [AuthGuardService]},
  { path: 'applicant-view-letting', component: ApplicantViewLettingComponent, canActivate: [AuthGuardService]},
  { path: 'applicant-view-sale', component: ApplicantViewSaleComponent, canActivate: [AuthGuardService]},
  { path: 'send-edetails', component: SendEdetailsComponent, canActivate: [AuthGuardService]},
  //{ path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuardService]},
  // { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  //{ path: 'diary', component: DiaryComponent, canActivate: [AuthGuardService]},
  { path: '', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }

