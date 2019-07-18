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
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ngx bootstrap imports
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import {NgPipesModule} from 'ngx-pipes';
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

//vendor
import { OrderModule } from 'ngx-order-pipe';
import { ToastNoAnimationModule } from 'ngx-toastr';

//various
import { AutocompleteOffDirective } from './shared/autocomplete-off.directive';
import { HighlightPipe } from './shared/highlight.pipe';

@NgModule({
  declarations: [RoundingPipe, TruncatingPipe, ShortenNamePipe, BreadcrumbComponent, BasicSearchComponent,
    ConfirmModalComponent, PropertyFinderComponent, FormatAddressPipe, ScoreBadgeComponent,
    ErrorModalComponent, AddressComponent, SignerComponent, AutocompleteOffDirective, HighlightPipe, NoteModalComponent],
  exports: [
    RoundingPipe, TruncatingPipe, ShortenNamePipe, FormatAddressPipe, HighlightPipe, AutocompleteOffDirective,
    BreadcrumbComponent, BasicSearchComponent, NoteModalComponent,
    ConfirmModalComponent, ErrorModalComponent, PropertyFinderComponent, ScoreBadgeComponent, AddressComponent, SignerComponent,
    RouterModule, BrowserAnimationsModule, CollapseModule, TabsModule, TypeaheadModule, BsDropdownModule,
    BsDatepickerModule, ModalModule, PopoverModule,  NgPipesModule,
    TooltipModule, AccordionModule, ButtonsModule, ReactiveFormsModule, FormsModule, OrderModule, ToastNoAnimationModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OrderModule,
    RouterModule,
    BrowserAnimationsModule,
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
    ToastNoAnimationModule.forRoot(),
  ],
  entryComponents: [
    ConfirmModalComponent,
    ErrorModalComponent,
    NoteModalComponent
  ],
  providers: [
    CanDeactivateGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true }
    // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ]
})
export class CoreModule { }
