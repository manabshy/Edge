import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { InfoService } from 'src/app/core/services/info.service'
import { APP_INITIALIZER } from '@angular/core'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { ProfileComponent } from './profile.component'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Shared/Components/ProfileComponent',
  component: ProfileComponent,
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      declarations: [ProfileComponent],
      imports: [CommonModule, VendorsModule]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

function initInfo(infoService: InfoService) {
  return () => infoService.getDropdownListInfo()
}

export const actionsData = {
  navigateTo: action('navigateTo')
}

const ProfileTemplate: Story<ProfileComponent> = (args: ProfileComponent) => ({
  moduleMetadata: {
    providers: [
      {
        provide: APP_INITIALIZER,
        useFactory: initInfo,
        multi: true,
        deps: [InfoService]
      }
    ]
  },
  component: ProfileComponent,
  props: {
    ...args,
    navigateTo: actionsData.navigateTo
  }
})

export const Profile = ProfileTemplate.bind({})
Profile.args = {}
