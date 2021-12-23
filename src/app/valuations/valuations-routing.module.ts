import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ValuationsShellComponent } from './valuations-list-page/valuations-shell-with-dependencies/valuations.component'
import { ValuationDetailEditComponent } from './valuation-detail-page/valuation-detail-edit/valuation-detail-edit.component'
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard'

const routes: Routes = [
  {
    path: '',
    component: ValuationsShellComponent,
    data: { shouldDetach: true, title: 'Valuations' }
  },
  {
    path: 'detail/:id',
    children: [
      {
        path: 'edit',
        component: ValuationDetailEditComponent,
        data: {
          shouldDetach: false,
          title: 'Valuation',
          showMenuEditItem: true
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'cancelled',
        component: ValuationDetailEditComponent,
        data: {
          shouldDetach: false,
          title: 'Valuation',
          showMenuEditItem: false
        },
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'instructed',
        component: ValuationDetailEditComponent,
        data: {
          shouldDetach: false,
          title: 'Valuation',
          showMenuEditItem: false
        },
        canDeactivate: [CanDeactivateGuard]
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValuationsRoutingModule {}
