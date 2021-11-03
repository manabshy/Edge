

import { moduleMetadata, componentWrapperDecorator  } from '@storybook/angular';
import { CommonModule } from '@angular/common';
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { action } from '@storybook/addon-actions'
import { VendorsModule } from '../../vendors.module';

// component under test
import { MenuComponent } from './menu.component';

export default {
  title: 'Components/Shared/Menu',
  component: MenuComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [MenuComponent],
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

const Template: Story<MenuComponent> = (args: MenuComponent) => ({
  props: {
    ...args,
    onClick: actionsData.buttonClicked
  }
});

// Lead contact stories
export const AddContact = Template.bind({});
AddContact.args = {
  label: 'Add Contact',
};