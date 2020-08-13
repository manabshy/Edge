import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { SelectiveStrategyService } from './core/services/selective-strategy.service';
import { ImpersonateMemberComponent } from './impersonate-member/impersonate-member.component';

const routes: Routes = [
  { path: 'impersonate-member', component: ImpersonateMemberComponent, canActivate: [AuthGuardService] },
  {
    path: 'leads-register',
    data: { preload: true },
    loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'valuations-register',
    data: { preload: true },
    loadChildren: () => import('./valuations/valuations.module').then(m => m.ValuationsModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'property-centre',
    data: { preload: true },
    loadChildren: () => import('./property/property.module').then(m => m.PropertyModule),
    canActivate: [AuthGuardService],
  },
  {
    path: 'contact-centre',
    loadChildren: () => import('./contactgroups/contactgroups.module').then(m => m.ContactgroupsModule), canActivate: [AuthGuardService]
  },
  {
    path: 'company-centre',
    loadChildren: () => import('./company/company.module').then(m => m.CompanyModule), canActivate: [AuthGuardService]
  },
  {
    path: 'diary',
    loadChildren: () => import('./diary/diary.module').then(m => m.DiaryModule), canActivate: [AuthGuardService]
  },
  {
    path: 'admin-panel',
    loadChildren: () => import('./client-services/client-services.module').then(m => m.ClientServicesModule), canActivate: [AuthGuardService]
  },
  { path: '', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

