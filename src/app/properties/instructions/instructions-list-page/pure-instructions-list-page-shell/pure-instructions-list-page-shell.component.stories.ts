import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { PureInstructionsListPageShellComponent } from './pure-instructions-list-page-shell.component'
import { InfoService } from 'src/app/core/services/info.service'
import { APP_INITIALIZER } from '@angular/core'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { InstructionsSearchComponent } from '../components/instructions-search-component/instructions-search.component'
import { InstructionsListComponent } from '../components/instructions-list-component/instructions-list.component'
import { LettingsTable } from '../components/instructions-list-component/instructions-list.component.stories'

export default {
  title: 'Properties/Instructions/InstructionsListPage',
  component: PureInstructionsListPageShellComponent,
  decorators: [
    moduleMetadata({
      declarations: [PureInstructionsListPageShellComponent, InstructionsSearchComponent, InstructionsListComponent],
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

const InstructionShell: Story<PureInstructionsListPageShellComponent> = (
  args: PureInstructionsListPageShellComponent
) => ({
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
  component: PureInstructionsListPageShellComponent,
  props: args
})

export const InstructionsShell = InstructionShell.bind({})
InstructionsShell.args = {
  vm: {
    tableType: 'LETTINGS',
    tableData: LettingsTable.args.tableData
  }
}
