import { RewardsShellComponent } from './rewards-shell.component'
import { Meta, Story, moduleMetadata } from '@storybook/angular'
import { RewardsToolbarComponent } from '../components/rewards-toolbar/rewards-toolbar.component'
import { RewardsChallengeOverviewComponent } from '../components/rewards-challenge-overview/rewards-challenge-overview.component'
import { RewardsTargetComponent } from '../components/rewards-target/rewards-target.component'
import { RewardsTimerComponent } from '../components/rewards-timer/rewards-timer.component'
import { RewardsGoal } from '../components/rewards-goal/rewards-goal.component'
import { RewardsBonusBankComponent } from '../components/rewards-bonus-bank/rewards-bonus-bank.component'

export default {
  title: 'Rewards/Shell',
  component: RewardsShellComponent,
  decorators: [
    moduleMetadata({
      declarations: [
        RewardsShellComponent,
        RewardsToolbarComponent,
        RewardsChallengeOverviewComponent,
        RewardsTargetComponent,
        RewardsTimerComponent,
        RewardsGoal,
        RewardsBonusBankComponent
      ],
    }),
  ],
} as Meta

const Template: Story<RewardsShellComponent> = (
  args: RewardsShellComponent
) => ({
  props: args,
})

export const NoProgress = Template.bind({})
NoProgress.args = {
  vm: {
    bookViewings: {
      target: 5,
      progress: 0,
    },
    conductViewings: {
      target: 3,
      progress: 0,
    },
    bookValuation: {
      target: 1,
      progress: 0,
    },
  },
}

export const PartialProgress = Template.bind({})
PartialProgress.args = {
  vm: {
    bookViewings: {
      target: 5,
      progress: 2,
    },
    conductViewings: {
      target: 3,
      progress: 1,
    },
    bookValuation: {
      target: 1,
      progress: 0,
    },
  },
}

export const PartiallyCompleted = Template.bind({})
PartiallyCompleted.args = {
  vm: {
    bookViewings: {
      target: 5,
      progress: 5,
    },
    conductViewings: {
      target: 3,
      progress: 2,
    },
    bookValuation: {
      target: 1,
      progress: 0,
    },
  },
}

export const FullyCompleted = Template.bind({})
FullyCompleted.args = {
  vm: {
    bookViewings: {
      target: 5,
      progress: 5,
    },
    conductViewings: {
      target: 3,
      progress: 3,
    },
    bookValuation: {
      target: 1,
      progress: 1,
    },
  },
}
