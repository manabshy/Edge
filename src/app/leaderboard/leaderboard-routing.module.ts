import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PipelineComponent } from './pipeline/pipeline.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ExchangesComponent } from './exchanges/exchanges.component';
import { PipeResolver } from '@angular/compiler';
import { LeaderboardComponent } from './leaderboard.component';
import { AuthGuardService } from '../core/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pipeline' },
      { path: 'instructions', component: InstructionsComponent },
      { path: 'pipeline', component: PipelineComponent },
      { path: 'exchanges', component: ExchangesComponent },
      // { path: 'pipeline', component: PipelineComponent, resolve: {pipelineResolver: PipeResolver} },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaderboardRoutingModule { }
