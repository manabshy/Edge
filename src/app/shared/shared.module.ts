import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from './rounding.pipe';
import { TruncatingPipe } from './truncating.pipe';
import { ShortenNamePipe } from './shorten-name.pipe';
import { FormatAddressPipe } from './format-address.pipe';
import { HighlightPipe } from './highlight.pipe';
import { BracketsNewLinePipe } from './brackets-new-line.pipe';
import { AutocompleteOffDirective } from './autocomplete-off.directive';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { NoteModalComponent } from './note-modal/note-modal.component';
import { NotesComponent } from './notes/notes.component';
import { SmsModalComponent } from './sms-modal/sms-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { PropertyFinderComponent } from './property-finder/property-finder.component';
import { ScoreBadgeComponent } from './score-badge/score-badge.component';
import { AddressComponent } from './address/address.component';
import { SignerComponent } from './signer/signer.component';
import { TelephoneComponent } from './telephone/telephone.component';
import { TelephoneModalComponent } from './telephone-modal/telephone-modal.component';
import { SubnavComponent } from './subnav/subnav.component';
import { SubnavItemComponent } from './subnav-item/subnav-item.component';
import { PersonDetailsComponent } from './person-details/person-details.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { NoteFormComponent } from './note-form/note-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactgroupsDetailHomeHelperComponent } from '../shared/contactgroups-detail-home-helper/contactgroups-detail-home-helper.component';
import { ContactgroupsDetailInstructionsComponent } from '../shared/contactgroups-detail-instructions/contactgroups-detail-instructions.component';
import { ContactgroupsDetailOffersComponent } from '../shared/contactgroups-detail-offers/contactgroups-detail-offers.component';

// ngx bootstrap imports
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgPipesModule } from 'ngx-pipes';

// ng bootstrap imports
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// bootstrap
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown/';
import { CollapseModule } from 'ngx-bootstrap/collapse/';
import { TabsModule } from 'ngx-bootstrap/tabs/';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal/';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CarouselModule } from 'ngx-bootstrap/carousel';

// vendor
import { OrderModule } from 'ngx-order-pipe';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { AngularStickyThingsModule } from '@w11k/angular-sticky-things';

@NgModule({
  declarations: [
    RoundingPipe,
    TruncatingPipe,
    ShortenNamePipe,
    BreadcrumbComponent,
    ConfirmModalComponent,
    PropertyFinderComponent,
    FormatAddressPipe,
    ScoreBadgeComponent,
    ErrorModalComponent,
    AddressComponent,
    SignerComponent,
    AutocompleteOffDirective,
    HighlightPipe,
    NoteModalComponent,
    NotesComponent, TelephoneComponent,
    TelephoneModalComponent,
    SubnavItemComponent,
    SubnavComponent,
    SmsModalComponent,
    BracketsNewLinePipe,
    PersonDetailsComponent,
    CompanyInfoComponent,
    NoteFormComponent,
    ContactgroupsDetailHomeHelperComponent,
    ContactgroupsDetailInstructionsComponent,
    ContactgroupsDetailOffersComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,

    //to be removed
    InfiniteScrollModule,
    CollapseModule,
    TabsModule,
    TypeaheadModule,
    BsDropdownModule,
    BsDatepickerModule,
    ModalModule,
    PopoverModule,
    NgPipesModule,
    TooltipModule,
    AccordionModule,
    ButtonsModule,
    ReactiveFormsModule,
    FormsModule,
    OrderModule,
    ToastrModule,
    ToastContainerModule,
    AgmCoreModule,
    CarouselModule,
    NgbModule,
    LoadingBarHttpClientModule,
    AngularStickyThingsModule
  ],
  exports: [
    RoundingPipe,
    TruncatingPipe,
    ShortenNamePipe,
    FormatAddressPipe,
    HighlightPipe,
    BracketsNewLinePipe,
    AutocompleteOffDirective,
    BreadcrumbComponent,
    NoteModalComponent,
    NotesComponent,
    SmsModalComponent,
    ConfirmModalComponent,
    ErrorModalComponent,
    PropertyFinderComponent,
    ScoreBadgeComponent,
    AddressComponent,
    SignerComponent,
    TelephoneComponent,
    TelephoneModalComponent,
    SubnavComponent,
    SubnavItemComponent,
    PersonDetailsComponent,
    CompanyInfoComponent,
    NoteFormComponent,
    ContactgroupsDetailHomeHelperComponent,
    ContactgroupsDetailInstructionsComponent,
    ContactgroupsDetailOffersComponent,

    // to be removed
    InfiniteScrollModule,
    CollapseModule,
    TabsModule,
    TypeaheadModule,
    BsDropdownModule,
    BsDatepickerModule,
    ModalModule,
    PopoverModule,
    NgPipesModule,
    TooltipModule,
    AccordionModule,
    ButtonsModule,
    ReactiveFormsModule,
    FormsModule,
    OrderModule,
    ToastrModule,
    ToastContainerModule,
    AgmCoreModule,
    CarouselModule,
    NgbModule,
    LoadingBarHttpClientModule,
    AngularStickyThingsModule
  ],
  entryComponents: [
    ConfirmModalComponent,
    ErrorModalComponent,
    NoteModalComponent,
    TelephoneModalComponent,
    SmsModalComponent
  ],
})
export class SharedModule { }
