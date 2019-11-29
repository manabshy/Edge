import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './/app-routing.module';
import { PropertyDetailsLettingComponent } from './property-details-letting/property-details-letting.component';
import { PropertyDetailsSaleComponent } from './property-details-sale/property-details-sale.component';
import { PropertyFeaturesComponent } from './property-features/property-features.component';
import { MiniMapAndPhotosComponent } from './mini-map-and-photos/mini-map-and-photos.component';
import { PropertyMarketingComponent } from './property-marketing/property-marketing.component';
import { PropertyHistoryComponent } from './property-history/property-history.component';
import { PropertyMediaComponent } from './property-media/property-media.component';
import { PropertyNotesComponent } from './property-notes/property-notes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DiaryComponent } from './diary/diary.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ApplicantRegisterComponent } from './applicant-register/applicant-register.component';
import { ApplicantViewLettingComponent } from './applicant-view-letting/applicant-view-letting.component';
import { ViewingsComponent } from './viewings/viewings.component';
import { ViewingsContactComponent } from './viewings-contact/viewings-contact.component';
import { ViewingsPropertyComponent } from './viewings-property/viewings-property.component';
import { ApplicantViewSaleComponent } from './applicant-view-sale/applicant-view-sale.component';
import { ApplicantMatchingComponent } from './applicant-matching/applicant-matching.component';
import { SendEdetailsComponent } from './send-edetails/send-edetails.component';
import { PropertyChecklistLettingComponent } from './property-checklist-letting/property-checklist-letting.component';
import { PropertyChecklistItemComponent } from './property-checklist-item/property-checklist-item.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { CoreModule } from './core/core.module';
import { AccountModule } from './account/account.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiaryModule } from './diary/diary.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ImpersonateMemberComponent } from './impersonate-member/impersonate-member.component';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    HomeComponent,
    PropertyDetailsLettingComponent,
    PropertyDetailsSaleComponent,
    PropertyFeaturesComponent,
    MiniMapAndPhotosComponent,
    PropertyMarketingComponent,
    PropertyHistoryComponent,
    PropertyMediaComponent,
    PropertyNotesComponent,
    DashboardComponent,
    DiaryComponent,
    LeaderboardComponent,
    ApplicantRegisterComponent,
    ApplicantViewLettingComponent,
    ViewingsComponent,
    ViewingsContactComponent,
    ViewingsPropertyComponent,
    ApplicantViewSaleComponent,
    ApplicantMatchingComponent,
    SendEdetailsComponent,
    PropertyChecklistLettingComponent,
    PropertyChecklistItemComponent,
    NotFoundComponent,
    ImpersonateMemberComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AccountModule,
    CoreModule,
    SharedModule,
    DashboardModule,
    LeaderboardModule,
    DiaryModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [
    MainmenuComponent
 ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
