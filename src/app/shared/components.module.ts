import { NgModule } from "@angular/core";
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";

// Pipes
import { RoundingPipe } from "./pipes/rounding.pipe";
import { TruncatingPipe } from "./pipes/truncating.pipe";
import { ShortenNamePipe } from "./pipes/shorten-name.pipe";
import { FormatAddressPipe } from "./pipes/format-address.pipe";
import { HighlightPipe } from "./pipes/highlight.pipe";
import { BracketsNewLinePipe } from "./pipes/brackets-new-line.pipe";
import { ToPascalCasePipe } from "./pipes/to-pascal-case.pipe";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
// Directives
import { AutocompleteOffDirective } from "./directives/autocomplete-off.directive";
import { NoDoubleTapDirective } from "./directives/no-double-tap.directive";
// Components
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { NoteModalComponent } from "./note-modal/note-modal.component";
import { NotesComponent } from "./notes/notes.component";
import { SmsModalComponent } from "./sms-modal/sms-modal.component";
import { ConfirmModalComponent } from "./confirm-modal/confirm-modal.component";
import { ErrorModalComponent } from "./error-modal/error-modal.component";
import { PropertyFinderComponent } from "./property-finder/property-finder.component";
import { ScoreBadgeComponent } from "./score-badge/score-badge.component";
import { AddressComponent } from "./address/address.component";
import { SignerComponent } from "./signer/signer.component";
import { TelephoneComponent } from "./telephone/telephone.component";
import { TelephoneModalComponent } from "./telephone-modal/telephone-modal.component";
import { SubnavComponent } from "./subnav/subnav.component";
import { SubnavItemComponent } from "./subnav-item/subnav-item.component";
import { PersonDetailsComponent } from "./person-details/person-details.component";
import { CompanyInfoComponent } from "./company-info/company-info.component";
import { NoteFormComponent } from "./note-form/note-form.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ContactgroupsDetailHomeHelperComponent } from "../shared/contactgroups-detail-home-helper/contactgroups-detail-home-helper.component";
import { ContactgroupsDetailInstructionsComponent } from "../shared/contactgroups-detail-instructions/contactgroups-detail-instructions.component";
import { ContactgroupsDetailOffersComponent } from "../shared/contactgroups-detail-offers/contactgroups-detail-offers.component";
import { ContactgroupsDetailLeadsComponent } from "../shared/contactgroups-detail-leads/contactgroups-detail-leads.component";
import { ContactgroupsDetaillettingsManagementsComponent } from "../shared/contactgroups-detail-lettings-managements/contactgroups-detail-lettings-managements.component";
import { ContactgroupsDetailValuationsComponent } from "../shared/contactgroups-detail-valuations/contactgroups-detail-valuations.component";
import { ContactgroupsDetailTenanciesComponent } from "../shared/contactgroups-detail-tenancies/contactgroups-detail-tenancies.component";
import { ContactgroupsDetailSearchesComponent } from "../shared/contactgroups-detail-searches/contactgroups-detail-searches.component";
import { SharedPropertyListComponent } from "./shared-property-list/shared-property-list.component";
import { SharedLeadRegisterComponent } from "./shared-lead-register/shared-lead-register.component";
import { AdditionalInfoComponent } from "./additional-info/additional-info.component";
import { SharedValuationListComponent } from "./shared-valuation-list/shared-valuation-list.component";
import { OfficeFinderComponent } from "./office-finder/office-finder.component";
import { StaffMemberFinderComponent } from "./staff-member-finder/staff-member-finder.component";
import { SharedContactgroupListComponent } from "./shared-contactgroup-list/shared-contactgroup-list.component";
import { SidenavItemComponent } from "./components/sidenav-item/sidenav-item.component";
import { RedactedTableComponent } from "./components/redacted-table/redacted-table.component";
import { PropertyCardComponent } from "./components/property-card/property-card.component";
import { ContactgroupCardComponent } from "./components/contactgroup-card/contactgroup-card.component";
import { MarketingPreferencesComponent } from "./components/marketing-preferences/marketing-preferences.component";
import { PropertyDetailPhotosComponent } from "./components/property-detail-photos/property-detail-photos.component";
import { PropertyDetailMapComponent } from "./components/property-detail-map/property-detail-map.component";
import { ContactgroupFinderComponent } from "./components/contactgroup-finder/contactgroup-finder.component";
import { ImportantMessagesComponent } from "./components/important-messages/important-messages.component";
import { EmailComponent } from "./components/email/email.component";
import { EmailSignatureComponent } from "./components/email-signature/email-signature.component";
import { RedactedCardComponent } from "./components/redacted-card/redacted-card.component";
import { CompanyFinderComponent } from "./components/company-finder/company-finder.component";
import { InfiniteScrollComponent } from "./components/infinite-scroll/infinite-scroll.component";
import { GenericMultiSelectControlComponent } from "./generic-multi-select-control/generic-multi-select-control.component";
import { ConfirmationService, MessageService } from "primeng/api";
import { DialogService } from "primeng/dynamicdialog";
import { ContactComplianceCardComponent } from "./contact-compliance-card/contact-compliance-card.component";
import { DocumentInfoComponent } from "./document-info/document-info.component";
import { ComplianceChecksShellComponent } from "./compliance-checks-shell/compliance-checks-shell.component";
import { MessagesComponent } from './messages/messages.component'
import { FileUploadComponent } from "./components/file-upload/file-upload.component";
import { FileListComponent } from "./components/file-list/file-list.component";
import { BigButtonComponent } from './big-button/big-button.component'

// Vendors module
import { VendorsModule } from "./vendors.module";

const components = [
  BreadcrumbComponent,
  ConfirmModalComponent,
  PropertyFinderComponent,
  ScoreBadgeComponent,
  ErrorModalComponent,
  AddressComponent,
  SignerComponent,
  NoteModalComponent,
  NotesComponent,
  TelephoneComponent,
  TelephoneModalComponent,
  SubnavItemComponent,
  SubnavComponent,
  SmsModalComponent,
  PersonDetailsComponent,
  CompanyInfoComponent,
  NoteFormComponent,
  ContactgroupsDetailHomeHelperComponent,
  ContactgroupsDetailInstructionsComponent,
  ContactgroupsDetailOffersComponent,
  ContactgroupsDetailLeadsComponent,
  ContactgroupsDetaillettingsManagementsComponent,
  ContactgroupsDetailValuationsComponent,
  ContactgroupsDetailTenanciesComponent,
  ContactgroupsDetailSearchesComponent,
  SharedPropertyListComponent,
  SharedLeadRegisterComponent,
  AdditionalInfoComponent,
  SharedValuationListComponent,
  OfficeFinderComponent,
  StaffMemberFinderComponent,
  SharedContactgroupListComponent,
  SidenavItemComponent,
  RedactedTableComponent,
  PropertyCardComponent,
  ContactgroupCardComponent,
  MarketingPreferencesComponent,
  PropertyDetailPhotosComponent,
  PropertyDetailMapComponent,
  ContactgroupFinderComponent,
  ImportantMessagesComponent,
  EmailComponent,
  EmailSignatureComponent,
  RedactedCardComponent,
  CompanyFinderComponent,
  InfiniteScrollComponent,
  GenericMultiSelectControlComponent,
  ContactComplianceCardComponent,
  DocumentInfoComponent,
  ComplianceChecksShellComponent,
  MessagesComponent,
  FileUploadComponent,
  FileListComponent,
  BigButtonComponent
];
const pipes = [
  RoundingPipe,
  TruncatingPipe,
  ShortenNamePipe,
  FormatAddressPipe,
  HighlightPipe,
  BracketsNewLinePipe,
  ToPascalCasePipe,
  SafeHtmlPipe,
];
const directives = [AutocompleteOffDirective, NoDoubleTapDirective];

@NgModule({
  declarations: [components, pipes, directives],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    VendorsModule,
  ],
  exports: [VendorsModule, components, pipes, directives],
  providers: [
    ConfirmationService,
    DialogService,
    MessageService,
    DatePipe,
    CurrencyPipe,
  ],
  entryComponents: [
    ConfirmModalComponent,
    ErrorModalComponent,
    NoteModalComponent,
    TelephoneModalComponent,
    SmsModalComponent,
  ],
})
export class ComponentsModule {}
