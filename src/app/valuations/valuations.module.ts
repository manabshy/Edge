import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValuationsRoutingModule } from './valuations-routing.module';
import { ValuationsComponent } from './valuations.component';
import { ValuationListComponent } from './valuation-list/valuation-list.component';
import { SharedModule } from '../shared/shared.module';
import { ValuationDetailEditComponent } from './valuation-detail-edit/valuation-detail-edit.component';

@NgModule({
  declarations: [ValuationsComponent, ValuationListComponent, ValuationDetailEditComponent],
  imports: [
    CommonModule,
    SharedModule,
    ValuationsRoutingModule
  ]
})
export class ValuationsModule { }
