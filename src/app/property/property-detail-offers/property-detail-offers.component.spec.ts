import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyDetailOffersComponent } from './property-detail-offers.component';

describe('PropertyDetailOffersComponent', () => {
  let component: PropertyDetailOffersComponent;
  let fixture: ComponentFixture<PropertyDetailOffersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
