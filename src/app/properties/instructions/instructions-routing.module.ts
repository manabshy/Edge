import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { InstructionsShellComponent } from './components/instructions-shell-component/instructions-shell.component'

const routes: Routes = [
  {
    path: '',
    component: InstructionsShellComponent,
    data: { shouldDetach: true, title: 'Instructions' }
  }
 
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructionsRoutingModule {}
