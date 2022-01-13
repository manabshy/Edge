import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
import { Story, Meta } from '@storybook/angular/types-6-0'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { SharedRewardsComponent } from './rewards.component'
import { of } from 'rxjs'

export default {
  title: 'Components/Shared/RewardsComponent',
  component: SharedRewardsComponent,
  decorators: [
    moduleMetadata({
      declarations: [SharedRewardsComponent],
      imports: [CommonModule, VendorsModule]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

const Rewards: Story<SharedRewardsComponent> = (args: SharedRewardsComponent) => ({
  component: SharedRewardsComponent,
  props: args
})

export const NoSwag = Rewards.bind({})
NoSwag.args = {
  data$: of({ rewardAmount: 10 })
}
