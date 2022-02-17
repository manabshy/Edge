import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PipelineComponent } from './pipeline/pipeline.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ExchangesComponent } from './exchanges/exchanges.component';
// import { PipeResolver } from '@angular/compiler';
import { LeaderboardComponent } from './leaderboard.component';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [MsalGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pipeline' },
      { path: 'instructions', component: InstructionsComponent },
      { path: 'pipeline', component: PipelineComponent },
      { path: 'exchanges', component: ExchangesComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaderboardRoutingModule {}
