import { moduleMetadata, componentWrapperDecorator } from '@storybook/angular'
import { CommonModule } from '@angular/common'
import { Story, Meta } from '@storybook/angular/types-6-0'
import { VendorsModule } from 'src/app/shared/vendors.module'
import { TableColumnSortComponent } from './table-col-sort.component'

export default {
  title: 'Components/Shared/TableColumnSortComponent',
  component: TableColumnSortComponent,
  decorators: [
    moduleMetadata({
      declarations: [TableColumnSortComponent],
      imports: [CommonModule, VendorsModule]      
    }),
    componentWrapperDecorator(
      (story) => `
        <div style="margin: 3em">${story}</div>
      `
    )
  ]
} as Meta

const TableColSort: Story<TableColumnSortComponent> = (args: TableColumnSortComponent) => ({
  component: TableColumnSortComponent,
  props: args,   
})

export const Asc = TableColSort.bind({})
Asc.args = {
  orderBy: 'instructionDate',
  columnId: 'instructionDate'
}

export const Desc = TableColSort.bind({})
Desc.args = {
  orderBy: '-instructionDate',
  columnId: 'instructionDate'
}
