import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { CompanyComponent } from './company.component'
import { CompanyDetailComponent } from './company-detail/company-detail.component'
import { CompanyEditComponent } from './company-edit/company-edit.component'
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard'

const routes: Routes = [
  { path: '', component: CompanyComponent, data: { shouldDetach: true, title: 'Company Centre' } },
  {
    path: 'detail/:id',
    children: [
      { path: '', component: CompanyDetailComponent, data: { shouldDetach: true, title: 'Company' } },
      {
        path: 'edit',
        component: CompanyEditComponent,
        canDeactivate: [CanDeactivateGuard],
        data: { shouldDetach: false, title: ' Company Edit' }
      } // Don't cache route
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {}
