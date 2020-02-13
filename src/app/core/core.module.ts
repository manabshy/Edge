import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundingPipe } from '../shared/rounding.pipe';
import { TruncatingPipe } from '../shared/truncating.pipe';
import { ShortenNamePipe } from '../shared/shorten-name.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';
import { CacheInterceptor } from './cache.interceptor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// ngx bootstrap imports
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgPipesModule } from 'ngx-pipes';

//ng bootstrap imports
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';
import { ConfirmModalComponent } from '../shared/confirm-modal/confirm-modal.component';
import { PropertyFinderComponent } from '../shared/property-finder/property-finder.component';
import { FormatAddressPipe } from '../shared/format-address.pipe';
import { ScoreBadgeComponent } from '../shared/score-badge/score-badge.component';
import { CanDeactivateGuard } from './shared/can-deactivate.guard';
import { ErrorModalComponent } from '../shared/error-modal/error-modal.component';
import { NoteModalComponent } from '../shared/note-modal/note-modal.component';
import { AddressComponent } from '../shared/address/address.component';
import { SignerComponent } from '../shared/signer/signer.component';
import { NotesComponent } from '../shared/notes/notes.component';
import { TelephoneComponent } from '../shared/telephone/telephone.component';
import { TelephoneModalComponent } from '../shared/telephone-modal/telephone-modal.component';
import { SubnavComponent } from '../shared/subnav/subnav.component';

//vendor
import { OrderModule } from 'ngx-order-pipe';
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { AngularStickyThingsModule } from '@w11k/angular-sticky-things';


//various
import { AutocompleteOffDirective } from '../shared/autocomplete-off.directive';
import { HighlightPipe } from '../shared/highlight.pipe';
import { AppConstants } from './shared/app-constants';
import { SubnavItemComponent } from '../shared/subnav-item/subnav-item.component';
import { SmsModalComponent } from '../shared/sms-modal/sms-modal.component';
import { CustomReuseStrategy } from './share/custom-reuse-strategy';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BracketsNewLinePipe } from '../shared/brackets-new-line.pipe';
import { PersonDetailsComponent } from '../shared/person-details/person-details.component';
import { CompanyInfoComponent } from '../shared/company-info/company-info.component';
import { NoteFormComponent } from '../shared/note-form/note-form.component';

@NgModule({
  declarations: [],
  exports: [ ],
  imports: [
    CommonModule
  ],

  providers: [
    CanDeactivateGuard,
    FormatAddressPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy }
  ]
})
export class CoreModule { }
