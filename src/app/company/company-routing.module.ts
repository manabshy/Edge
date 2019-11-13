import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { CompanyComponent } from './company.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';

const routes: Routes = [
  { path: '', component: CompanyComponent, data: { shouldDetach: true } },
  {
    path: 'detail/:id',
    children: [
      { path: 'edit', component: CompanyEditComponent, canDeactivate: [CanDeactivateGuard] },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
