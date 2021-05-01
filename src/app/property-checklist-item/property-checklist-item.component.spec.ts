import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyChecklistItemComponent } from './property-checklist-item.component';

describe('PropertyChecklistItemComponent', () => {
  let component: PropertyChecklistItemComponent;
  let fixture: ComponentFixture<PropertyChecklistItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyChecklistItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
