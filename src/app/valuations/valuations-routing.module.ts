import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValuationsComponent } from './valuations.component';

const routes: Routes = [
  { path: '', component: ValuationsComponent, data: { shouldDetach: false } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValuationsRoutingModule { }
