import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './/app-routing.module';
import { ContactCentreComponent } from './contact-centre/contact-centre.component';
import { PropertyDetailsLettingComponent } from './property-details-letting/property-details-letting.component';
import { ContactgroupDetailsPeopleComponent } from './contactgroup-details-people/contactgroup-details-people.component';
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
import { LeadEditComponent } from './lead-edit/lead-edit.component';
import { LeadRegisterComponent } from './lead-register/lead-register.component';
import { PropertyFinderComponent } from './property-finder/property-finder.component';
import { ApplicantRegisterComponent } from './applicant-register/applicant-register.component';
import { ApplicantViewLettingComponent } from './applicant-view-letting/applicant-view-letting.component';
import { ContactgroupSummaryComponent } from './contactgroup-summary/contactgroup-summary.component';
import { ContactNotesComponent } from './contact-notes/contact-notes.component';
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
import { FormsModule } from '@angular/forms';
import { PropertyModule } from './property/property.module';
import { ContactgroupsModule } from './contactgroups/contactgroups.module';

@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    HomeComponent,
    ContactCentreComponent,
    PropertyDetailsLettingComponent,
    ContactgroupDetailsPeopleComponent,
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
    LeadEditComponent,
    LeadRegisterComponent,
    PropertyFinderComponent,
    ApplicantRegisterComponent,
    ApplicantViewLettingComponent,
    ContactgroupSummaryComponent,
    ContactNotesComponent,
    ViewingsComponent,
    ViewingsContactComponent,
    ViewingsPropertyComponent,
    ApplicantViewSaleComponent,
    ApplicantMatchingComponent,
    SendEdetailsComponent,
    PropertyChecklistLettingComponent,
    PropertyChecklistItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AccountModule,
    CoreModule,
    AppRoutingModule,
    DashboardModule,
    LeaderboardModule,
    PropertyModule,
    ContactgroupsModule
  ],
  exports: [
    MainmenuComponent
 ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
