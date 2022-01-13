import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyFeaturesComponent } from './property-features.component';

describe('PropertyFeaturesComponent', () => {
  let component: PropertyFeaturesComponent;
  let fixture: ComponentFixture<PropertyFeaturesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyFeaturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
