import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0'
import { InfoService } from 'src/app/core/services/info.service'
import { APP_INITIALIZER } from '@angular/core'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { InstructionsTableComponent } from './instructions-table.component'
import { action } from '@storybook/addon-actions'
import { InstructionStatus, InstructionViewingAndMarketingStatus } from '../../../instructions.interfaces'

export default {
  title: 'Properties/Instructions/Components/InstructionsTableComponent',
  component: InstructionsTableComponent,
  excludeStories: /.*Data$/,
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

export const actionsData = {
  navigateTo: action('navigateTo')
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
  props: {
    ...args,
    navigateTo: actionsData.navigateTo
  }
})

export const SalesTable = InstructionsTable.bind({})
SalesTable.args = {
  tableType: 'SALES',
  tableData: [
    {
      instructionEventId: 12,
      status: InstructionStatus.completed,
      address: 'The Rise, Cashend Drive, Old Brompton Road, London, SW5 0ED',
      owner: 'Mrs Constance Hepworth',
      instructionDate: '01/01/2020',
      lister: 'Edward McCull',
      marketingPrice: '£5,564,976',
      viewingStatus: InstructionViewingAndMarketingStatus.stopped,
      marketingStatus: InstructionViewingAndMarketingStatus.stopped
    },
    {
      instructionEventId: 13,
      status: InstructionStatus.withdrawn,
      address: 'The Rise, Cashend Drive, Old Brompton Road, London, SW5 0ED',
      owner: 'Mrs Constance Hepworth',
      instructionDate: '01/01/2020',
      lister: 'Edward McCull',
      marketingPrice: '£5,564,976',
      viewingStatus: InstructionViewingAndMarketingStatus.stopped,
      marketingStatus: InstructionViewingAndMarketingStatus.stopped
    },
    {
      instructionEventId: 14,
      status: InstructionStatus.instructed,
      address: 'The Rise, Cashend Drive, Old Brompton Road, London, SW5 0ED',
      owner: 'Mrs Constance Hepworth',
      instructionDate: '01/01/2020',
      lister: 'Edward McCull',
      marketingPrice: '£5,564,976',
      viewingStatus: InstructionViewingAndMarketingStatus.commenced,
      marketingStatus: InstructionViewingAndMarketingStatus.commenced
    },
    {
      instructionEventId: 15,
      status: InstructionStatus.under_offer,
      address: 'The Rise, Cashend Drive, Old Brompton Road, London, SW5 0ED',
      owner: 'Mrs Constance Hepworth',
      instructionDate: '01/01/2020',
      lister: 'Edward McCull',
      marketingPrice: '£5,564,976',
      viewingStatus: InstructionViewingAndMarketingStatus.commenced,
      marketingStatus: InstructionViewingAndMarketingStatus.commenced
    },
    {
      instructionEventId: 16,
      status: InstructionStatus.under_offer_oa,
      address: 'The Rise, Cashend Drive, Old Brompton Road, London, SW5 0ED',
      owner: 'Mrs Constance Hepworth',
      instructionDate: '01/01/2020',
      lister: 'Edward McCull',
      marketingPrice: '£5,564,976',
      viewingStatus: InstructionViewingAndMarketingStatus.stopped,
      marketingStatus: InstructionViewingAndMarketingStatus.ready
    },
    {
      instructionEventId: 17,
      status: InstructionStatus.exchanged,
      address: 'The Rise, Cashend Drive, Old Brompton Road, London, SW5 0ED',
      owner: 'Mrs Constance Hepworth',
      instructionDate: '01/01/2020',
      lister: 'Edward McCull',
      marketingPrice: '£5,564,976',
      viewingStatus: InstructionViewingAndMarketingStatus.stopped,
      marketingStatus: InstructionViewingAndMarketingStatus.stopped
    },
    {
      instructionEventId: 18,
      status: InstructionStatus.tom,
      address: 'The Rise, Cashend Drive, Old Brompton Road, London, SW5 0ED',
      owner: 'Mrs Constance Hepworth',
      instructionDate: '01/01/2020',
      lister: 'Edward McCull',
      marketingPrice: '£5,564,976',
      viewingStatus: InstructionViewingAndMarketingStatus.stopped,
      marketingStatus: InstructionViewingAndMarketingStatus.ready
    }
  ]
}

export const LettingsTable = InstructionsTable.bind({})
LettingsTable.args = {
  tableType: 'LETTINGS',
  tableData: [
    {
      instructionEventId: 11,
      status: InstructionStatus.let,
      address: 'Flat 103, Colehome Court, Old Brompton Road, London, SW5 0ED',
      owner: 'Mrs Constance Hepworth',
      instructionDate: '01/01/2020',
      lister: 'Edward McCull',
      marketingPrice: '',
      viewingStatus: InstructionViewingAndMarketingStatus.stopped,
      marketingStatus: InstructionViewingAndMarketingStatus.stopped,
      longLetPrice: '',
      shortLetPrice: '£1,000pw'
    },
    {
      instructionEventId: 10,
      status: InstructionStatus.withdrawn,
      address: 'Flat A, 86 Nightingale Lane, London, SW12 8NR',
      owner: 'Mr Jonathan James',
      instructionDate: '31/10/2020',
      lister: 'Oliver Mason',
      marketingPrice: '',
      viewingStatus: InstructionViewingAndMarketingStatus.not_ready,
      marketingStatus: InstructionViewingAndMarketingStatus.ready,
      longLetPrice: '£475pw',
      shortLetPrice: ''
    },
    {
      instructionEventId: 9,
      status: InstructionStatus.instructed,
      address: 'Flat 11, The Regent, Gwynne Road, London, SW11 8GJ',
      owner: 'Mr John Gearing',
      instructionDate: '01/03/2021',
      lister: 'Mark Hutton',
      marketingPrice: '',
      viewingStatus: InstructionViewingAndMarketingStatus.commenced,
      marketingStatus: InstructionViewingAndMarketingStatus.ready,
      longLetPrice: '',
      shortLetPrice: '£500pw'
    },
    {
      instructionEventId: 8,
      status: InstructionStatus.under_offer,
      address: 'TFF\r\n100\r\nWarriner Gardens\r\nLondon\r\nSW11\r\n4DU\r\n',
      // address: 'Flat 1, Mercury Mansions, Dryburgh Road, London, SW15 1BT',
      owner: 'Mr Matthew Thompson (Beazer Bungalows)',
      instructionDate: '15/12/2019',
      lister: 'Kitty Cavendish',
      marketingPrice: '',
      viewingStatus: InstructionViewingAndMarketingStatus.not_ready,
      marketingStatus: InstructionViewingAndMarketingStatus.not_ready,
      longLetPrice: '',
      shortLetPrice: '£450pw'
    },
    {
      instructionEventId: 7,
      status: InstructionStatus.end,
      address: 'Flat 13, The Regent, Gwynne Road, London, SW11 8GJ',
      owner: 'Dr Cobalt Jackson',
      instructionDate: '01/03/2021',
      lister: 'Mark Hutton',
      marketingPrice: '',
      viewingStatus: InstructionViewingAndMarketingStatus.ready,
      marketingStatus: InstructionViewingAndMarketingStatus.commenced,
      longLetPrice: '£350pw',
      shortLetPrice: ''
    },
    {
      instructionEventId: 6,
      status: InstructionStatus.exchanged,
      address: '2468, Whodoweappreciate Road, Behind Field, London, SE3 9OI',
      owner: 'Mr Barry Keys',
      instructionDate: '15/12/2019',
      lister: 'Mark Rubber',
      marketingPrice: '',
      viewingStatus: InstructionViewingAndMarketingStatus.not_ready,
      marketingStatus: InstructionViewingAndMarketingStatus.stopped,
      longLetPrice: '£450px',
      shortLetPrice: ''
    },
    {
      instructionEventId: 5,
      status: InstructionStatus.tom,
      address: 'Flat 2b, Allsaints Avenue, Ferry Long Road, London, SW3 4ER',
      owner: 'Mrs Sandy Jackson',
      instructionDate: '03/05/2021',
      lister: 'Mary Jones',
      marketingPrice: '',
      viewingStatus: InstructionViewingAndMarketingStatus.stopped,
      marketingStatus: InstructionViewingAndMarketingStatus.not_ready,
      longLetPrice: '£1,000pw',
      shortLetPrice: ''
    }
  ]
}
