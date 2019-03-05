import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from './shared/rounding.pipe';
import { TruncatingPipe } from './shared/truncating.pipe';

@NgModule({
  declarations: [RoundingPipe, TruncatingPipe],
  exports : [RoundingPipe, TruncatingPipe],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
