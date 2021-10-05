import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '../../shared/shared.module'
import { ComplianceCardComponent } from "./components/compliance-card/compliance-card.component"
import { DocumentInfoComponent } from "./components/document-info/document-info.component"
import { PureComplianceChecksShellComponent } from "./components/pure-compliance-checks-shell/pure-compliance-checks-shell.component"
import { ComplianceChecksShellComponent } from "./compliance-checks-shell.component"
import { ContactGroupsComponentsModule } from '../../contact-groups/contact-groups.components.module'

const components = [
  ComplianceCardComponent,
  DocumentInfoComponent,
  PureComplianceChecksShellComponent,
  ComplianceChecksShellComponent
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContactGroupsComponentsModule
  ],
  declarations: [
   components
  ],
  exports: [
    components
  ]
})
export class ComplianceModule { }
