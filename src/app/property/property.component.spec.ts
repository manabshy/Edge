import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyComponent } from './property.component';
import { PropertyService } from './shared/property.service';
import { MockProperties } from './shared/test-helper';
import { of } from 'rxjs';

describe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: ComponentFixture<PropertyComponent>;
  let mockPropertyService;
  let mockProperties;
  let mockSearchTerm;
  beforeEach(waitForAsync(() => {
    mockProperties = MockProperties;
    mockSearchTerm = '413 test address';
    mockPropertyService = jasmine.createSpyObj(['autocompleteProperties']);
    TestBed.configureTestingModule({
      declarations: [ PropertyComponent ],
      providers: [{provide: PropertyService, useValue: mockPropertyService}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should retrieve properties from the service', () => {
    mockPropertyService.autocompleteProperties(mockSearchTerm).and.returnValue(of(mockProperties));
    // component.propertiesAutocomplete(mockSearchTerm);

    expect(component.properties.length).toBe(2);
  });
});
