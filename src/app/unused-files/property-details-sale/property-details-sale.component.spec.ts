import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyDetailsSaleComponent } from './property-details-sale.component';

describe('PropertyDetailsSaleComponent', () => {
  let component: PropertyDetailsSaleComponent;
  let fixture: ComponentFixture<PropertyDetailsSaleComponent>;

  beforeEach(waitForAsync(() => {
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
