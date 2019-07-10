import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { PropertyComponent } from './property.component';
import { CanDeactivateGuard } from '../core/shared/can-deactivate.guard';
import { PropertyDetailComponent } from './property-detail/property-detail.component';


const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'property-centre',
    children: [
      { path: '', component: PropertyComponent },
      // { path: 'company', children: [
      //   { path: '', component: ContactgroupsCompanyEditComponent }
      // ] },
      { path: 'detail/:id',
      children: [
        { path: '', component: PropertyDetailComponent }
        // {path: 'edit', component: CompanyEditComponent, canDeactivate: [CanDeactivateGuard]},
      ] }
    ]
  }

]}]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
