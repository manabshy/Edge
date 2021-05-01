import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyDetailsLettingComponent } from './property-details-letting.component';

describe('PropertyDetailsLettingComponent', () => {
  let component: PropertyDetailsLettingComponent;
  let fixture: ComponentFixture<PropertyDetailsLettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailsLettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailsLettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
