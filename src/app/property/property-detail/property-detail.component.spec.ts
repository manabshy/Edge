import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailComponent } from './property-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormatAddressPipe } from 'src/app/core/shared/format-address.pipe';
import { PropertyService } from '../shared/property.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

fdescribe('PropertyDetailComponent should', () => {
  let component: PropertyDetailComponent;
  let fixture: ComponentFixture<PropertyDetailComponent>;
  let mockPropertyService;
  let mockSharedService;
  let mockToastrService = {};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailComponent, FormatAddressPipe ],
      imports: [
        HttpClientTestingModule,
        // BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([])
      ],
      providers: [
        FormatAddressPipe,
        {provide: PropertyService, useValue: mockPropertyService},
        {provide: SharedService, useValue: mockSharedService},
        {provide: ToastrService, useValue: mockToastrService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailComponent);
    component = fixture.componentInstance;
    mockPropertyService = jasmine.createSpyObj(['autocompleteProperties, getPropertyDetails']);
    mockSharedService = jasmine.createSpyObj(['getDropdownListInfo']);
    // fixture.detectChanges();
  });

  it('create', () => {
    expect(component).toBeTruthy();
  });
  // it('set property details correctly from service', () => {
  //   mockPropertyService.getPropertyDetails.and.returnValue(of());

  //   fixture.detectChanges();

  //   expect(component.searchedPropertyDetails)
  // });
});
