import { RewardsGoal } from './rewards-goal.component'
import { Meta, Story, moduleMetadata, componentWrapperDecorator } from '@storybook/angular'

export default {
  title: 'Rewards/Components/Goal',
  component: RewardsGoal,
  decorators: [
    moduleMetadata({
      declarations: [RewardsGoal],
    }),
    componentWrapperDecorator(
      (story) => `
        <div class="m-10 w-full md:w-1/4 mx-auto shadow-md">${story}</div>
      `
    )
  ],
} as Meta

const Template: Story<RewardsGoal> = (
  args: RewardsGoal
) => ({
  props: args,
})

export const Primary = Template.bind({})
Primary.args = {}
