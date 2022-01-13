import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { InstructionsShellComponent } from './instructions-list-page/instructions-shell-with-dependencies/instructions-shell.component'
import { InstructionDetailShellComponent } from './instruction-detail-page/instruction-detail-shell.component'

const routes: Routes = [
  {
    path: '',
    component: InstructionsShellComponent,
    data: { shouldDetach: true, title: 'Instructions' },
    children: [
      {
        path: 'detail/:id',
        component: InstructionDetailShellComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructionsRoutingModule {}
