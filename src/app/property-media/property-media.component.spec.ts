import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyMediaComponent } from './property-media.component';

describe('PropertyMediaComponent', () => {
  let component: PropertyMediaComponent;
  let fixture: ComponentFixture<PropertyMediaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyMediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
