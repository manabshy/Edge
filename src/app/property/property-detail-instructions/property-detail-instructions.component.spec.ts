import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailInstructionsComponent } from './property-detail-instructions.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedService } from 'src/app/core/services/shared.service';
import { mockDropdownListInfo } from 'src/app/contactgroups/shared/test-helper/dropdown-list-data.json';
import { MockProperty, MockInstructions } from '../shared/test-helper';
import { Property, InstructionInfo } from '../shared/property';
import { PropertyService } from '../shared/property.service';
import { delay } from 'rxjs/operators';

fdescribe('PropertyDetailInstructionsComponent', () => {
  let component: PropertyDetailInstructionsComponent;
  let fixture: ComponentFixture<PropertyDetailInstructionsComponent>;
  let propertyService: PropertyService;
  const property = MockProperty as unknown as Property;
  const instructions = MockInstructions as unknown as InstructionInfo[];
  const mockSharedService = {
    getDropdownListInfo: () => of(mockDropdownListInfo),
      scrollToFirstInvalidField: () => null,
      ISOToDate: () => Date(),
      isUKMobile: () => false,
      formatPostCode: () => ''
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailInstructionsComponent ],
      imports: [
        HttpClientTestingModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {provide: SharedService, useValue: mockSharedService},
        {provide: ActivatedRoute, useValue: {
          snapshot: {
            paramMap: convertToParamMap({
            id: '1'
            })
          }}}
       ],
       schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailInstructionsComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.get(PropertyService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('set instructions correctly from service', async(() => {
    const spy = spyOn(propertyService, 'getPropertyInstructions').and.returnValue(of(instructions));
    let response;
    component.ngOnInit();
    component.instructions$
    .pipe(delay(0))
    .subscribe(res => {
      response = res;
      console.log('res', response);
      expect(response).toEqual(instructions);
    });
   
    expect(spy).toHaveBeenCalledWith(1);
  }));
});
