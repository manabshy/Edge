import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyComponent } from './property.component';
import { PropertyService } from './shared/property.service';
import { MockProperties } from './shared/test-helper';

describe('PropertyComponent', () => {
  let component: PropertyComponent;
  let fixture: ComponentFixture<PropertyComponent>;
  let mockPropertyService;
  let mockProperties;
  beforeEach(async(() => {
    mockProperties = MockProperties;
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
});
