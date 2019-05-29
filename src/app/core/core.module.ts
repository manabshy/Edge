import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from './shared/rounding.pipe';
import { TruncatingPipe } from './shared/truncating.pipe';
import { ShortenNamePipe } from './shared/shorten-name.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AddHeaderInterceptor } from './add-header.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { BasicSearchComponent } from './basic-search/basic-search.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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

@NgModule({
  declarations: [RoundingPipe, TruncatingPipe, ShortenNamePipe, BreadcrumbComponent, BasicSearchComponent,
    ConfirmModalComponent, PropertyFinderComponent, FormatAddressPipe, ScoreBadgeComponent],
  exports: [
    RoundingPipe, TruncatingPipe, ShortenNamePipe, FormatAddressPipe,
    BreadcrumbComponent, BasicSearchComponent,
    ConfirmModalComponent, PropertyFinderComponent,ScoreBadgeComponent, BsDropdownModule,
    CollapseModule, TabsModule, TypeaheadModule,
    BsDatepickerModule, ModalModule, PopoverModule,  NgPipesModule,
    TooltipModule, AccordionModule, ButtonsModule, ReactiveFormsModule, FormsModule
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    AccordionModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  entryComponents: [
    ConfirmModalComponent
  ],
  providers: [
    CanDeactivateGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true }
    // { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true }
  ]
})
export class CoreModule { }
