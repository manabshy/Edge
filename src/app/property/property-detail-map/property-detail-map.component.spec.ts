import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailMapComponent } from './property-detail-map.component';

describe('PropertyDetailMapComponent', () => {
  let component: PropertyDetailMapComponent;
  let fixture: ComponentFixture<PropertyDetailMapComponent>;

  beforeEach(async(() => {
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
