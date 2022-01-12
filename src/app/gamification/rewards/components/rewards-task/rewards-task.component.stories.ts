import { RewardsTaskComponent } from './rewards-task.component'
import { Meta, Story, moduleMetadata, componentWrapperDecorator } from '@storybook/angular'

export default {
  title: 'Rewards/Components/Task',
  component: RewardsTaskComponent,
  decorators: [
    moduleMetadata({
      declarations: [RewardsTaskComponent]
    }),
    componentWrapperDecorator(
      (story) => `
        <div class="m-10 w-full md:w-1/4 mx-auto shadow-md">${story}</div>
      `
    )
  ]
} as Meta

const Template: Story<RewardsTaskComponent> = (args: RewardsTaskComponent) => ({
  props: args
})

export const BookViewingsInitialState = Template.bind({})
BookViewingsInitialState.args = {
  target: 5,
  progress: 0,
  action: 'bookViewings'
}

export const BookViewingsPartialProgress = Template.bind({})
BookViewingsPartialProgress.args = {
  target: 5,
  progress: 3,
  action: 'bookViewings'
}

export const BookViewingsTargetHit = Template.bind({})
BookViewingsTargetHit.args = {
  target: 5,
  progress: 5,
  action: 'bookViewings'
}

export const ConductViewingsInitialState = Template.bind({})
ConductViewingsInitialState.args = {
  target: 3,
  progress: 0,
  action: 'conductViewings'
}

export const ConductViewingsPartialProgress = Template.bind({})
ConductViewingsPartialProgress.args = {
  target: 3,
  progress: 1,
  action: 'conductViewings'
}

export const ConductViewingsTargetHit = Template.bind({})
ConductViewingsTargetHit.args = {
  target: 3,
  progress: 3,
  action: 'conductViewings'
}

export const ValuationsInitialState = Template.bind({})
ValuationsInitialState.args = {
  target: 1,
  progress: 0,
  action: 'bookValuation'
}

export const ValuationsTargetHit = Template.bind({})
ValuationsTargetHit.args = {
  target: 1,
  progress: 1,
  action: 'bookValuation'
}
