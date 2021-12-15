import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { InstructionsSearchComponent } from './instructions-search.component'
import { InfoService } from 'src/app/core/services/info.service'
import { APP_INITIALIZER } from '@angular/core'
import { VendorsModule } from 'src/app/shared/vendors.module'

export default {
  title: 'Properties/Instructions/Components/InstructionsSearchComponent',
  component: InstructionsSearchComponent,
  decorators: [
    moduleMetadata({
      declarations: [InstructionsSearchComponent],
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

const InstructionSearch: Story<InstructionsSearchComponent> = (args: InstructionsSearchComponent) => ({
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
  component: InstructionsSearchComponent,
  props: args
})

export const EmptySearch = InstructionSearch.bind({})
InstructionSearch.args = {
  
}
