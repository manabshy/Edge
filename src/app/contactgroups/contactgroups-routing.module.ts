import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactGroupsComponent } from './contactgroups.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';
import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit/contactgroups-detail-edit.component';
import { ContactgroupsCompanyEditComponent } from './contactgroups-company-edit/contactgroups-company-edit.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'contact-centre',
    children: [
      { path: '', component: ContactGroupsComponent },
      { path: 'company', children: [
        { path: '', component: ContactgroupsCompanyEditComponent }
      ] },
      { path: 'detail/:personId',
      children: [
        { path: '', component: ContactgroupsDetailComponent },
        { path: 'people/:contactGroupId', component: ContactgroupsPeopleComponent },
        {path: 'edit', component: ContactgroupsDetailEditComponent},
        // {path: 'edit:/id', component: ContactgroupsDetailEditComponent}
      ] },
    ] },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactgroupsRoutingModule { }
