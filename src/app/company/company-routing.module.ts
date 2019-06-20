import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { CompanyComponent } from './company.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'company-centre',
    children: [
      { path: '', component: CompanyComponent }
      // { path: 'company', children: [
      //   { path: '', component: ContactgroupsCompanyEditComponent }
      // ] },
    //   { path: 'detail/:personId',
    //   // children: [
    //   //   { path: '', component: ContactgroupsDetailComponent },
    //   //   { path: 'people/:contactGroupId', component: ContactgroupsPeopleComponent, canDeactivate: [CanDeactivateGuard] },
    //   //   {path: 'edit', component: ContactgroupsDetailEditComponent, canDeactivate: [CanDeactivateGuard]},
    //   //   // {path: 'edit:/id', component: ContactgroupsDetailEditComponent}
    //   // ] },
    // }
    ]
  },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
