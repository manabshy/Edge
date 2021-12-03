import { VendorsModule } from '../../shared/vendors.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/**
 * Modules
 */
import { SharedModule } from '../../shared/shared.module'
import { InstructionsRoutingModule } from './instructions-routing.module'

/**
 * Instruction Components
 */
import { InstructionsShellComponent } from './components/instructions-shell-component/instructions-shell.component'
import { PureInstructionsShellComponent } from './components/pure-instructions-shell-component/pure-instructions-shell.component'
import { InstructionsSearchComponent } from './components/instructions-search-component/instructions-search.component'
import { InstructionsTableComponent } from './components/instructions-table-component/instructions-table.component'
import { ComponentsModule } from '../../shared/components.module'

const components = [
  InstructionsShellComponent,
  PureInstructionsShellComponent,
  InstructionsSearchComponent,
  InstructionsTableComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    InstructionsRoutingModule,
    VendorsModule
  ]
})
export class InstructionsModule {}
