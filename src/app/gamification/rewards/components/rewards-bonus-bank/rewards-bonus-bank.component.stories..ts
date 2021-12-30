import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
import { Story, Meta } from '@storybook/angular/types-6-0'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { RewardsBonusBankComponent } from './rewards-bonus-bank.component'
import { of } from 'rxjs'

export default {
  title: 'Rewards/Components/BonusBank',
  component: RewardsBonusBankComponent,
  decorators: [
    moduleMetadata({
      declarations: [RewardsBonusBankComponent],
      imports: [CommonModule, VendorsModule]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

const Rewards: Story<RewardsBonusBankComponent> = (args: RewardsBonusBankComponent) => ({
  component: RewardsBonusBankComponent,
  props: args
})

export const NoSwag = Rewards.bind({})
NoSwag.args = {
  data$: of({ rewardAmount: 10 })
}
