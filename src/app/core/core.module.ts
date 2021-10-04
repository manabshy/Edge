import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { RouteReuseStrategy } from '@angular/router';
import { FormatAddressPipe } from '../shared/pipes/format-address.pipe';
import { CanDeactivateGuard } from './shared/can-deactivate.guard';
import { CustomReuseStrategy } from './share/custom-reuse-strategy';

@NgModule({
  declarations: [],
  exports: [ ],
  imports: [
    CommonModule
  ],

  providers: [
    CanDeactivateGuard,
    FormatAddressPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ]
})
export class CoreModule { }
