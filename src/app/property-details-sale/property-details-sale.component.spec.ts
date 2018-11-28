import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailsSaleComponent } from './property-details-sale.component';

describe('PropertyDetailsSaleComponent', () => {
  let component: PropertyDetailsSaleComponent;
  let fixture: ComponentFixture<PropertyDetailsSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailsSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailsSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
