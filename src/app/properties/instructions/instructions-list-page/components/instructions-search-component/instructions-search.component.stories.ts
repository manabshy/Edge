import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { Story, Meta } from '@storybook/angular/types-6-0'
import { InstructionsSearchComponent } from './instructions-search.component'
import { InfoService } from 'src/app/core/services/info.service'
// import { APP_INITIALIZER } from '@angular/core'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { within, userEvent } from '@storybook/testing-library'
import { MessageService } from 'primeng/api'
import { ReactiveFormsModule, FormBuilder } from '@angular/forms'
import { GenericMultiSelectControlComponent } from 'src/app/shared/generic-multi-select-control/generic-multi-select-control.component'
import { ComponentsModule } from 'src/app/shared/components.module'

export default {
  title: 'Properties/Instructions/Components/InstructionsSearchComponent',
  component: InstructionsSearchComponent,
  decorators: [
    moduleMetadata({
      declarations: [InstructionsSearchComponent],
      imports: [CommonModule, VendorsModule, BrowserAnimationsModule, ReactiveFormsModule, ComponentsModule],
      providers: [FormBuilder]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

// function initInfo(infoService: InfoService) {
//   return () => infoService.getDropdownListInfo()
// }

const InstructionSearch: Story<InstructionsSearchComponent> = (args: InstructionsSearchComponent) => ({
  moduleMetadata: {
    providers: [
      // {
      //   provide: APP_INITIALIZER,
      //   useFactory: initInfo,
      //   multi: true,
      //   deps: [InfoService]
      // }
      MessageService
    ]
  },
  component: InstructionsSearchComponent,
  props: args,
    // ...args,
    // argTypes: { onGetInstructions: { action: true } }
  // },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.type(canvas.getByTestId('instructionSearch'), 'dbeazer@dng.co.uk')
    // await userEvent.type(canvas.getByTestId('password1'), 'k32904n£#1kjad', { delay: 50 })
    // await userEvent.type(canvas.getByTestId('password2'), 'k32904n£#1kjad', { delay: 50 })
    await userEvent.click(canvas.getByTestId('submit'))
  }
})

export const EmptySearch = InstructionSearch.bind({})
InstructionSearch.args = {
  // searchSuggestions: [],
  searchStats: {
    queryCount: true,
    pageLength: 20,
    queryResultCount:100
  }
}
