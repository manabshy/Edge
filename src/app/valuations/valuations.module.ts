import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ValuationsRoutingModule } from "./valuations-routing.module";
import { ValuationsComponent } from "./valuations.component";
import { ValuationListComponent } from "./valuation-list/valuation-list.component";
import { SharedModule } from "../shared/shared.module";
import { ValuationDetailEditComponent } from "./valuation-detail-edit/valuation-detail-edit.component";
import { CalendarSharedModule } from "../calendar-shared/calendar-shared.module";
import { ValuationsTermsOfBusinessComponent } from "./valuations-terms-of-business/valuations-terms-of-business.component";
import { TermsOfBusinessTableSalesComponent } from './shared/terms-of-business-tables/sales/terms-of-business-sales-table.component';
import { TermsOfBusinessTableLettingsComponent } from './shared/terms-of-business-tables/lettings/terms-of-business-lettings-table.component';

@NgModule({
  declarations: [
    ValuationsComponent,
    ValuationListComponent,
    ValuationDetailEditComponent,
    ValuationsTermsOfBusinessComponent,
    TermsOfBusinessTableSalesComponent,
    TermsOfBusinessTableLettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ValuationsRoutingModule,
    CalendarSharedModule,
  ],
})
export class ValuationsModule {}
