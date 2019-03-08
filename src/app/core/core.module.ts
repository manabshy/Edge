import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from './shared/rounding.pipe';
import { TruncatingPipe } from './shared/truncating.pipe';
import { ShortenNamePipe } from './shared/shorten-name.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddHeaderInterceptor } from './add-header.interceptor';
import { CacheInterceptor } from './cache.interceptor';

@NgModule({
  declarations: [RoundingPipe, TruncatingPipe, ShortenNamePipe],
  exports : [RoundingPipe, TruncatingPipe, ShortenNamePipe],
  imports: [
    CommonModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS , useClass: AddHeaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS , useClass: CacheInterceptor, multi: true}
  ]
})
export class CoreModule { }
