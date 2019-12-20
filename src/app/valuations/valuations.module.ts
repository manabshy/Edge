import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValuationsRoutingModule } from './valuations-routing.module';
import { ValuationsComponent } from './valuations.component';
import { ValuationListComponent } from './valuation-list/valuation-list.component';

@NgModule({
  declarations: [ValuationsComponent, ValuationListComponent],
  imports: [
    CommonModule,
    ValuationsRoutingModule
  ]
})
export class ValuationsModule { }
