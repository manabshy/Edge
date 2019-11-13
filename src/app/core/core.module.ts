import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from './shared/rounding.pipe';
import { TruncatingPipe } from './shared/truncating.pipe';
import { ShortenNamePipe } from './shared/shorten-name.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { BasicSearchComponent } from './basic-search/basic-search.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ngx bootstrap imports
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgPipesModule } from 'ngx-pipes';

//ng bootstrap imports
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//bootstrap
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

//components
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { PropertyFinderComponent } from './property-finder/property-finder.component';
import { FormatAddressPipe } from './shared/format-address.pipe';
import { ScoreBadgeComponent } from './score-badge/score-badge.component';
import { CanDeactivateGuard } from './shared/can-deactivate.guard';
import { ErrorModalComponent } from './error-modal/error-modal.component';
import { NoteModalComponent } from './note-modal/note-modal.component';
import { AddressComponent } from './address/address.component';
import { SignerComponent } from './signer/signer.component';
import { NotesComponent } from './notes/notes.component';
import { TelephoneComponent } from './telephone/telephone.component';
import { TelephoneModalComponent } from './telephone-modal/telephone-modal.component';
import { SubnavComponent } from './subnav/subnav.component';

//vendor
import { OrderModule } from 'ngx-order-pipe';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';

//various
import { AutocompleteOffDirective } from './shared/autocomplete-off.directive';
import { HighlightPipe } from './shared/highlight.pipe';
import { AppConstants } from './shared/app-constants';
import { SubnavItemComponent } from './subnav-item/subnav-item.component';
import { SmsModalComponent } from './sms-modal/sms-modal.component';
import { CustomReuseStrategy } from './share/custom-reuse-strategy';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BracketsNewLinePipe } from './shared/brackets-new-line.pipe';
import { PersonDetailsComponent } from './shared/person-details/person-details.component';

@NgModule({
  declarations: [
    RoundingPipe,
    TruncatingPipe,
    ShortenNamePipe,
    BreadcrumbComponent,
    BasicSearchComponent,
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
    PersonDetailsComponent],
  exports: [
    RoundingPipe,
    TruncatingPipe,
    ShortenNamePipe,
    FormatAddressPipe,
    HighlightPipe,
    BracketsNewLinePipe,
    AutocompleteOffDirective,
    BreadcrumbComponent,
    BasicSearchComponent,
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
    RouterModule,
    // BrowserAnimationsModule,
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
    NgbModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrderModule,
    RouterModule,
    // BrowserAnimationsModule,
    InfiniteScrollModule,
    NgbModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot(),
    ToastrModule.forRoot({ positionClass: 'inline', enableHtml: true }),
    ToastContainerModule,
    CarouselModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC1Hv_vNkUxvvRibyjPbfgNhrTNi30jNtQ'
    })
  ],
  entryComponents: [
    ConfirmModalComponent,
    ErrorModalComponent,
    NoteModalComponent,
    TelephoneModalComponent,
    SmsModalComponent
  ],
  providers: [
    CanDeactivateGuard,
    FormatAddressPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
    // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ]
})
export class CoreModule { }
