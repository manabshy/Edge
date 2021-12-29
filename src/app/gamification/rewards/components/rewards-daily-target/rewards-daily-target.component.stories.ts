import { RewardsDailyTargetComponent } from './rewards-daily-target.component'
import { Meta, Story, moduleMetadata } from '@storybook/angular'

export default {
  title: 'Rewards/Components/DailyTarget',
  component: RewardsDailyTargetComponent,
  decorators: [
    moduleMetadata({
      declarations: [RewardsDailyTargetComponent],
    }),
  ],
} as Meta

const Template: Story<RewardsDailyTargetComponent> = (
  args: RewardsDailyTargetComponent
) => ({
  props: args,
})

export const Primary = Template.bind({})
Primary.args = {}
