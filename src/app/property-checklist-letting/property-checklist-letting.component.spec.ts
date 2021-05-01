import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyChecklistLettingComponent } from './property-checklist-letting.component';

describe('PropertyChecklistLettingComponent', () => {
  let component: PropertyChecklistLettingComponent;
  let fixture: ComponentFixture<PropertyChecklistLettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyChecklistLettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyChecklistLettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
