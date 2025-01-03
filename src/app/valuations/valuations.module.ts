import { VendorsModule } from './../shared/vendors.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

/**
 * Modules
 */
import { SharedModule } from '../shared/shared.module'
import { CalendarSharedModule } from '../calendar-shared/calendar-shared.module'
import { TermsOfBusinessModule } from './valuation-detail-page/cards/terms-of-business/terms-of-business.module'
import { ComplianceModule } from './valuation-detail-page/cards/compliance-checks/compliance.module'
import { ValuationsRoutingModule } from './valuations-routing.module'
import { ComponentsModule } from '../shared/components.module'

/**
 * Valuation Components
 */
import { ValuationsShellComponent } from './valuations-list-page/valuations-shell-with-dependencies/valuations.component'
import { ValuationsListComponent } from './valuations-list-page/components/valuations-list/valuation-list.component'
import { ValuationDetailEditComponent } from './valuation-detail-page/valuation-detail-edit/valuation-detail-edit.component'
import { ValuationsLandRegisterComponent } from './valuation-detail-page/cards/valuation-land-register/valuation-land-register.component'
import { CancelValuationComponent } from './valuation-detail-page/dialogs/cancel-valuation/cancel-valuation.component'
import { ValuationOriginComponent } from './valuation-detail-page/cards/valuation-origin/valuation-origin.component'
import { PropertyInfoComponent } from './valuation-detail-page/cards/property-info/property-info.component'
import { PureValuationsListPageShellComponent } from './valuations-list-page/pure-valuations-shell/pure-valuations-list-page-shell.component'
import { ValuationsSearchComponent } from './valuations-list-page/components/valuations-search/valuations-search.component'

const components = [
  ValuationsShellComponent,
  ValuationsListComponent,
  ValuationDetailEditComponent,
  ValuationsLandRegisterComponent,
  CancelValuationComponent,
  ValuationOriginComponent,
  PropertyInfoComponent,
  PureValuationsListPageShellComponent,
  ValuationsSearchComponent
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
