import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdalService, AdalInterceptor } from 'adal-angular4';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login/login.component';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  declarations: [LoginComponent, AuthCallbackComponent],
  exports: [LoginComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    AccountRoutingModule
  ],
  providers: [ AdalService,
    { provide: HTTP_INTERCEPTORS, useClass: AdalInterceptor, multi: true }]
})
export class AccountModule { }
