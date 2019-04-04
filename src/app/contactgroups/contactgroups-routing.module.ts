import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '../core/services/auth-guard.service';
import { ContactgroupsDetailComponent } from './contactgroups-detail/contactgroups-detail.component';
import { ContactGroupsComponent } from './contactgroups.component';
import { ContactgroupsPeopleComponent } from './contactgroups-people/contactgroups-people.component';

const routes: Routes = [
  { path: '', canActivate: [AuthGuardService], children: [
    { path: 'contact-centre', children: [
      { path: '', component: ContactGroupsComponent },
      { path: 'detail', children: [
        { path: '', component: ContactgroupsDetailComponent },
        { path: 'people', component: ContactgroupsPeopleComponent },
      ] },
    ] },
  ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactgroupsRoutingModule { }
