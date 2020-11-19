import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyFinderComponent } from './property-finder.component';

describe('PropertyFinderComponent', () => {
  let component: PropertyFinderComponent;
  let fixture: ComponentFixture<PropertyFinderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
