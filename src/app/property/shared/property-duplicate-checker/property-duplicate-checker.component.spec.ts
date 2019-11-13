import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDuplicateCheckerComponent } from './property-duplicate-checker.component';

describe('PropertyDuplicateCheckerComponent', () => {
  let component: PropertyDuplicateCheckerComponent;
  let fixture: ComponentFixture<PropertyDuplicateCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDuplicateCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDuplicateCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
