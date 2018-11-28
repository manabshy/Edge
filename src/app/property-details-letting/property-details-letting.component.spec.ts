import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailsLettingComponent } from './property-details-letting.component';

describe('PropertyDetailsLettingComponent', () => {
  let component: PropertyDetailsLettingComponent;
  let fixture: ComponentFixture<PropertyDetailsLettingComponent>;

  beforeEach(async(() => {
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
