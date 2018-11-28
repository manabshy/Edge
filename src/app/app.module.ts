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
    LeadRegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
    
  ],
  exports: [
    MainmenuComponent
 ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
