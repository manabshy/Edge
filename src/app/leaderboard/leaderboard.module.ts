import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { PipelineComponent } from './pipeline/pipeline.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { ExchangesComponent } from './exchanges/exchanges.component';
import { CoreModule } from '../core/core.module';
import { LeaderboardTabsComponent } from './leaderboard-tabs/leaderboard-tabs.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [PipelineComponent, InstructionsComponent, ExchangesComponent, LeaderboardTabsComponent],
  exports : [PipelineComponent, InstructionsComponent, ExchangesComponent,LeaderboardTabsComponent],
  imports: [
    CommonModule,
    LeaderboardRoutingModule,
    SharedModule,
    // CoreModule,
    InfiniteScrollModule
  ]
})
export class LeaderboardModule { }
