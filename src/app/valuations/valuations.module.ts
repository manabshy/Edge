import { VendorsModule } from './../shared/vendors.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/**
 * Modules
 */
import { SharedModule } from '../shared/shared.module'
import { CalendarSharedModule } from '../calendar-shared/calendar-shared.module'
import { TermsOfBusinessModule } from './terms-of-business/terms-of-business.module'
import { ComplianceModule } from './compliance/compliance.module'
import { ValuationsRoutingModule } from './valuations-routing.module'

/**
 * Valuation Components
 */
import { ValuationsComponent } from './valuations.component'
import { ValuationListComponent } from './valuation-list/valuation-list.component'
import { ValuationDetailEditComponent } from './valuation-detail-edit/valuation-detail-edit.component'
import { ValuationsLandRegisterComponent } from './valuation-land-register/valuation-land-register.component'
import { CancelValuationComponent } from './cancel-valuation/cancel-valuation.component'
import { ValuationOriginComponent } from './valuation-origin/valuation-origin.component'
import { ComponentsModule } from '../shared/components.module'

const components = [
  ValuationsComponent,
  ValuationListComponent,
  ValuationDetailEditComponent,
  ValuationsLandRegisterComponent,
  CancelValuationComponent,
  ValuationOriginComponent
]

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ComponentsModule,
    SharedModule,
    ValuationsRoutingModule,
    VendorsModule,
    CalendarSharedModule,
    ComplianceModule,
    TermsOfBusinessModule
  ]
})
export class ValuationsModule {}
