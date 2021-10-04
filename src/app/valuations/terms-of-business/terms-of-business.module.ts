import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { TermsOfBusinessComponent } from "./terms-of-business.component";
import { TermsOfBusinessTableSalesComponent } from "./components/tables/sales/terms-of-business-sales-table.component";
import { TermsOfBusinessTableLettingsComponent } from "./components/tables/lettings/terms-of-business-lettings-table.component";

const components = [
  TermsOfBusinessComponent,
  TermsOfBusinessTableSalesComponent,
  TermsOfBusinessTableLettingsComponent,
];
@NgModule({
  declarations: [components],
  imports: [CommonModule, SharedModule],
  exports: [components],
})
export class TermsOfBusinessModule {}
