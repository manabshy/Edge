import { NgModule } from '@angular/core'
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common'

// Pipes
import { RoundingPipe } from './pipes/rounding.pipe'
import { TruncatingPipe } from './pipes/truncating.pipe'
import { ShortenNamePipe } from './pipes/shorten-name.pipe'
import { FormatAddressPipe } from './pipes/format-address.pipe'
import { HighlightPipe } from './pipes/highlight.pipe'
import { BracketsNewLinePipe } from './pipes/brackets-new-line.pipe'
import { ToPascalCasePipe } from './pipes/to-pascal-case.pipe'
import { SafeHtmlPipe } from './pipes/safe-html.pipe'
// Directives
import { AutocompleteOffDirective } from './directives/autocomplete-off.directive'
import { NoDoubleTapDirective } from './directives/no-double-tap.directive'
import { OnlyNumbersDirective } from './directives/only-numbers.directive'
// Components
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component'
import { NoteModalComponent } from './note-modal/note-modal.component'
import { NotesComponent } from './notes/notes.component'
import { SmsModalComponent } from './sms-modal/sms-modal.component'
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component'
import { ErrorModalComponent } from './error-modal/error-modal.component'
import { PropertyFinderComponent } from './property-finder/property-finder.component'
import { ScoreBadgeComponent } from './score-badge/score-badge.component'
import { AddressComponent } from './address/address.component'
import { SignerComponent } from './signer/signer.component'
import { TelephoneComponent } from './telephone/telephone.component'
import { TelephoneModalComponent } from './telephone-modal/telephone-modal.component'
import { SubnavComponent } from './subnav/subnav.component'
import { SubnavItemComponent } from './subnav-item/subnav-item.component'
import { PersonDetailsComponent } from './person-details/person-details.component'
import { CompanyInfoComponent } from './company-info/company-info.component'
import { NoteFormComponent } from './note-form/note-form.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { ContactgroupsDetailHomeHelperComponent } from './contact-groups-detail-home-helper/contact-groups-detail-home-helper.component'
import { ContactGroupsDetailInstructionsComponent } from './contact-groups-detail-instructions/contact-groups-detail-instructions.component'
import { ContactGroupsDetailOffersComponent } from './contact-groups-detail-offers/contact-groups-detail-offers.component'
import { ContactGroupsDetailLeadsComponent } from './contact-groups-detail-leads/contact-groups-detail-leads.component'
import { ContactGroupsDetaillettingsManagementsComponent } from './contact-groups-detail-lettings-managements/contact-groups-detail-lettings-managements.component'
import { ContactGroupsDetailValuationsComponent } from './contact-groups-detail-valuations/contact-groups-detail-valuations.component'
import { ContactGroupsDetailTenanciesComponent } from './contact-groups-detail-tenancies/contact-groups-detail-tenancies.component'
import { ContactGroupsDetailSearchesComponent } from './contact-groups-detail-searches/contact-groups-detail-searches.component'
import { SharedPropertyListComponent } from './shared-property-list/shared-property-list.component'
import { SharedLeadRegisterComponent } from './shared-lead-register/shared-lead-register.component'
import { AdditionalInfoComponent } from './additional-info/additional-info.component'
import { SharedValuationListComponent } from './shared-valuation-list/shared-valuation-list.component'
import { OfficeFinderComponent } from './office-finder/office-finder.component'
import { StaffMemberFinderComponent } from './staff-member-finder/staff-member-finder.component'
import { SharedContactGroupListComponent } from './shared-contact-group-list/shared-contact-group-list.component'
import { SidenavItemComponent } from './components/sidenav-item/sidenav-item.component'
import { RedactedTableComponent } from './components/redacted-table/redacted-table.component'
import { PropertyCardComponent } from './components/property-card/property-card.component'
import { ContactGroupCardComponent } from './components/contact-group-card/contact-group-card.component'
import { MarketingPreferencesComponent } from './components/marketing-preferences/marketing-preferences.component'
import { PropertyDetailPhotosComponent } from './components/property-detail-photos/property-detail-photos.component'
import { PropertyDetailMapComponent } from './components/property-detail-map/property-detail-map.component'
import { ContactGroupFinderComponent } from './components/contact-group-finder/contact-group-finder.component'
import { ImportantMessagesComponent } from './components/important-messages/important-messages.component'
import { EmailComponent } from './components/email/email.component'
import { EmailSignatureComponent } from './components/email-signature/email-signature.component'
import { RedactedCardComponent } from './components/redacted-card/redacted-card.component'
import { CompanyFinderComponent } from './components/company-finder/company-finder.component'
import { PureCompanyFinderShellComponent } from './components/company-finder/pure-company-finder-shell.component'
import { InfiniteScrollComponent } from './components/infinite-scroll/infinite-scroll.component'
import { GenericMultiSelectControlComponent } from './generic-multi-select-control/generic-multi-select-control.component'
import { ConfirmationService, MessageService } from 'primeng/api'
import { DialogService } from 'primeng/dynamicdialog'
import { MessagesComponent } from './components/messages/messages.component'
import { FileUploadComponent } from './components/file-upload/file-upload.component'
import { FileListComponent } from './components/file-list/file-list.component'
import { BigButtonComponent } from './components/big-button/big-button.component'
import { StandAloneNoteComponent } from './notes/standalone-note.component'
import { MenuComponent } from './components/menu/menu.component'

// Vendors module
import { VendorsModule } from './vendors.module'

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
  ContactGroupsDetailInstructionsComponent,
  ContactGroupsDetailOffersComponent,
  ContactGroupsDetailLeadsComponent,
  ContactGroupsDetaillettingsManagementsComponent,
  ContactGroupsDetailValuationsComponent,
  ContactGroupsDetailTenanciesComponent,
  ContactGroupsDetailSearchesComponent,
  SharedPropertyListComponent,
  SharedLeadRegisterComponent,
  AdditionalInfoComponent,
  SharedValuationListComponent,
  OfficeFinderComponent,
  StaffMemberFinderComponent,
  SharedContactGroupListComponent,
  SidenavItemComponent,
  RedactedTableComponent,
  PropertyCardComponent,
  ContactGroupCardComponent,
  MarketingPreferencesComponent,
  PropertyDetailPhotosComponent,
  PropertyDetailMapComponent,
  ContactGroupFinderComponent,
  ImportantMessagesComponent,
  EmailComponent,
  EmailSignatureComponent,
  RedactedCardComponent,
  CompanyFinderComponent,
  PureCompanyFinderShellComponent,
  InfiniteScrollComponent,
  GenericMultiSelectControlComponent,
  MessagesComponent,
  FileUploadComponent,
  FileListComponent,
  BigButtonComponent,
  StandAloneNoteComponent,
  MenuComponent
]
const pipes = [
  RoundingPipe,
  TruncatingPipe,
  ShortenNamePipe,
  FormatAddressPipe,
  HighlightPipe,
  BracketsNewLinePipe,
  ToPascalCasePipe,
  SafeHtmlPipe
]
const directives = [AutocompleteOffDirective, NoDoubleTapDirective, OnlyNumbersDirective]

@NgModule({
  declarations: [components, pipes, directives],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, VendorsModule],
  exports: [VendorsModule, components, pipes, directives],
  providers: [ConfirmationService, DialogService, MessageService, DatePipe, CurrencyPipe],
  entryComponents: [
    ConfirmModalComponent,
    ErrorModalComponent,
    NoteModalComponent,
    TelephoneModalComponent,
    SmsModalComponent
  ]
})
export class ComponentsModule {}
