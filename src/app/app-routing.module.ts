import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ImpersonateMemberComponent } from "./impersonate-member/impersonate-member.component";
import { MsalGuard } from "@azure/msal-angular";
import { CalendarComponent } from "./calendar-shared/calendar/calendar.component";

const routes: Routes = [
  {
    path: "impersonate-member",
    component: ImpersonateMemberComponent,
    canActivate: [MsalGuard],
  },
  {
    path: "leads",
    data: { preload: true },
    loadChildren: () =>
      import("./leads/leads.module").then((m) => m.LeadsModule),
    canActivate: [MsalGuard],
  },
  {
    path: "valuations",
    data: { preload: true },
    loadChildren: () =>
      import("./valuations/valuations.module").then((m) => m.ValuationsModule),
    canActivate: [MsalGuard],
  },
  {
    path: "property-centre",
    data: { preload: true },
    loadChildren: () =>
      import("./property/property.module").then((m) => m.PropertyModule),
    canActivate: [MsalGuard],
  },
  {
    path: "contact-centre",
    loadChildren: () =>
      import("./contact-groups/contact-groups.module").then(
        (m) => m.ContactGroupsModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: "company-centre",
    loadChildren: () =>
      import("./company/company.module").then((m) => m.CompanyModule),
    canActivate: [MsalGuard],
  },
  {
    path: "diary",
    loadChildren: () =>
      import("./diary/diary.module").then((m) => m.DiaryModule),
    canActivate: [MsalGuard],
  },
  {
    path: "admin-panel",
    loadChildren: () =>
      import("./client-services/client-services.module").then(
        (m) => m.ClientServicesModule
      ),
    canActivate: [MsalGuard],
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
    canActivate: [MsalGuard],
  },
  {
    path: "rewards",
    loadChildren: () =>
      import("./gamification/rewards/rewards.module").then((m) => m.RewardsModule),
    canActivate: [MsalGuard],
  },
  {
    path: "",
    component: CalendarComponent,
    canActivate: [MsalGuard],
    data: { title: "Calendar" },
  },
  // { path: '', component: HomeComponent, canActivate: [MsalGuard], data: { title: 'Calendar' } },
  { path: "**", component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "legacy",
      onSameUrlNavigation: "reload",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
