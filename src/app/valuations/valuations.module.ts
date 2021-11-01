import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../shared/shared.module'
import { CalendarSharedModule } from '../calendar-shared/calendar-shared.module'

import { ValuationsRoutingModule } from './valuations-routing.module'
import { ValuationsComponent } from './valuations.component'
import { ValuationListComponent } from './valuation-list/valuation-list.component'
import { ValuationDetailEditComponent } from './valuation-detail-edit/valuation-detail-edit.component'
import { ValuationsLandRegisterComponent } from './valuation-land-register/valuation-land-register.component'
import { CancelValuationComponent } from './cancel-valuation/cancel-valuation.component'
import { TermsOfBusinessModule } from './terms-of-business/terms-of-business.module'
import { ComplianceModule } from './compliance/compliance.module'
import { ValuationOriginComponent } from './valuation-origin/valuation-origin.component'

@NgModule({
  declarations: [
    ValuationsComponent,
    ValuationListComponent,
    ValuationDetailEditComponent,
    ValuationsLandRegisterComponent,
    CancelValuationComponent,
    ValuationOriginComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ValuationsRoutingModule,
    CalendarSharedModule,
    ComplianceModule,
    TermsOfBusinessModule
  ]
})
export class ValuationsModule {}
