import { RewardsShellComponent } from './rewards-shell.component'
import { Meta, Story, moduleMetadata } from '@storybook/angular'
import { RewardsToolbarComponent } from '../components/rewards-toolbar/rewards-toolbar.component'
import { RewardsRowComponent } from '../components/rewards-row/rewards-row.component'
import { RewardsTaskComponent } from '../components/rewards-task/rewards-task.component'
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
        RewardsRowComponent,
        RewardsTaskComponent,
        RewardsTimerComponent,
        RewardsGoal,
        RewardsBonusBankComponent
      ]
    })
  ]
} as Meta

const Template: Story<RewardsShellComponent> = (args: RewardsShellComponent) => ({
  props: args
})

export const NoProgress = Template.bind({})
vm2: [
  {
    name: 'Daily Bonus',
    timeWindow: 1,
    bonusDetailCriteria: [
      {
        completed : 0,
        iconId: 3,
        target: 3
      }
    ]
  }
]

NoProgress.args = {
  vm: {
    daily: {
      title: 'day',
      bookViewings: {
        target: 5,
        progress: 0
      },
      conductViewings: {
        target: 3,
        progress: 0
      },
      bookValuation: {
        target: 1,
        progress: 0
      },
      bonusAmount: 50
    },
    weekly: {
      title: 'week',
      bookViewings: {
        target: 20,
        progress: 0
      },
      conductViewings: {
        target: 12,
        progress: 0
      },
      bookValuation: {
        target: 4,
        progress: 0
      },
      bonusAmount: 150
    },
    monthly: {
      title: 'month',
      bookViewings: {
        target: 50,
        progress: 0
      },
      conductViewings: {
        target: 30,
        progress: 0
      },
      bookValuation: {
        target: 10,
        progress: 0
      },
      bonusAmount: 1000
    }
  }
}

export const PartialProgress = Template.bind({})
PartialProgress.args = {
  vm: {
    daily: {
      title: 'day',
      bookViewings: {
        target: 5,
        progress: 2
      },
      conductViewings: {
        target: 3,
        progress: 1
      },
      bookValuation: {
        target: 1,
        progress: 0
      },
      bonusAmount: 50
    },
    weekly: {
      title: 'week',
      bookViewings: {
        target: 20,
        progress: 0
      },
      conductViewings: {
        target: 12,
        progress: 0
      },
      bookValuation: {
        target: 4,
        progress: 0
      },
      bonusAmount: 150
    },
    monthly: {
      title: 'month',
      bookViewings: {
        target: 50,
        progress: 0
      },
      conductViewings: {
        target: 30,
        progress: 0
      },
      bookValuation: {
        target: 10,
        progress: 0
      },
      bonusAmount: 1000
    }
  }
}

export const PartiallyCompleted = Template.bind({})
PartiallyCompleted.args = {
  vm: {
    daily: {
      title: 'day',
      bookViewings: {
        target: 5,
        progress: 5
      },
      conductViewings: {
        target: 3,
        progress: 2
      },
      bookValuation: {
        target: 1,
        progress: 0
      },
      bonusAmount: 50
    },
    weekly: {
      title: 'week',
      bookViewings: {
        target: 20,
        progress: 0
      },
      conductViewings: {
        target: 12,
        progress: 0
      },
      bookValuation: {
        target: 4,
        progress: 0
      },
      bonusAmount: 150
    },
    monthly: {
      title: 'month',
      bookViewings: {
        target: 50,
        progress: 0
      },
      conductViewings: {
        target: 30,
        progress: 0
      },
      bookValuation: {
        target: 10,
        progress: 0
      },
      bonusAmount: 1000
    }
  }
}

export const FullyCompleted = Template.bind({})
FullyCompleted.args = {
  vm: {
    daily: {
      title: 'day',
      bookViewings: {
        target: 5,
        progress: 5
      },
      conductViewings: {
        target: 3,
        progress: 3
      },
      bookValuation: {
        target: 1,
        progress: 1
      },
      bonusAmount: 50
    },
    weekly: {
      title: 'week',
      bookViewings: {
        target: 20,
        progress: 0
      },
      conductViewings: {
        target: 12,
        progress: 0
      },
      bookValuation: {
        target: 4,
        progress: 0
      },
      bonusAmount: 150
    },
    monthly: {
      title: 'month',
      bookViewings: {
        target: 50,
        progress: 0
      },
      conductViewings: {
        target: 30,
        progress: 0
      },
      bookValuation: {
        target: 10,
        progress: 0
      },
      bonusAmount: 1000
    }
  }
}
