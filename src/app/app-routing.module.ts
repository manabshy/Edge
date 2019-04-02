import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent }      from './home/home.component';
import { ContactCentreComponent }   from './contact-centre/contact-centre.component';
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

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'contact-centre', component: ContactCentreComponent },
    { path: 'property-details-letting', component: PropertyDetailsLettingComponent },
    { path: 'property-details-sale', component: PropertyDetailsSaleComponent },
    { path: 'lead-edit', component: LeadEditComponent },
    { path: 'lead-register', component: LeadRegisterComponent },
    { path: 'applicant-register', component: ApplicantRegisterComponent },
    { path: 'applicant-view-letting', component: ApplicantViewLettingComponent },
    { path: 'applicant-view-sale', component: ApplicantViewSaleComponent },
    { path: 'send-edetails', component: SendEdetailsComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    // { path: 'dashboard', component: DashboardComponent },
    { path: 'diary', component: DiaryComponent },
  ] }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule { }

