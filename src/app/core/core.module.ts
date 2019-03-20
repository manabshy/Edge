import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from './shared/rounding.pipe';
import { TruncatingPipe } from './shared/truncating.pipe';
import { ShortenNamePipe } from './shared/shorten-name.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddHeaderInterceptor } from './add-header.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { BasicSearchComponent } from './basic-search/basic-search.component';
import { ReactiveFormsModule } from '@angular/forms';

// ngx bootstrap imports
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

@NgModule({
  declarations: [RoundingPipe, TruncatingPipe, ShortenNamePipe, BasicSearchComponent],
  exports : [RoundingPipe, TruncatingPipe, ShortenNamePipe, BasicSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TypeaheadModule.forRoot()
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS , useClass: AddHeaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS , useClass: CacheInterceptor, multi: true}
  ]
})
export class CoreModule { }
