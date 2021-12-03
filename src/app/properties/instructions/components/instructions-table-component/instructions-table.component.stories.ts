import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { InfoService } from 'src/app/core/services/info.service'
import { APP_INITIALIZER } from '@angular/core'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { InstructionsTableComponent } from '../instructions-table-component/instructions-table.component'

export default {
  title: 'Properties/Instructions/InstructionsTableComponent',
  component: InstructionsTableComponent,
  decorators: [
    moduleMetadata({
      declarations: [InstructionsTableComponent],
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

const InstructionsTable: Story<InstructionsTableComponent> = (args: InstructionsTableComponent) => ({
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
  component: InstructionsTableComponent,
  props: args
})

export const SalesTable = InstructionsTable.bind({})
InstructionsTable.args = {
    tableType: 'SALES',
  tableData: [{
    statusLabel: 'Completed',
    address: 'Flat 103, Colehome Court, Old Brompton Road, London, SW5 0ED',
    owner: 'Mrs Constance Hepworth',
    instructionDate: '01/01/2020',
    lister: 'Edward McCull',
    marketingPrice:'£5,564,976',
    viewingStatus: '',
    marketingStatus: ''
  }]
}
