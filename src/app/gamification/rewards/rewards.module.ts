import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RewardsShellComponent } from './rewards-shell/rewards-shell.component'
import { RewardsTimerComponent } from './components/rewards-timer/rewards-timer.component'
import { RewardsToolbarComponent } from './components/rewards-toolbar/rewards-toolbar.component'
import { RewardsChallengeOverviewComponent } from './components/rewards-challenge-overview/rewards-challenge-overview.component'
import { RewardsTargetComponent } from './components/rewards-target/rewards-target.component'
import { RewardsGoal } from './components/rewards-goal/rewards-goal.component'
import { RewardsRoutingModule } from './rewards-routing.module'
import { RewardsBonusBankComponent } from './components/rewards-bonus-bank/rewards-bonus-bank.component'

const components = [
  RewardsShellComponent,
  RewardsTimerComponent,
  RewardsToolbarComponent,
  RewardsChallengeOverviewComponent,
  RewardsTargetComponent,
  RewardsGoal,
  RewardsBonusBankComponent
]

@NgModule({
  declarations: components,
  imports: [CommonModule, RewardsRoutingModule],
  exports: components,
})
export class RewardsModule {}
