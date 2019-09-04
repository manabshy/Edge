import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailEditComponent } from './property-detail-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormatAddressPipe } from 'src/app/core/shared/format-address.pipe';
import { PropertyService } from '../shared/property.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockProperty } from '../shared/test-helper';
import { of } from 'rxjs';

fdescribe('PropertyDetailEditComponent', () => {
  let component: PropertyDetailEditComponent;
  let fixture: ComponentFixture<PropertyDetailEditComponent>;
  let mockPropertyService;
  let mockSharedService;
  let mockToastrService = {};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailEditComponent ],
      imports: [
        HttpClientTestingModule,
        BrowserModule,
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
    fixture = TestBed.createComponent(PropertyDetailEditComponent);
    component = fixture.componentInstance;
    mockPropertyService = jasmine.createSpyObj(['autocompleteProperties, getProperty']);
    mockSharedService = jasmine.createSpyObj(['getDropdownListInfo']);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('set property details correctly from service', async(() => {
  //   mockPropertyService.getProperty.and.returnValue(of(MockProperty));
  //   fixture.detectChanges();

  //   fixture.whenStable().then(() => {
  //     expect(component.propertyDetails.address).toEqual(MockProperty.address);
  //   });
  // }));
});
