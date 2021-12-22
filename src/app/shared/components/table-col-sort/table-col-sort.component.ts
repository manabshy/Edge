import { Component, Input } from '@angular/core'
import { SortableColumnsForInstructions } from '../../../properties/instructions/instructions.interfaces'

@Component({
  selector: 'app-table-col-sort',
  template: `
    <i [ngClass]="setIcon()"></i>
  `
})
export class TableColumnSortComponent {
  @Input() orderBy: string
  @Input() columnId: string

  sortableColumnHeaders = SortableColumnsForInstructions

  setIcon() {
    if (this.orderBy === SortableColumnsForInstructions[this.columnId]) {
      return 'fa fa-sort-up'
    } else if (this.orderBy.includes(SortableColumnsForInstructions[this.columnId])) {
      return 'fa fa-sort-down'
    }
  }
}
