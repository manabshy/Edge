import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from './shared/rounding.pipe';
import { TruncatingPipe } from './shared/truncating.pipe';
import { ShortenNamePipe } from './shared/shorten-name.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddHeaderInterceptor } from './add-header.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown/';
import { CollapseModule } from 'ngx-bootstrap/collapse/';
import { TabsModule } from 'ngx-bootstrap/tabs/';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [RoundingPipe, TruncatingPipe, ShortenNamePipe, BreadcrumbComponent],
  exports: [RoundingPipe, TruncatingPipe, ShortenNamePipe, BreadcrumbComponent, BsDropdownModule,
    CollapseModule,
    TabsModule],
  imports: [
    CommonModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ]
})
export class CoreModule { }
