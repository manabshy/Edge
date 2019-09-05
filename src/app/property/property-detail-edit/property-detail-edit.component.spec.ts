import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailEditComponent } from './property-detail-edit.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormatAddressPipe } from 'src/app/core/shared/format-address.pipe';
import { PropertyService } from '../shared/property.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockProperty } from '../shared/test-helper';
import { of, Observable } from 'rxjs';
import { mockDropdownListInfo } from 'src/app/contactgroups/shared/test-helper/dropdown-list-data.json';
import { Property } from '../shared/property';

fdescribe('PropertyDetailEditComponent', () => {
  let component: PropertyDetailEditComponent;
  let fixture: ComponentFixture<PropertyDetailEditComponent>;
  let propertyService: PropertyService;
  let propertyServiceSpy;
  let mockSharedService = {
    getDropdownListInfo: () => of(mockDropdownListInfo),
      scrollToFirstInvalidField: () => null,
      ISOToDate: () => Date(),
      isUKMobile: () => false,
      formatPostCode: () => ''
  };
  let property = <Property> <unknown>MockProperty;
  let mockToastrService = {};
  let activedRouteMock = {
      params: of(property.propertyId)
  };
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
        PropertyService,
        FormatAddressPipe,
        // {provide: PropertyService, useValue: mockPropertyService},
        {provide: SharedService, useValue: mockSharedService},
        {provide: ToastrService, useValue: mockToastrService},
        // {provide: ActivatedRoute, useValue: activedRouteMock}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailEditComponent);
    propertyService = TestBed.get(PropertyService);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: setup activedRoute mock for this to work
  // it('set property details correctly from service', async(() => {
  //   const spy = spyOn(propertyService, 'getProperty').and.returnValue(of(property));
  //   let response;
  //   component.propertyId = property.propertyId;
  //   component.ngOnInit();
  //   fixture.detectChanges();
  //   response = component.propertyDetails;
  //   console.log('property Id here...', component.propertyId);
  //   expect(response).toEqual(property);

  //   fixture.whenStable().then(() => {
  //     // expect(response).toEqual(MockProperty);
  //   });
  // }));

  it('display page header', async(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const header = fixture.debugElement.query(By.css('h4'));
      console.log('header', header.nativeElement.textContent);
      expect(header.nativeElement.textContent).toContain('Add Property');
    });
  }));
});
