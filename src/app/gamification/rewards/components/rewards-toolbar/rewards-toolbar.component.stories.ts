import { RewardsToolbarComponent } from './rewards-toolbar.component'
import { Meta, Story, moduleMetadata } from '@storybook/angular'

export default {
  title: 'Rewards/Components/Toolbar',
  component: RewardsToolbarComponent,
  decorators: [
    moduleMetadata({
      declarations: [RewardsToolbarComponent],
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
