import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  NO_ERRORS_SCHEMA,
  APP_INITIALIZER,
  ErrorHandler,
} from "@angular/core";

import { AppComponent } from "./app.component";
import { MainmenuComponent } from "./mainmenu/mainmenu.component";
import { HomeComponent } from "./home/home.component";
import { AppRoutingModule } from ".//app-routing.module";
import { PropertyDetailsLettingComponent } from "./property-details-letting/property-details-letting.component";
import { PropertyDetailsSaleComponent } from "./property-details-sale/property-details-sale.component";
import { PropertyFeaturesComponent } from "./property-features/property-features.component";
import { MiniMapAndPhotosComponent } from "./shared/mini-map-and-photos/mini-map-and-photos.component";
import { PropertyMarketingComponent } from "./property-marketing/property-marketing.component";
import { PropertyHistoryComponent } from "./property-history/property-history.component";
import { PropertyMediaComponent } from "./property-media/property-media.component";
import { PropertyNotesComponent } from "./property-notes/property-notes.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LeaderboardComponent } from "./leaderboard/leaderboard.component";
import { ApplicantRegisterComponent } from "./applicant-register/applicant-register.component";
import { ApplicantViewLettingComponent } from "./applicant-view-letting/applicant-view-letting.component";
import { ViewingsComponent } from "./viewings/viewings.component";
import { ViewingsContactComponent } from "./viewings-contact/viewings-contact.component";
import { ViewingsPropertyComponent } from "./viewings-property/viewings-property.component";
import { ApplicantViewSaleComponent } from "./applicant-view-sale/applicant-view-sale.component";
import { ApplicantMatchingComponent } from "./applicant-matching/applicant-matching.component";
import { SendEdetailsComponent } from "./send-edetails/send-edetails.component";
import { PropertyChecklistLettingComponent } from "./property-checklist-letting/property-checklist-letting.component";
import { PropertyChecklistItemComponent } from "./property-checklist-item/property-checklist-item.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { CoreModule } from "./core/core.module";
import { AccountModule } from "./account/account.module";
import { LeaderboardModule } from "./leaderboard/leaderboard.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ImpersonateMemberComponent } from "./impersonate-member/impersonate-member.component";
import { ConfigsLoaderService } from "./configs-loader.service";
import { GlobalErrorHandlerService } from "./core/services/global-error-handler.service";

import { SharedModule } from "./shared/shared.module";

// ngx bootstrap imports
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { NgPipesModule } from "ngx-pipes";

// ng bootstrap imports
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

// bootstrap
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { BsDropdownModule } from "ngx-bootstrap/dropdown/";
import { CollapseModule } from "ngx-bootstrap/collapse/";
import { TabsModule } from "ngx-bootstrap/tabs/";
// import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { ModalModule } from "ngx-bootstrap/modal/";
import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { CarouselModule } from "ngx-bootstrap/carousel";

// vendor
import { OrderModule } from "ngx-order-pipe";
import { ToastrModule, ToastContainerModule } from "ngx-toastr";
import { AgmCoreModule } from "@agm/core";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { AngularStickyThingsModule } from "@w11k/angular-sticky-things";
import { CalendarSharedModule } from "./calendar-shared/calendar-shared.module";

import { MsalModule } from "@azure/msal-angular";
import { HeaderComponent } from "./header/header.component";

// SVG ICONS
import { SvgIconsModule } from "@ngneat/svg-icon";
import { appPaperclipIcon } from "./svg/paperclip";
import { appEmailIcon } from "./svg/email";

export const protectedResourceMap: Map<string, Array<string>> = new Map([
  [
    "http://localhost:57211/v10",
    [
      "https://douglasandgordon.onmicrosoft.com/67f9a9a1-d8de-45bc-af20-43e1e18ccba5/user_impersonation",
    ],
  ],
  [
    "https://dandg-api-wedge-test.azurewebsites.net",
    [
      "https://douglasandgordon.onmicrosoft.com/67f9a9a1-d8de-45bc-af20-43e1e18ccba5/user_impersonation",
    ],
  ],
  [
    "https://dandg-api-wedge-dev.azurewebsites.net",
    [
      "https://douglasandgordon.onmicrosoft.com/67f9a9a1-d8de-45bc-af20-43e1e18ccba5/user_impersonation",
    ],
  ],
  [
    "https://dandg-api-wedge.azurewebsites.net",
    [
      "https://douglasandgordon.onmicrosoft.com/67f9a9a1-d8de-45bc-af20-43e1e18ccba5/user_impersonation",
    ],
  ],
  ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
]);

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;
const redirectUri = environment.baseRedirectUri
  ? environment.baseRedirectUri
  : window.location.origin;

// Date Picker Locale
import { defineLocale } from "ngx-bootstrap/chronos";
import { deLocale, frLocale, plLocale, enGbLocale } from "ngx-bootstrap/locale";
import { ProfileComponent } from "./profile/profile.component";

defineLocale("de", deLocale);
defineLocale("fr", frLocale);
defineLocale("pl", plLocale);
defineLocale("en-gb", enGbLocale);

const externalModulesImports = [
  InfiniteScrollModule,
  NgbModule,
  LoadingBarHttpClientModule,
  AngularStickyThingsModule,
  BsDropdownModule.forRoot(),
  CollapseModule.forRoot(),
  TabsModule.forRoot(),
  // BsDatepickerModule.forRoot(),
  TypeaheadModule.forRoot(),
  ModalModule.forRoot(),
  PopoverModule.forRoot(),
  TooltipModule.forRoot(),
  AccordionModule.forRoot(),
  ButtonsModule.forRoot(),
  ToastrModule.forRoot({ positionClass: "inline", enableHtml: true }),
  ToastContainerModule,
  CarouselModule.forRoot(),
  CalendarModule.forRoot({
    provide: DateAdapter,
    useFactory: adapterFactory,
  }),
  AgmCoreModule.forRoot({
    apiKey: "AIzaSyC1Hv_vNkUxvvRibyjPbfgNhrTNi30jNtQ",
  }),
];
const externalModulesExports = [
  InfiniteScrollModule,
  CollapseModule,
  TabsModule,
  TypeaheadModule,
  BsDropdownModule,
  // BsDatepickerModule,
  ModalModule,
  PopoverModule,
  NgPipesModule,
  TooltipModule,
  AccordionModule,
  ButtonsModule,
  ReactiveFormsModule,
  FormsModule,
  OrderModule,
  ToastrModule,
  ToastContainerModule,
  AgmCoreModule,
  CarouselModule,
  NgbModule,
  LoadingBarHttpClientModule,
  AngularStickyThingsModule,
];

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
    ImpersonateMemberComponent,
    HeaderComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    externalModulesImports,
    AccountModule,
    CoreModule,
    DashboardModule,
    LeaderboardModule,
    CalendarSharedModule,
    SharedModule,
    AppRoutingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    MsalModule.forRoot(
      {
        auth: {
          clientId: environment.clientId,
          authority: environment.authority,
          validateAuthority: true,
          redirectUri: `${redirectUri}/auth-callback`,
          postLogoutRedirectUri: environment.baseRedirectUri,
          navigateToLoginRequestUrl: true,
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: isIE, // set to true for IE 11
        },
        framework: {
          unprotectedResources: ["https://www.microsoft.com/en-us/"],
          protectedResourceMap: protectedResourceMap,
        },
      },
      {
        consentScopes: [
          "user.read",
          "openid",
          "profile",
          "https://douglasandgordon.onmicrosoft.com/03d5d394-2418-42fa-a345-556b8d7ffcdb/user_impersonation",
          "https://douglasandgordon.onmicrosoft.com/67f9a9a1-d8de-45bc-af20-43e1e18ccba5/user_impersonation",
        ],
        popUp: !isIE,
        protectedResourceMap: protectedResourceMap,
      }
    ),
    SvgIconsModule.forRoot({
      icons: [appPaperclipIcon, appEmailIcon],
    }),
  ],
  exports: [MainmenuComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [ConfigsLoaderService],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}

export function appInitializerFactory(
  configsLoaderService: ConfigsLoaderService
) {
  return () => configsLoaderService.loadConfigs();
}

export function loggerCallback(logLevel, message, piiEnabled) {
  console.log("msal log messages", message);
}
