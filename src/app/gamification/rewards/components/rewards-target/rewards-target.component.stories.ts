import { RewardsTargetComponent } from './rewards-target.component'
import { Meta, Story, moduleMetadata } from '@storybook/angular'

export default {
  title: 'Rewards/Components/Target',
  component: RewardsTargetComponent,
  decorators: [
    moduleMetadata({
      declarations: [RewardsTargetComponent],
    }),
  ],
} as Meta

const Template: Story<RewardsTargetComponent> = (
  args: RewardsTargetComponent
) => ({
  props: args,
})

export const BookViewingsInitialState = Template.bind({})
BookViewingsInitialState.args = {
  target: 5,
  progress: 0,
  action: 'bookViewings',
}

export const BookViewingsPartialProgress = Template.bind({})
BookViewingsPartialProgress.args = {
  target: 5,
  progress: 3,
  action: 'bookViewings',
}

export const BookViewingsTargetHit = Template.bind({})
BookViewingsTargetHit.args = {
  target: 5,
  progress: 5,
  action: 'bookViewings',
}

export const ConductViewingsInitialState = Template.bind({})
ConductViewingsInitialState.args = {
  target: 3,
  progress: 0,
  action: 'conductViewings',
}

export const ConductViewingsPartialProgress = Template.bind({})
ConductViewingsPartialProgress.args = {
  target: 3,
  progress: 1,
  action: 'conductViewings',
}

export const ConductViewingsTargetHit = Template.bind({})
ConductViewingsTargetHit.args = {
  target: 3,
  progress: 3,
  action: 'conductViewings',
}

export const ValuationsInitialState = Template.bind({})
ValuationsInitialState.args = {
  target: 1,
  progress: 0,
  action: 'bookValuation',
}

export const ValuationsTargetHit = Template.bind({})
ValuationsTargetHit.args = {
  target: 1,
  progress: 1,
  action: 'bookValuation',
}
