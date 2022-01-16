import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { action } from '@storybook/addon-actions'
import { VendorsModule } from '../../vendors.module'

// component under test
import { ButtonComponent } from './button.component'


export default {
  title: 'Components/Shared/Button',
  component: ButtonComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [ButtonComponent],
      imports: [CommonModule, VendorsModule]
    }),
    componentWrapperDecorator(
      (story) => `
        <div class="mx-auto w-full">${story}</div>
      `
    )
  ]
} as Meta

export const actionsData = {
  buttonClicked: action('buttonClicked')
}

const ButtonTemplate: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: {
    ...args,
    onClick: actionsData.buttonClicked
  }
})

export const PrimaryButton = ButtonTemplate.bind({})
PrimaryButton.args = {
  backgroundColorClass: 'ocean-green',
  label: 'Click Me',
  disabled: false,
  isSubmitting: false,
  cypressId: 'Test Button'
}

export const PrimaryButtonDisabled = ButtonTemplate.bind({})
PrimaryButtonDisabled.args = {
  backgroundColorClass: 'ocean-green',
  label: 'I\'m disabled',
  disabled: true,
  isSubmitting: false,
  cypressId: 'Test Button'
}

export const PrimaryButtonSubmitting = ButtonTemplate.bind({})
PrimaryButtonSubmitting.args = {
  backgroundColorClass: 'ocean-green',
  label: 'Im loading',
  disabled: true,
  isSubmitting: true,
  cypressId: 'Test Button'
}
