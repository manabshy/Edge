import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { PureInstructionsShellComponent } from './pure-instructions-shell.component'
import { InfoService } from 'src/app/core/services/info.service'
import { APP_INITIALIZER } from '@angular/core'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { InstructionsSearchComponent } from '../components/instructions-search-component/instructions-search.component'
import { InstructionsTableComponent } from '../components/instructions-table-component/instructions-table.component'
import { LettingsTable } from '../components/instructions-table-component/instructions-table.component.stories'

export default {
  title: 'Properties/Instructions/PureInstructionsShellComponent',
  component: PureInstructionsShellComponent,
  decorators: [
    moduleMetadata({
      declarations: [PureInstructionsShellComponent, InstructionsSearchComponent, InstructionsTableComponent],
      imports: [CommonModule, VendorsModule]
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 1em">${story}</div>
      `
    )
  ]
} as Meta

function initInfo(infoService: InfoService) {
  return () => infoService.getDropdownListInfo()
}

const InstructionShell: Story<PureInstructionsShellComponent> = (args: PureInstructionsShellComponent) => ({
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
  component: PureInstructionsShellComponent,
  props: args
})

export const InstructionsShell = InstructionShell.bind({})
InstructionsShell.args = {
  vm: {
    tableType: 'LETTINGS',
    tableData: LettingsTable.args.tableData
  }
}
