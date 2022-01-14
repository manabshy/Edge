import { RewardsWelcomeComponent } from './rewards-welcome.component'
import { Meta, Story, moduleMetadata } from '@storybook/angular'
import { RewardsBonusBankComponent } from '../rewards-bonus-bank/rewards-bonus-bank.component'
import { ButtonComponent } from 'src/app/shared/components/button/button.component'

export default {
  title: 'Rewards/Components/Welcome',
  component: RewardsWelcomeComponent,
  decorators: [
    moduleMetadata({
      declarations: [RewardsWelcomeComponent, RewardsBonusBankComponent, ButtonComponent],
    }),
  ],
} as Meta

const Template: Story<RewardsWelcomeComponent> = (
  args: RewardsWelcomeComponent
) => ({
  props: args,
})

export const Initial = Template.bind({})
Initial.args = {}
