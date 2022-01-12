import { RewardsToolbarComponent } from './rewards-toolbar.component'
import { Meta, Story, moduleMetadata } from '@storybook/angular'
import { RewardsBonusBankComponent } from '../rewards-bonus-bank/rewards-bonus-bank.component'

export default {
  title: 'Rewards/Components/Toolbar',
  component: RewardsToolbarComponent,
  decorators: [
    moduleMetadata({
      declarations: [RewardsToolbarComponent, RewardsBonusBankComponent],
    }),
  ],
} as Meta

const Template: Story<RewardsToolbarComponent> = (
  args: RewardsToolbarComponent
) => ({
  props: args,
})

export const Primary = Template.bind({})
Primary.args = {}
