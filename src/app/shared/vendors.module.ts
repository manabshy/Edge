import { NgModule } from '@angular/core'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { NgPipesModule } from 'ngx-pipes'

// bootstrap
import { TypeaheadModule } from 'ngx-bootstrap/typeahead'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { InfiniteScrollModule } from 'ngx-infinite-scroll'
import { BsDropdownModule } from 'ngx-bootstrap/dropdown/'
import { CollapseModule } from 'ngx-bootstrap/collapse/'
import { TabsModule } from 'ngx-bootstrap/tabs/'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ModalModule } from 'ngx-bootstrap/modal/'
import { PopoverModule } from 'ngx-bootstrap/popover'
import { ButtonsModule } from 'ngx-bootstrap/buttons'
import { CarouselModule } from 'ngx-bootstrap/carousel'

import { FormlyModule } from '@ngx-formly/core'
import { FormlyPrimeNGModule } from '@ngx-formly/primeng'

// vendor
import { OrderModule } from 'ngx-order-pipe'
import { ToastrModule, ToastContainerModule } from 'ngx-toastr'
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client'
import { AngularStickyThingsModule } from '@w11k/angular-sticky-things'
import { NgSelectModule } from '@ng-select/ng-select'
import { NgxFileDropModule } from 'ngx-file-drop'
import { PrimeNGModule } from './ui-primeng.module'
import { FileUploadModule } from '@iplab/ngx-file-upload'

const externalModules = [
  ReactiveFormsModule,
  FormsModule,
  InfiniteScrollModule,
  CollapseModule,
  TabsModule,
  TypeaheadModule,
  BsDropdownModule,
  BsDatepickerModule.forRoot(),
  ModalModule,
  PopoverModule,
  NgPipesModule,
  ButtonsModule,
  OrderModule,
  ToastrModule,
  ToastContainerModule,
  // AgmCoreModule,
  CarouselModule,
  NgbModule,
  LoadingBarHttpClientModule,
  AngularStickyThingsModule,
  NgSelectModule,
  NgxFileDropModule,
  PrimeNGModule,
  FileUploadModule,
  FormlyModule.forRoot({
    validationMessages: [
      { name: 'required', message: 'This field is required'}
    ],
  }),
  FormlyPrimeNGModule,
  // FormlyRadioModule
]

@NgModule({
  imports: [externalModules],
  exports: [externalModules]
})
export class VendorsModule {}
