import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PipelineComponent } from './pipeline/pipeline.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ExchangesComponent } from './exchanges/exchanges.component';
import { PipeResolver } from '@angular/compiler';

const routes: Routes = [
  { path: 'instructions', component: InstructionsComponent },
  { path: 'pipeline', component: PipelineComponent },
 // { path: 'pipeline', component: PipelineComponent, resolve: {pipelineResolver: PipeResolver} },
  { path: 'exchanges', component: ExchangesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeaderboardRoutingModule { }
