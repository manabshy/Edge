import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent } from './company.component';
import { CompanyListComponent } from './company-list/company-list.component';
import { CompanyEditComponent } from './company-edit/company-edit.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CoreModule } from '../core/core.module';
import { CompanyFinderComponent } from './shared/company-finder/company-finder.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [CompanyComponent, CompanyListComponent, CompanyEditComponent, CompanyDetailComponent, CompanyFinderComponent],
  imports: [
    CommonModule,
    CoreModule,
    InfiniteScrollModule,
    CompanyRoutingModule
  ],
  exports: [CompanyListComponent, CompanyFinderComponent]
})
export class CompanyModule { }
