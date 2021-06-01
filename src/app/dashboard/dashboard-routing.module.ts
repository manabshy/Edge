import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MyDashboardComponent } from "./my-dashboard/my-dashboard.component";
import { TeamDashboardComponent } from "./team-dashboard/team-dashboard.component";
import { DashboardComponent } from "./dashboard.component";
import { DashboardListComponent } from "./dashboard-list/dashboard-list.component";
import { HomeComponent } from "../home/home.component";
import { AuthGuardService } from "../core/services/auth-guard.service";
import { InstructionsAndBusinessDevelopmentComponent } from "./dashboard-list/instructions-and-business-development/instructions-and-business-development.component";
import { ExchangesAndPipelineComponent } from "./dashboard-list/exchanges-and-pipeline/exchanges-and-pipeline.component";
import { MsalGuard } from "@azure/msal-angular";
import { OverviewComponent } from "./overview/overview.component";

const routes: Routes = [
  {
    path: "overview",
    component: OverviewComponent,
    canActivate: [MsalGuard],
    data: { title: "Overview" },
  },
  // { path: 'list/:id', component: DashboardListComponent, canActivate: [MsalGuard] },
  // { path: 'instructionsAndBdd/:id', component: InstructionsAndBusinessDevelopmentComponent, canActivate: [MsalGuard] },
  // { path: 'exchangesAndPipeline/:id', component: ExchangesAndPipelineComponent, canActivate: [MsalGuard] },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
