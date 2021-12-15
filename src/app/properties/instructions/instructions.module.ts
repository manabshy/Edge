import { VendorsModule } from '../../shared/vendors.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/**
 * Modules
 */
import { SharedModule } from '../../shared/shared.module'
import { InstructionsRoutingModule } from './instructions-routing.module'
import { ComponentsModule } from '../../shared/components.module'

/**
 * Instruction Components
 */
import { InstructionsShellComponent } from './instructions-list-page/instructions-shell-with-dependencies/instructions-shell.component'
import { PureInstructionsShellComponent } from './instructions-list-page/pure-instructions-shell/pure-instructions-shell.component'
import { InstructionsSearchComponent } from './instructions-list-page/components/instructions-search-component/instructions-search.component'
import { InstructionsTableComponent } from './instructions-list-page/components/instructions-table-component/instructions-table.component'
import { InstructionDetailShellComponent } from './instruction-detail-page/instruction-detail-shell.component'

const components = [
  InstructionsShellComponent,
  PureInstructionsShellComponent,
  InstructionsSearchComponent,
  InstructionsTableComponent,
  InstructionDetailShellComponent
]

@NgModule({
  declarations: components,
  imports: [CommonModule, ComponentsModule, SharedModule, InstructionsRoutingModule, VendorsModule]
})
export class InstructionsModule {}
