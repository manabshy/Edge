import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RewardsShellComponent } from './rewards-shell/rewards-shell.component'
import { RewardsTimerComponent } from './components/rewards-timer/rewards-timer.component'
import { RewardsToolbarComponent } from './components/rewards-toolbar/rewards-toolbar.component'
import { RewardsRowComponent } from './components/rewards-row/rewards-row.component'
import { RewardsTaskComponent } from './components/rewards-task/rewards-task.component'
import { RewardsGoal } from './components/rewards-goal/rewards-goal.component'
import { RewardsRoutingModule } from './rewards-routing.module'
import { RewardsBonusBankComponent } from './components/rewards-bonus-bank/rewards-bonus-bank.component'
import { RewardsWelcomeComponent } from './components/rewards-welcome/rewards-welcome.component'
import { SharedModule } from 'src/app/shared/shared.module'

const components = [
  RewardsShellComponent,
  RewardsTimerComponent,
  RewardsToolbarComponent,
  RewardsRowComponent,
  RewardsTaskComponent,
  RewardsGoal,
  RewardsBonusBankComponent,
  RewardsWelcomeComponent
]

@NgModule({
  declarations: components,
  imports: [CommonModule, RewardsRoutingModule, SharedModule],
  exports: components
})
export class RewardsModule {}
