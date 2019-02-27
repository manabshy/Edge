import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { PipelineComponent } from './pipeline/pipeline.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ExchangesComponent } from './exchanges/exchanges.component';

@NgModule({
  declarations: [PipelineComponent, InstructionsComponent, ExchangesComponent],
  imports: [
    CommonModule,
    LeaderboardRoutingModule
  ]
})
export class LeaderboardModule { }
