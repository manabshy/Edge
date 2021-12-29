import { RewardsTimerComponent } from './rewards-timer.component'
import { Meta, Story, moduleMetadata } from '@storybook/angular'
import { CommonModule } from '@angular/common'

export default {
  title: 'Rewards/Components/Timer',
  component: RewardsTimerComponent,
  decorators: [
    moduleMetadata({
      declarations: [RewardsTimerComponent],
      // imports: [VendorsModule],
    }),
  ],
} as Meta

const Template: Story<RewardsTimerComponent> = (
  args: RewardsTimerComponent
) => ({
  props: args,
})

export const Primary = Template.bind({})
Primary.args = {}
