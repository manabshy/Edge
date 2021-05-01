import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyDetailMapComponent } from './property-detail-map.component';

describe('PropertyDetailMapComponent', () => {
  let component: PropertyDetailMapComponent;
  let fixture: ComponentFixture<PropertyDetailMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
