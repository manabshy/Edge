import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RewardsShellComponent } from './rewards-shell/rewards-shell.component'
import { RewardsTimerComponent } from './components/rewards-timer/rewards-timer.component'
import { RewardsToolbarComponent } from './components/rewards-toolbar/rewards-toolbar.component'
import { RewardsChallengeOverviewComponent } from './components/rewards-challenge-overview/rewards-challenge-overview.component'
import { RewardsTargetComponent } from './components/rewards-target/rewards-target.component'
import { RewardsDailyTargetComponent } from './components/rewards-daily-target/rewards-daily-target.component'

const components = [
  RewardsShellComponent,
  RewardsTimerComponent,
  RewardsToolbarComponent,
  RewardsChallengeOverviewComponent,
  RewardsTargetComponent,
  RewardsDailyTargetComponent,
]

@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components,
})
export class RewardsModule {}
