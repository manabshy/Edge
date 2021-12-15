import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
/***
 * D&G Modules
 */
import { SharedModule } from 'src/app/shared/shared.module'
import { ComponentsModule } from 'src/app/shared/components.module'
import { ContactGroupsComponentsModule } from 'src/app/contact-groups/contact-groups.components.module'

/***
 * Compliance components
 */
import { ComplianceCardComponent } from './components/compliance-card/compliance-card.component'
import { DocumentInfoComponent } from './components/document-info/document-info.component'
import { PureComplianceChecksShellComponent } from './components/pure-compliance-checks-shell/pure-compliance-checks-shell.component'
import { ComplianceChecksShellComponent } from './compliance-checks-shell.component'

const components = [
  ComplianceCardComponent,
  DocumentInfoComponent,
  PureComplianceChecksShellComponent,
  ComplianceChecksShellComponent
]

@NgModule({
  imports: [CommonModule, SharedModule, ComponentsModule, ContactGroupsComponentsModule],
  declarations: components,
  exports: components
})
export class ComplianceModule {}
