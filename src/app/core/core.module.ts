import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from './shared/rounding.pipe';
import { TruncatingPipe } from './shared/truncating.pipe';
import { ShortenNamePipe } from './shared/shorten-name.pipe';

@NgModule({
  declarations: [RoundingPipe, TruncatingPipe, ShortenNamePipe],
  exports : [RoundingPipe, TruncatingPipe, ShortenNamePipe],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
