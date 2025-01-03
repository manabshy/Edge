import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CoreModule } from '../core/core.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [CompanyComponent, CompanyListComponent, CompanyEditComponent, CompanyDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    CompanyRoutingModule
  ],
  exports: [CompanyListComponent]
})
export class CompanyModule { }
