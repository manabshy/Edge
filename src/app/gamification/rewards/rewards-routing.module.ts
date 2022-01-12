import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MsalGuard } from "@azure/msal-angular";
import { RewardsShellComponent } from "./rewards-shell/rewards-shell.component";

const routes: Routes = [
  {
    path: "",
    component: RewardsShellComponent,
    canActivate: [MsalGuard],
    data: { title: "Overview" },
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RewardsRoutingModule {}
