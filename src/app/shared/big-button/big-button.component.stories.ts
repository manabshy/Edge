import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions'
import { VendorsModule } from '../vendors.module';

// component under test
import { BigButtonComponent } from './big-button.component';

export default {
  title: 'Components/Shared/BigButton',
  component: BigButtonComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [BigButtonComponent],
      imports: [CommonModule, VendorsModule],
    }),
    componentWrapperDecorator((story)=> `
        <div class="mx-auto w-full">${story}</div>
      `
    )
  ],
} as Meta;

export const actionsData = {
  buttonClicked: action('buttonClicked')
}

const ButtonTemplate: Story<BigButtonComponent> = (args: BigButtonComponent) => ({
  props: {
    ...args,
    onClick: actionsData.buttonClicked
  }
});

// Lead contact stories
export const AddContact = ButtonTemplate.bind({});
AddContact.args = {
  label: 'Add Contact',
};