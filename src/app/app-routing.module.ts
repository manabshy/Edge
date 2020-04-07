import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { SelectiveStrategyService } from './core/services/selective-strategy.service';
import { ImpersonateMemberComponent } from './impersonate-member/impersonate-member.component';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  { path: 'impersonate-member', component: ImpersonateMemberComponent, canActivate: [AuthGuardService] },
  {
    path: 'leads-register',
    data: { preload: true },
    loadChildren: () => import('./leads/leads.module').then(m => m.LeadsModule),
    canActivate: [MsalGuard],
  },
  {
    path: 'valuations-register',
    data: { preload: true },
    loadChildren: () => import('./valuations/valuations.module').then(m => m.ValuationsModule),
    canActivate: [MsalGuard],
  },
  {
    path: 'property-centre',
    data: { preload: true },
    loadChildren: () => import('./property/property.module').then(m => m.PropertyModule),
    canActivate: [MsalGuard],
  },
  {
    path: 'contact-centre',
    loadChildren: () => import('./contactgroups/contactgroups.module').then(m => m.ContactgroupsModule), canActivate: [MsalGuard]
  },
  {
    path: 'company-centre',
    loadChildren: () => import('./company/company.module').then(m => m.CompanyModule), canActivate: [MsalGuard]
  },
  {
    path: 'diary',
    loadChildren: () => import('./diary/diary.module').then(m => m.DiaryModule), canActivate: [MsalGuard]
  },
  { path: '', component: HomeComponent, canActivate: [MsalGuard] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }

